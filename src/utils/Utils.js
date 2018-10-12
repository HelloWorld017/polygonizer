class Utils {
	static padding(string, amount) {
		return '0'.repeat(Math.max(0, amount - string.length)) + string;
	}
}

export default Utils;
