import EdgeArray from "./utils/EdgeArray";
import MathAppend from "./math/MathAppend";
import Parser from "./parser/Parser";
import Point from "./math/Point";

const defaultOptions = {
	precision: 4,
	precisionLength: 10,
	dots: 100
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
		for(let i = 0; i < options.dots; i++) {
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


}

export default Polygonizer;
