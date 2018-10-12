import Color from "./Color";
import Utils from "../utils/Utils";

const hex = n => Utils.padding(Math.floor(n).toString(16), 2);

class ColorRGB extends Color {
	constructor(r, g, b) {
		super();

		this.colorSpaceName = 'rgb';

		this.r = r;
		this.g = g;
		this.b = b;
	}

	add(color) {
		return new ColorRGB(
			this.r + color.r,
			this.g + color.g,
			this.b + color.b
		);
	}

	subtract(color) {
		return new ColorRGB(
			this.r - color.r,
			this.g - color.g,
			this.b - color.b
		);
	}

	multiply(color) {
		return new ColorRGB(
			this.r * color.r,
			this.g * color.g,
			this.b * color.b
		);
	}

	divide(color) {
		return new ColorRGB(
			this.r / color.r,
			this.g / color.g,
			this.b / color.b
		);
	}

	toHex() {
		return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}`;
	}

	static fromHex(hex) {
		return new ColorRGB(...hex.slice(1).match(/[0-9a-f]{2}/g).map(v => parseInt(v, 16)));
	}
}

export default ColorRGB;
