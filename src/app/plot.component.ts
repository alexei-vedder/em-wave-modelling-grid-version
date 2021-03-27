import {Component, Input} from '@angular/core';
import {range, transpose} from 'mathjs';
import {Grid} from "./evaluation.service";


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

	private _grid: Grid;

	get grid(): Grid {
		return this._grid;
	}

	@Input()
	set grid(value: Grid) {
		if (value) {
			this._grid = value;
			this.buildPlot();
		}
	}

	buildPlot() {

		const tRangeIndexes = range(0, this.grid.tRange.length).toArray();
		const transposedGridValues = transpose(this.grid.values);

		// @ts-ignore
		const timeSteps = this.generateSliderSteps(tRangeIndexes, this.grid.tRange.map(value => value.toPrecision(2)));

		// @ts-ignore
		this.frames = this.generate2dFrames(tRangeIndexes, tk => transposedGridValues[tk]);

		const borders = this.getPlotBorders();

		this.data = [{
			x: this.grid.zRange,
			y: transposedGridValues[0],
			mode: 'lines',
			type: 'scatter',
			name: "u(zi, tk)",
			line: {
				color: "#32d3e2",
				width: 3
			}
		}, {
			x: [borders.left, borders.left, borders.right, borders.right, borders.left],
			y: [borders.bottom, borders.top, borders.top, borders.bottom, borders.bottom],
			mode: "lines",
			name: "layer borders",
			line: {
				width: 2,
				color: "rgba(91, 80, 238, 0.5)"
			}
		}];

		this.layout = {
			xaxis: {
				title: "z, mkm",
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
			sliders: [{
				currentvalue: {
					xanchor: "left",
					prefix: "time = "
				},
				transition: {
					duration: 100
				},
				active: 0,
				yanchor: "bottom",
				y: -0.7,
				steps: timeSteps
			}],
			updatemenus: [{
				y: -0.7,
				yanchor: 'top',
				xanchor: 'right',
				showactive: false,
				direction: 'left',
				type: 'buttons',
				pad: {t: -55, r: -580},
				buttons: [{
					method: 'animate',
					args: [null, {
						mode: 'immediate',
						fromcurrent: true,
						transition: {duration: 100},
						frame: {
							duration: 30 * 100 / this.grid.tRange.length,
							redraw: false
						}
					}],
					label: 'Play'
				}]
			}],
		};

		this.config = {
			scrollZoom: true
		}

	}

	private getPlotBorders() {
		return {
			top: this.grid.valueConstraints.max,
			right: this.grid.zRange[this.grid.zRange.length - 1],
			bottom: this.grid.valueConstraints.min,
			left: this.grid.zRange[0]
		}
	}

	/**
	 * @param args: an array of the variable's tabulated range which needs to be manipulated via a slider
	 * @param func: a function which returns values of the given args.
	 *    func example: const wrapperFunc = alpha => return this.x.map(xk => func(xk, alpha))
	 */
	private generate2dFrames(args: number[], func: (arg: number) => number[]): any[] {
		return args.map(arg => {
			return {
				name: arg.toString(),
				data: [{
					y: func(arg)
				}]
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
