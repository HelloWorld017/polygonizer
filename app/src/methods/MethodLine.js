import Method from "./Method";

class MethodLine extends Method {
	constructor(start, end) {
		super('Line');
		this.start = start;
		this.end = end;
	}

	pointAt(percentage) {
		return this.start.divide(this.end, percentage);
	}

	divide(percentage) {
		return [
			new MethodLine(this.start, this.start.divide(this.end, percentage)),
			new MethodLine(this.start.divide(this.end, percentage), this.end)
		];
	}

	get length() {
		return this.start.distance(this.end);
	}
}

export default MethodLine;
