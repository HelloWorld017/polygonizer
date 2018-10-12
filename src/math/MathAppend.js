class MathAppend {
	static clamp(min, value, max) {
		return Math.max(min, Math.min(value, max));
	}

	static divide(s1, s2, percentage=0.5) {
		return (s2 - s1) * percentage + s1;
	}

	static circumcircle(p1, p2, p3) {
		const v12 = p2.subtract(p1);
		const v13 = p3.subtract(p1);
		const v23 = p3.subtract(p2);

		const divisor = Math.pow(v12.cross(v23), 2) * 2;

		const point = (
			p1.multiply(Math.pow(v23.length, 2) * v12.dot(v13) / divisor)
		).add(
			p2.multiply(Math.pow(v13.length, 2) * v12.dot(v23.multiply(-1)) / divisor)
		).add(
			p3.multiply(Math.pow(v12.length, 2) * v13.dot(v23) / divisor)
		);

		const radius = v12.length * v23.length * v13.length / (2 * v12.cross(v23));

		return {point, radius};
	}

	//result < 0: Clockwise
	//result === 0 : on the line
	//result > 0 : Counter-clockwise
	static isClockwise(p1, p2, point){
		return (
			p1.y * p2.x +
			p2.y * point.x +
			point.y * p1.x
		) - (
			p1.x * p2.y +
			p2.x * point.y +
			point.x * p1.y
		);
	}
}

export default MathAppend;
