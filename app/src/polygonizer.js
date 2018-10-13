import EdgeArray from "./utils/EdgeArray";
import MathAppend from "./math/MathAppend";
import Parser from "./parser/Parser";
import Point from "./math/Point";

const defaultOptions = {
	precision: 4,
	precisionByLength: true,
	precisionLength: 10,
	scatterDots: 100,
	minLineWidth: 1,
	maxLineWidth: 2,
	minDotSize: 3,
	maxDotSize: 7,
	background: '#2c2c54',
	useFixedDotColor: true,
	dotColor: '#ffffff'
};

class Polygonizer {
	constructor(options={}) {
		this.options = Object.assign({}, defaultOptions, options);
	}

	parse(svg) {
		let options = this.options;

		const parser = new Parser(options);
		let {width, height, path} = parser.parse(svg);
		path = path.map(v => v.toLinePath());

		return {width, height, path};
	}

	scatter({width, height, path}) {
		let options = this.options;

		const dots = [];
		const methods = path.map(v => v.methods).reduce((prev, curr) => prev.concat(curr), []);

		// Scatter Dots
		for(let i = 0; i < options.scatterDots; i++) {
			const dot = new Point(Math.random() * width, Math.random() * height);
			if(path.some(path => path.isDotInLinePath(dot))) {
				dots.push(dot);
			}
		}

		dots.push(
			...path
				.map(
					v => v.points.map(v => {
						v.isFixed = true;
						return v;
					})
				)
				.reduce((prev, curr) => prev.concat(curr), [])
		);

		return {dots, path};
	}

	polygonize({dots, path}) {
		let candidateEdges = new EdgeArray;
		let finishedEdges = new EdgeArray;

		dots.every((v, k) => {
			let v2 = dots.reduce((prev, curr, index) => {
				let distance = curr.distance(v);
				if(prev[1] > distance && index !== k) return [curr, distance];

				return prev;
			}, [undefined, Infinity]);

			if(v2[0] === undefined) return true;

			candidateEdges.push([v, v2[0]]);
			return false;
		});

		while(candidateEdges.length > 0) {
			const currentEdge = candidateEdges.shift();
			const ccwPoints = dots.filter(v => MathAppend.isClockwise(currentEdge[0], currentEdge[1], v) < 0);

			ccwPoints.forEach(p3 => {
				if(p3.equals(currentEdge[0]) || p3.equals(currentEdge[1])) return;

				const circumCircle = MathAppend.circumcircle(currentEdge[0], currentEdge[1], p3);
				if(ccwPoints.every(v => {
					if(v.equals(currentEdge[0]) || v.equals(currentEdge[1]) || v.equals(p3)) return true;
					return circumCircle.point.distance(v) >= circumCircle.radius;
				})) {
					candidateEdges.pushCondition(
						v => !finishedEdges.contains(v),
						[p3, currentEdge[1]],
						[currentEdge[0], p3]
					);

					finishedEdges.push(
						[currentEdge[1], p3],
						[p3, currentEdge[0]],
						currentEdge
					);
				}
			});
		}

		finishedEdges = finishedEdges.filter(([p1, p2]) => {
			const centerPoint = p1.add(p2).divide(2);

			return path.some(v => v.isDotInLinePath(centerPoint));
		});

		return finishedEdges;
	}

	render(canvas, width, height, pathList) {
		let options = this.options;

		const boundingBox = canvas.getBoundingClientRect();
		canvas.width = boundingBox.width;
		canvas.height = boundingBox.height;

		const ctx = canvas.getContext('2d');
		ctx.fillStyle = options.background;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		let scale = Math.min(canvas.width / width, canvas.height / height);
		let xOffset = (canvas.width - width * scale) / 2;
		let yOffset = (canvas.height - height * scale) / 2;

		let svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"` +
			` version="1.1" width="${width * scale}px" height="${height * scale}px">`;

		pathList.forEach(v => {
			let color = v.color;
			if(options.useFixedDotColor) {
				color = options.dotColor;
			}
			ctx.fillStyle = ctx.strokeStyle = color;

			const path = [v];
			path[0].methods.forEach(method => {
				const lineWidth = Math.random() * (options.maxLineWidth - options.minLineWidth) + options.minLineWidth;

				ctx.lineWidth = lineWidth;
				ctx.beginPath();
				ctx.moveTo(xOffset + method.start.x * scale, yOffset + method.start.y * scale);
				ctx.lineTo(xOffset + method.end.x * scale, yOffset + method.end.y * scale);
				ctx.stroke();

				svg += `<path stroke="${color}" stroke-width="${lineWidth}px" fill="none" ` +
					`d="M ${method.start.x * scale}, ${method.start.y * scale}` +
					`L ${method.end.x * scale}, ${method.end.y * scale}"/>`;
			});

			const {dots, _} = this.scatter({width, height, path});
			dots.forEach(dot => {
				const radius = Math.random() * (options.maxDotSize - options.minDotSize) + options.minDotSize;

				ctx.beginPath();
				ctx.arc(xOffset + dot.x * scale, yOffset + dot.y * scale, radius, 0, 2 * Math.PI);
				ctx.fill();
				svg += `<circle cx="${dot.x * scale}" cy="${dot.y * scale}" r="${radius}"` +
						` fill="${color}"/>`;
			});

			const edges = this.polygonize({dots, path});
			edges.forEach(edge => {
				const lineWidth = Math.random() * (options.maxLineWidth - options.minLineWidth) + options.minLineWidth;

				ctx.lineWidth = lineWidth;
				ctx.beginPath();
				ctx.moveTo(xOffset + edge[0].x * scale, yOffset + edge[0].y * scale);
				ctx.lineTo(xOffset + edge[1].x * scale, yOffset + edge[1].y * scale);
				ctx.stroke();

				svg += `<path stroke="${color}" stroke-width="${lineWidth}px" fill="none" ` +
					`d="M ${edge[0].x * scale}, ${edge[0].y * scale}` +
					`L ${edge[1].x * scale}, ${edge[1].y * scale}"/>`;
			});
		});

		svg += "</svg>";

		return svg;
	}
}

export default Polygonizer;
