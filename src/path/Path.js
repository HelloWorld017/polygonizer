import inside from "point-in-polygon";

class Path {
	constructor() {
		this.methods = [];
		this.methodLens = [];
		this.color = null;
	}

	addMethod(method) {
		this.methods.push(method);
		this.methodLens.push(this.length + method.length);
	}

	recalculateLen() {
		this.methodLens = [];
		this.methods.reduce((prev, v, i) => {
			const newLen = prev + v.length;
			this.methodLens[i] = newLen;
		}, 0);
	}

	slice(start, end) {
		let startMethod = 0;
		let startOffset = 0;
		let endMethod = 0;
		let endOffset = 0;

		const newPath = new Path;
		newPath.color = this.color;

		this.methods.reduce((prev, curr, index) => {
			const methodLength = curr.length;
			const newValue = prev + methodLength;

			if(prev <= start && start <= newValue) {
				startMethod = index;
				startOffset = (start - prev) / methodLength;
			}

			if(prev <= end && end <= newValue) {
				endMethod = index;
				endOffset = (newValue - end) / methodLength;
			}

			return newValue;
		}, 0);

		for(let i = startMethod; i <= endMethod; i++) {
			let methodPart = this.methods[i];

			if(startMethod === i) {
				methodPart = methodPart.divide(startOffset)[1];
			}

			if(endMethod === i) {
				methodPart = methodPart.divide(endOffset)[0];
			}

			newPath.addMethod(methodPart);
		}

		return newPath;
	}

	pointAt(t) {
		const absT = t * this.length;
		const methodIndex = this.methodLens.findIndex((v, i, arr) => (arr[i - 1] || 0) <= absT && absT <= v);
		if(!methodIndex < 0) return;

		const method = this.methods[methodIndex];
		const methodLen = this.methodLens[methodIndex] - (this.methodLens[methodIndex - 1] || 0);

		const relT = absT - (this.methodLens[methodIndex - 1] || 0);

		return method.pointAt(relT / methodLen);
	}

	toLinePath() {
		const path = new Path;
		path.color = this.color;
		path.methods = this.methods.map(v => v.type === 'Curve' ? v.lines : [v]).reduce((prev, curr) => {
			prev.push(...curr);
			return prev;
		}, []);

		return path;
	}

	isDotInLinePath(dot) {
		return inside(dot.array, this.points.map(v => v.array));
	}

	get length() {
		return this.methodLens[this.methodLens.length - 1] || 0;
	}

	get points() {
		const points = this.methods.map(line => line.end);
		points.unshift(this.methods[0].start);

		return points;
	}
}

export default Path;
