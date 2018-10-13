<template>
	<div class="PropsController">
		<h2 class="PropsController__title SectionTitle">Configurations</h2>
		<div class="PropsController__dg" ref="gui"></div>
	</div>
</template>

<style lang="less" scoped>
	.PropsController {
		display: flex;
		flex-direction: column;
		align-items: center;

		&__title {
			width: 100%;
			text-align: left;
		}
	}
</style>

<script>
	import * as dat from 'dat.gui';

	let gui = null;

	export default {
		props: {
			options: Object
		},

		mounted() {
			gui = new dat.GUI({
				autoPlace: false,
				closeOnTop: true
			});

			const triangulation = gui.addFolder('Triangulation');
			triangulation.add(this.options, 'precision', 1, 10, 1);
			triangulation.add(this.options, 'precisionByLength');
			triangulation.add(this.options, 'precisionLength', 0, 100, 5);
			triangulation.add(this.options, 'scatterDots');
			triangulation.open();

			const rendering = gui.addFolder('Rendering');
			rendering.add(this.options, 'minLineWidth', 0, 10);
			rendering.add(this.options, 'maxLineWidth', 0, 10);
			rendering.add(this.options, 'minDotSize', 0, 10);
			rendering.add(this.options, 'maxDotSize', 0, 10);
			rendering.addColor(this.options, 'background');
			rendering.add(this.options, 'useFixedDotColor');
			rendering.addColor(this.options, 'dotColor');
			rendering.open();

			this.$refs.gui.appendChild(gui.domElement);
		},

		beforeDestroy() {
			if(gui !== null) gui.destroy();
		}
	};
</script>
