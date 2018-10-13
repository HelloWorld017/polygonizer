<template>
	<div class="FileSelector">
		<h2 class="FileSelector__title SectionTitle">
			SVG File
		</h2>

		<div class="FileSelector__dropzone"
			:class="{'FileSelector__dropzone--active' : dropzoneActive}"
			@dragover="dragOver"
			@dragleave="dragLeave"
			@drop="drop"
			@click="openInput">

			<p>Drag files here or click to upload</p>
			<input ref="file" type="file" @change="fileHandler">
		</div>
	</div>
</template>

<style lang="less" scoped>
	.FileSelector {
		font-family: 'Roboto Condensed';

		&__dropzone {
			width: 300px;
			height: 200px;
			border: 4px dashed #00bcd4;
			color: #000;
			display: flex;
			justify-content: center;
			align-items: center;
			transition: all .4s ease;
			margin: 0 30px;
			cursor: pointer;

			&--active {
				background: #00bcd4;
				color: #fff;
			}

			input {
				display: none;
			}
		}
	}
</style>

<script>
	export default {
		data() {
			return {
				dropzoneActive: false
			};
		},

		methods: {
			dragOver(e) {
				e.preventDefault();
				e.stopPropagation();
				this.dropzoneActive = true;
			},

			dragLeave(e) {
				e.preventDefault();
				e.stopPropagation();
				this.dropzoneActive = false;
			},

			drop(e) {
				e.preventDefault();
				e.stopPropagation();
				this.dropzoneActive = false;
				this.fileHandler(e);
			},

			openInput() {
				this.$refs.file.value = null;
				this.$refs.file.click();
			},

			fileHandler(event) {
				let files = [];

				if(event.dataTransfer)
					files = event.dataTransfer.files;

				else if(event.target)
					files = event.target.files;

				if(!files[0]) return;

				this.$emit('file', files[0]);
			}
		}
	}
</script>
