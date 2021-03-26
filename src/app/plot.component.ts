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

		console.warn(transposedGridValues)

		// @ts-ignore
		const timeSteps = this.generateSliderSteps(tRangeIndexes, this.grid.tRange);

		// @ts-ignore
		this.frames = this.generate2dFrames(tRangeIndexes, tk => transposedGridValues[tk]);

		this.data = [{
			x: this.grid.zRange,
			y: transposedGridValues[0],
			mode: 'lines',
			type: 'scatter',
			line: {
				color: "#55a919"
			}
		}];

		this.layout = {
			xaxis: {
				title: "z",
				range: [0, 10]
			},
			yaxis: {
				title: "(f(z, t))",
				range: [-3, 3]
			},
			title: "",
			sliders: [{
				currentvalue: {
					xanchor: 'right',
					prefix: "time = "
				},
				active: 0,
				steps: timeSteps
			}],
		};

		this.config = {
			scrollZoom: true
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
				args: [[arg.toString()]],
				method: "animate"
			}
		})
	}
}
