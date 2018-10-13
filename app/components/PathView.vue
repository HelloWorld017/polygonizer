<template>
	<div class="PathView">
		<h2 class="PathView__title SectionTitle">
			Rendering Paths
		</h2>

		<div class="PathList">
			<label class="PathItem PathItem--all">
				<span class="PathItem__title">
					Select / Deselect All
				</span>

				<div class="Checkbox">
					<input class="Checkbox__input" type="checkbox" v-model="selectedAll">
					<div class="Checkbox__visual"></div>
				</div>
			</label>

			<label class="PathItem" v-for="index in pathList">
				<span class="PathItem__title">
					Path {{index}}
				</span>

				<div class="Checkbox">
					<input class="Checkbox__input" type="checkbox" :value="index" v-model="_checkedPaths">
					<div class="Checkbox__visual"></div>
				</div>
			</label>
		</div>
	</div>
</template>

<style lang="less" scoped>
	.PathView {
		display: flex;
		flex-direction: column;
	}

	.PathList {
		margin: 5px;
		background: #fff;
		box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .3);
	}

	.PathItem {
		display: flex;
		color: #202020;
		justify-content: space-between;
		padding: 10px 30px;
		//border-bottom: 1px solid #d0d0d0;

		&__title {
			font-family: 'Roboto Condensed', sans-serif;
		}

		&--all {
			font-weight: bold;
			border-bottom: 1px solid #d0d0d0;
		}
	}

	.Checkbox {
		display: flex;
		justify-content: center;
		align-items: center;

		&__input {
			position: absolute;
			appearance: none;
		}

		&__visual {
			cursor: pointer;
			width: 1rem;
			height: 1rem;

			display: flex;
			justify-content: center;
			align-items: center;
			transition: all .25s ease-in-out;

			&::before, &::after {
				content: '';
				display: block;
				height: 0;
				border: 1px solid #d0d0d0;
				transition: all .25s ease-in-out;
			}

			&::before {
				width: 0.2rem;
				transform-origin: right center;
			}

			&::after {
				width: 0.4rem;
				transform-origin: left center;
			}
		}

		&__input:checked + &__visual {
			background: #00bcd4;

			&::before, &::after {
				border-color: #fff;
			}

			&::before {
				transform: translate(0.05rem, 0.15rem) rotate(45deg);
			}

			&::after {
				transform: translate(0.05rem, 0.15rem) rotate(-45deg);
			}
		}
	}
</style>

<script>
	export default {
		model: {
			prop: 'checkedPaths',
			event: 'selection'
		},

		props: {
			pathList: Array,
			checkedPaths: Array
		},

		computed: {
			_checkedPaths: {
				get() {
					return this.checkedPaths;
				},

				set(value) {
					this.$emit('selection', value);
				}
			},

			selectedAll: {
				get() {
					return this.checkedPaths.length === this.pathList.length;
				},

				set(value) {
					if(value === true) {
						this._checkedPaths = this.pathList.slice();
						return;
					}

					this._checkedPaths = [];
				}
			}
		}
	};
</script>
