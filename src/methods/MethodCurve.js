import Method from "./Method";
import MethodLine from "./MethodLine";
import Point from "../math/Point";

class MethodCurve extends Method {
	constructor(start, control1, control2, end, options={}) {
		super('Curve');

		this.start = start;
		this.controls = [
			control1, control2
		];
		this.end = end;

		this.options = options;
	}

	pointAt(percentage) {
		return new Point(
			1 * Math.pow(1 - percentage, 3) * Math.pow(percentage, 0) * this.start.x +
			3 * Math.pow(1 - percentage, 2) * Math.pow(percentage, 1) * this.controls[0].x +
			3 * Math.pow(1 - percentage, 1) * Math.pow(percentage, 2) * this.controls[1].x +
			1 * Math.pow(1 - percentage, 0) * Math.pow(percentage, 3) * this.end.x,

			1 * Math.pow(1 - percentage, 3) * Math.pow(percentage, 0) * this.start.y +
			3 * Math.pow(1 - percentage, 2) * Math.pow(percentage, 1) * this.controls[0].y +
			3 * Math.pow(1 - percentage, 1) * Math.pow(percentage, 2) * this.controls[1].y +
			1 * Math.pow(1 - percentage, 0) * Math.pow(percentage, 3) * this.end.y
		);
	}

	divide(percentage) {
		const p12 = this.start.divide(this.controls[0], percentage);
		const p23 = this.controls[0].divide(this.controls[1], percentage);
		const p34 = this.controls[1].divide(this.end, percentage);

		const p123 = p12.divide(p23, percentage);
		const p234 = p23.divide(p34, percentage);

		const p1234 = p123.divide(p234, percentage);

		return [
			new MethodCurve(this.start, p12, p123, p1234),
			new MethodCurve(p1234, p234, p34, this.end)
		];
	}

	get lines() {
		const precision = this.options.precisionLength ?
			Math.ceil(this.length / this.options.precisionLength) :
			this.options.precision;

		const step = 1 / precision;

		let methods = [];
		let left = this;

		for(let i = 0; i < 1; i += step) {
			const [sect1, sect2] = left.divide(step);
			left = sect2;

			methods.push(new MethodLine(sect1.start, sect1.end));
		}

		methods.push(new MethodLine(left.start, left.end));

		return methods;
	}

	get length() {
		let previousPoint = null;
		let length = 0;

		for(let t = 0; t < 1; t += 1 / this.options.precision) {
			if(previousPoint === null) {
				previousPoint = this.pointAt(t);
				continue;
			}

			const newPoint = this.pointAt(t);
			length += previousPoint.distance(newPoint);

			previousPoint = newPoint;
		}

		return length;
	}
}

export default MethodCurve;
