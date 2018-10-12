import Polygonizer from "./polygonize";

(async () => {
	const polygonizer = new Polygonizer();
	const source = await fetch('/examples/khinenw_logo.svg').then(v => v.text());

	const canvas = document.querySelector('canvas');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	const ctx = canvas.getContext('2d');
	ctx.fillStyle = '#2c2c54';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	let {width, height, path: pathList} = polygonizer.parse(source);
	let scale = Math.min((canvas.width / 2) / width, (canvas.height * 2 / 3) / height);
	//scale = 10;

	let svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"` +
		` version="1.1" width="${width * scale}px" height="${height * scale}px">`;

	//pathList = pathList.slice(0, 1);
	pathList.forEach(v => {
		let color = v.color;
		color = '#fff';

		ctx.fillStyle = ctx.strokeStyle = color;
		ctx.lineWidth = 1.5;

		const path = [v];
		path[0].methods.forEach(method => {
			const lineWidth = Math.random() + 1;

			ctx.lineWidth = lineWidth;
			ctx.beginPath();
			ctx.moveTo(method.start.x * scale, method.start.y * scale);
			ctx.lineTo(method.end.x * scale, method.end.y * scale);
			ctx.stroke();

			svg += `<path stroke="${color}" stroke-width="${lineWidth}px" fill="none" ` +
				`d="M ${method.start.x * scale}, ${method.start.y * scale}` +
				`L ${method.end.x * scale}, ${method.end.y * scale}"/>`;
		});

		const {dots, _} = polygonizer.scatter({width, height, path});
		dots.forEach(dot => {
			const radius = Math.random() * 4 + 3;

			ctx.beginPath();
			ctx.arc(dot.x * scale, dot.y * scale, radius, 0, 2 * Math.PI);
			ctx.fill();
			svg += `<circle cx="${dot.x * scale}" cy="${dot.y * scale}" r="${radius}"` +
					` fill="${color}"/>`;
		});

		const edges = polygonizer.polygonize({dots, path});
		edges.forEach(edge => {
			const lineWidth = Math.random() + 1;

			ctx.lineWidth = lineWidth;
			ctx.beginPath();
			ctx.moveTo(edge[0].x * scale, edge[0].y * scale);
			ctx.lineTo(edge[1].x * scale, edge[1].y * scale);
			ctx.stroke();

			svg += `<path stroke="${color}" stroke-width="${lineWidth}px" fill="none" ` +
				`d="M ${edge[0].x * scale}, ${edge[0].y * scale}` +
				`L ${edge[1].x * scale}, ${edge[1].y * scale}"/>`;
		});
	});

	svg += "</svg>";

	document.querySelector('div').innerText = svg;
})();
