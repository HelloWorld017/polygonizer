import arcToBezier from "../math/arcToBezier";
import {parseSVG, makeAbsolute} from "svg-path-parser";

import {DOMParser} from "xmldom";
import MethodCurve from "../methods/MethodCurve";
import MethodLine from "../methods/MethodLine";
import Path from "../path/Path";
import Point from "../math/Point";

class Parser {
	constructor(options) {
		this.options = options;
	}

	parse(svg) {
		const {path: pathList, width, height} = this.parseXMLStructure(svg, 'image/svg+xml');

		const path = pathList
			.reduce((prev, curr) => {
				prev.push(...curr);

				return prev;
			}, []);

		return {
			width,
			height,
			path
		};
	}

	parseXMLStructure(svg) {
		const doc = new DOMParser().parseFromString(svg);
		const nodes = doc.documentElement.getElementsByTagName("path");

		let width = doc.documentElement.getAttribute('width');
		let height = doc.documentElement.getAttribute('height');

		const viewBox = doc.documentElement.getAttribute('viewBox');
		const offset = {x: 0, y: 0};
		if(viewBox) {
			const split = viewBox.split(' ').map(v => parseInt(v));

			width = split[2];
			height = split[3];
			offset.x = -split[0];
			offset.y = -split[1];
		}

		if(!width) {
			width = 0;
		}

		if(!height) {
			height = 0;
		}
		
		const path = [...Array(nodes.length)].map(
			(v, k) => this.parsePath(nodes[k].getAttribute("d"), nodes[k].getAttribute('fill'), offset)
		);
	
		return {path, width, height};
	}

	parsePath(d, color, {x: offsetX, y: offsetY}) {
		const paths = [];

		const addCurve = (method) => {
			paths[0].addMethod(
				new MethodCurve(
					new Point(method.x0 + offsetX, method.y0 + offsetY),
					new Point(method.x1 + offsetX, method.y1 + offsetY),
					new Point(method.x2 + offsetX, method.y2 + offsetY),
					new Point(method.x + offsetX, method.y + offsetY),
					this.options
				)
			);
		}

		const setSmoothControl = (method) => {
			const lastMethod = paths[0].methods[paths[0].methods.length - 1];
			if(lastMethod.type !== 'Curve') {
				method.x1 = method.x;
				method.y1 = method.y;
			} else {
				const newControl = lastMethod.end.add(lastMethod.end.subtract(lastMethod.controls[1]));

				method.x1 = newControl.x;
				method.y1 = newControl.y;
			}

			return method;
		}

		const setQuadratic = (method) => {
			method.x2 = method.x1;
			method.y2 = method.y1;

			return method;
		}

		const pathMethods = makeAbsolute(parseSVG(d));
		pathMethods.forEach(method => {
			if(method.code === 'M' || paths.length === 0) {
				const newPath = new Path;
				newPath.color = color;

				paths.unshift(newPath);
			}

			switch(method.code) {
				case 'Z':
				case 'L':
				case 'V':
				case 'H':
					paths[0].addMethod(
						new MethodLine(
							new Point(method.x0 + offsetX, method.y0 + offsetY),
							new Point(method.x + offsetX, method.y + offsetY)
						)
					);
					break;

				case 'C':
					addCurve(method);
					break;

				case 'S':
					addCurve(setSmoothControl(method));
					break;

				case 'Q':
					addCurve(setQuadratic(method));
					break;

				case 'T':
					addCurve(setQuadratic(setSmoothControl(method)));
					break;

				case 'A':
					arcToBezier({
						px: method.x0,
						py: method.y0,
						cx: method.x,
						cy: method.y,
						rx: method.rx,
						ry: method.ry,
						xAxisRotation: method.xAxisRotation,
						largeArcFlag: +method.largeArc,
						sweepFlag: +method.sweep
					}).forEach(addCurve);
					break;
			}
		});

		return paths;
	}
}

export default Parser;
