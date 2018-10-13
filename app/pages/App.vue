<template>
	<main id="app">
		<canvas ref="canvas"></canvas>
		<aside class="Sidebar Scroller">
			<h1 class="Sidebar__title">Polygonizer</h1>
			<file-selector @file="fileHandler"></file-selector>
			<template v-if="source">
				<props-controller :options="options"></props-controller>
				<path-view :path-list="pathList" v-model="selectedPaths"></path-view>
				<section class="Render">
					<h2 class="Render__title SectionTitle">Render ({{filename}})</h2>
					<button class="Button" @click="render">
						Render
					</button>

					<button class="Button" @click="save">
						Download SVG
					</button>
				</section>
			</template>
		</aside>
	</main>
</template>

<style lang="less">
	* {
		user-select: none;
	}

	html, body {
		padding: 0;
		margin: 0;
	}

	.SectionTitle {
		font-family: 'Roboto Condensed', sans-serif;
		color: #202020;
		margin-top: 40px;
	}
</style>

<style lang="less" scoped>
	#app {
		display: flex;
		background: #f1f2f3;
		align-items: stretch;
		height: 100vh;
		width: 100vw;
	}

	canvas {
		flex: 1;
	}

	.Button {
		cursor: pointer;
		width: 100%;
		height: 60px;
		background: #00bcd4;
		border: none;
		color: #fff;
		font-family: Roboto Condensed;
		font-size: 1.2rem;
		transition: all .4s ease;
		outline: none;

		&:hover {
			background: lighten(#00bcd4, 2%);
		}

		&:active {
			background: darken(#00bcd4, 2%);
		}
	}

	.Sidebar {
		width: 400px;
		padding: 20px;
		box-sizing: border-box;
		overflow: auto;
		border-left: 1px solid #d4d5d6;

		&__title {
			font-family: 'Roboto Condensed';
			font-size: 2rem;
			color: #202020;
		}
	}

	.Scroller {
		color: rgba(0, 0, 0, .1);
		transition: color .4s ease;

		&:hover {
			color: rgba(0, 0, 0, .2);
		}

		&::-webkit-scrollbar {
			background: transparent;
			height: 8px;
		}

		&::-webkit-scrollbar-thumb {
			background: transparent;
			box-shadow: inset 0 0 0 10px;
			//border-radius: 8px;
		}

		&--vertical::-webkit-scrollbar {
			width: 15px;
		}

		&--horizontal::-webkit-scrollbar {
			height: 15px;
		}
	}
</style>

<script>
	import FileSelector from "../components/FileSelector.vue";
	import PathView from "../components/PathView.vue";
	import Polygonizer from "../src/polygonizer";
	import PropsController from "../components/PropsController.vue";

	const polygonizer = new Polygonizer;
	let pathInfo = null;

	export default {
		data() {
			return {
				filename: '',
				source: null,
				svg: null,
				options: polygonizer.options,
				pathList: [],
				selectedPaths: []
			};
		},

		methods: {
			async fileHandler(file) {
				this.source = await new Promise(resolve => {
					const reader = new FileReader();
					reader.onload = () => resolve(reader.result);
					reader.readAsText(file);
				});

				pathInfo = polygonizer.parse(this.source);
				this.pathList = [...Array(pathInfo.path.length)].map((v, i) => i);
				this.selectedPaths = this.pathList.slice();
				this.filename = file.name;

				this.render();
			},

			render() {
				const renderingPaths = pathInfo.path.filter((v, i) => this.selectedPaths.includes(i));
				this.svg = polygonizer.render(this.$refs.canvas, pathInfo.width, pathInfo.height, renderingPaths);
			},

			save() {
				const url = URL.createObjectURL(new Blob([this.svg], {type: 'text/plain'}));
				const a = document.createElement('a');
				a.href = url;
				a.download = this.filename.split('.')[0] + '-polygonized.svg';
				a.click();
			}
		},

		components: {
			FileSelector,
			PathView,
			PropsController
		}
	}
</script>
