import {Component, Input} from '@angular/core';
import {floor, random, range, round} from 'mathjs';
import {Grid} from "../models/grid.model";
import {Mode} from "../models/mode.model";


@Component({
	selector: 'plot',
	template: `
		<div class="plot-wrapper">
			<plotly-plot class="plot"
						 [data]="data"
						 [layout]="layout"
						 [config]="config"
						 [frames]="frames">
			</plotly-plot>
		</div>
	`
})
export class PlotComponent {

	data;
	layout;
	frames;
	config;

	@Input()
	mode: Mode = Mode.slider;

	private scheme: Grid;
	private tabFn: Grid;
	private extraSchemes: Grid[];

	@Input()
	set grids(value: { scheme: Grid, tabFn: Grid, extraSchemes: Grid[] }) {
		if (value) {
			this.scheme = value.scheme;
			this.tabFn = value.tabFn;
			this.extraSchemes = value.extraSchemes;
			this.buildPlot();
		}
	}

	private async buildPlot() {

		const borders = this.getPlotBorders();

		this.buildPlotData(borders);

		this.buildLayout(borders);

		this.buildFrames();

		this.config = {
			scrollZoom: true
		}

	}

	private buildPlotData(borders) {

		const sliderBy = this.scheme.by === "z" ? "t" : "z";

		const data = [{
			x: this.scheme.range[this.scheme.by],
			y: this.scheme.values[0],
			mode: 'lines',
			type: 'scatter',
			name: `u(zi, tk)`,
			line: {
				color: "#32d3e2",
				width: 3
			}
		}];

		if (this.mode === Mode.convergence) {
			data[0].name += ` (I = ${this.scheme.range[this.scheme.by].length - 1})`;
			data[0].y = this.scheme.values[this.scheme.values.length - 1];

			for (let scheme of this.extraSchemes) {
				data.push({
					x: scheme.range[scheme.by],
					y: scheme.values[scheme.values.length - 1],
					mode: 'lines',
					type: 'scatter',
					name: `u(zi, tk) (I = ${scheme.range[scheme.by].length})`,
					line: {
						color: "",
						width: 2
					}
				})

			}
		}

		if (this.tabFn && (this.mode === Mode.slider || this.mode === Mode.convergence)) {
			data.push({
				x: this.tabFn.range[this.scheme.by],
				y: this.mode === Mode.slider ? this.tabFn.values[0] : this.tabFn.values[this.tabFn.range[this.tabFn.by].length - 1],
				mode: 'lines',
				type: 'scatter',
				name: `u(z, t)`,
				line: {
					color: "#325ee2",
					width: 3
				}
			})
		}

		if (this.mode === Mode.frames) {
			const framesTotal = 5

			for (let i = 1; i < framesTotal; ++i) {
				const frame = JSON.parse(JSON.stringify(data[0]));
				const valueIndex = floor(i * this.scheme.values.length / (framesTotal - 1)) - 1;
				frame.y = this.scheme.values[valueIndex];
				frame.line.color = ""; // this.getRandomColor();
				frame.name += ` (${sliderBy} = ${this.scheme.range[sliderBy][valueIndex].toPrecision(2)})`
				data.push(frame);
			}

			data[0].name += ` (${sliderBy} = ${this.scheme.range[sliderBy][0].toPrecision(2)})`
		}


		if (this.scheme.by === "z") {
			// @ts-ignore
			data.push({
				x: [borders.left, borders.left, borders.right, borders.right, borders.left],
				y: [borders.bottom, borders.top, borders.top, borders.bottom, borders.bottom],
				mode: "lines",
				name: "layer borders",
				line: {
					width: 2,
					color: "rgba(91, 80, 238, 0.5)"
				}
			})
		}

		this.data = data;
	}

	private buildLayout(borders) {

		const sliderBy = this.scheme.by === "z" ? "t" : "z",
			rangeIndexes = range(0, this.scheme.range[sliderBy].length).toArray() as number[],
			frameDuration = 30 * 100 / this.scheme.range[sliderBy].length;

		const steps = this.generateSliderSteps(
			rangeIndexes,
			this.scheme.range[sliderBy].map(value => value.toPrecision(2))
		);

		this.layout = {
			xaxis: {
				title: `${this.scheme.by}`,
				range: [
					borders.left - 0.1 * (borders.right - borders.left),
					borders.right + 0.1 * (borders.right - borders.left)
				]
			},
			yaxis: {
				title: "u(zi, tk)",
				range: [
					borders.bottom - 0.1 * (borders.top - borders.bottom),
					borders.top + 0.1 * (borders.top - borders.bottom)
				]
			},
			title: "",
		};

		if (this.mode === Mode.slider) {
			Object.assign(this.layout, {
				sliders: [{
					currentvalue: {
						xanchor: "left",
						prefix: `${sliderBy} = `
					},
					transition: {
						duration: 100
					},
					active: 0,
					yanchor: "bottom",
					y: -0.7,
					steps
				}],
				updatemenus: [{
					y: -0.7,
					yanchor: 'top',
					xanchor: 'left',
					showactive: false,
					direction: 'left',
					type: 'buttons',
					pad: {
						t: -55,
						l: 580
					},
					buttons: [{
						method: 'animate',
						args: [null, {
							mode: 'immediate',
							fromcurrent: true,
							transition: {duration: 100},
							frame: {
								duration: frameDuration,
								redraw: false
							}
						}],
						label: 'Play'
					}]
				}]
			})
		}
	}

	private buildFrames() {
		if (this.mode === Mode.slider) {
			const rangeBy = this.scheme.by === "z" ? "t" : "z";
			const rangeIndexes = range(0, this.scheme.range[rangeBy].length).toArray() as number[];

			this.frames = this.generate2dFrames(rangeIndexes, [
				a => this.scheme.values[a],
				b => this.tabFn.values[b]
			]);
		}
	}

	private getPlotBorders() {
		return {
			top: this.scheme.valueConstraints.max,
			right: this.scheme.range[this.scheme.by][this.scheme.range[this.scheme.by].length - 1],
			bottom: this.scheme.valueConstraints.min,
			left: this.scheme.range[this.scheme.by][0]
		}
	}

	private getRandomColor(): string {
		const getRandomColorComponent = () => round(random(255));
		return `rgb(${getRandomColorComponent()},${getRandomColorComponent()},${getRandomColorComponent()})`
	}

	/**
	 * @param args: an array of the variable's tabulated range which needs to be manipulated via a slider
	 * @param funcs
	 *    func example: const wrapperFunc = alpha => return this.x.map(xk => func(xk, alpha))
	 */
	private generate2dFrames(args: number[], funcs: ((arg: number) => number[])[]): any[] {
		return args.map(arg => {
			return {
				name: arg.toString(),
				data: funcs.map(func => ({
					y: func(arg)
				}))
			}
		});
	}

	/**
	 * @param args: an array of a tabulated range of the variable which is needed to be manipulated via a slider
	 * (args had better be an array of indexes like [0, 1, 2, 3], and corresponding values better be put in labels)
	 * @param labels
	 */
	private generateSliderSteps(args: number[], labels ?: (string | number)[]): any[] {
		labels = labels ?? args;
		return args.map((arg, index) => {
			return {
				label: labels[index].toString(),
				args: [[arg.toString()], {
					transition: {
						duration: 150
					}
				}],
				method: "animate"
			}
		})
	}
}
