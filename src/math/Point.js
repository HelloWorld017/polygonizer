import MathAppend from "./MathAppend";

class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	add(point) {
		return new Point(this.x + point.x, this.y + point.y);
	}

	multiply(scala) {
		return new Point(this.x * scala, this.y * scala);
	}

	subtract(point) {
		return this.add(point.multiply(-1));
	}

	divide(point, percentage) {
		if(percentage === undefined) {
			return this.multiply(1 / point);
		}

		return new Point(
			MathAppend.divide(this.x, point.x, percentage),
			MathAppend.divide(this.y, point.y, percentage)
		);
	}

	dot(point) {
		return this.x * point.x + this.y * point.y;
	}

	cross(point) {
		return this.x * point.y - this.y * point.x;
	}

	distance(point) {
		return Math.hypot(this.x - point.x, this.y - point.y);
	}

	equals(point) {
		return point.x === this.x && point.y === this.y;
	}

	get length() {
		return Math.hypot(this.x, this.y);
	}

	get array() {
		return [this.x, this.y];
	}
}

export default Point;
