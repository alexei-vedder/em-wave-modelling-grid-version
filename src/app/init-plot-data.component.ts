import {Component, EventEmitter, Input, Output} from '@angular/core';
import {InitModel} from "./init-model.model";


@Component({
	selector: 'init-plot-data',
	template: `
		<div class="init-plot-data">
			<div class="init-plot-data-wrapper">
				<div class="init-plot-data-wrapper__triple-block">
					<number-input [value]="model.l" (valueChange)="model.l = $event"
								  [step]="1"
								  [text]="'l (mkm)'"></number-input>
					<number-input [value]="model.L" (valueChange)="model.L = $event"
								  [step]="1"
								  [text]="'L (mkm)'"></number-input>
					<number-input [value]="model.T" (valueChange)="model.T = $event"
								  [step]="1e-14"
								  [text]="'T (s)'"></number-input>
					<radio-group-field [items]="plotVariableOptions"
									   [text]="'Plot variable'"
									   [value]="plotVariableOptions[0]" (valueChange)="model.gridConfig.by = $event.id"></radio-group-field>
				</div>
				<div class="init-plot-data-wrapper__triple-block">
					<number-input [value]="model.lambda" (valueChange)="model.lambda = $event"
								  [step]="1"
								  [text]="'&lambda; (mkm)'"></number-input>
					<number-input [value]="model.c" (valueChange)="model.c = $event"
								  [step]="5e13"
								  [text]="'c (mkm/s)'"></number-input>
					<number-input [value]="model.gridConfig.I" (valueChange)="model.gridConfig.I = $event"
								  [step]="10"
								  [text]="'I (max index by Z)'"></number-input>
					<radio-group-field [items]="plotModeOptions"
									   [text]="'Mode'"
									   [value]="plotModeOptions[0]" (valueChange)="model.mode = $event.id"></radio-group-field>
				</div>
			</div>

			<button class="init-plot-data__button" (click)="buildPlot()">Build the plot</button>
		</div>
	`
})
export class InitPlotDataComponent {

	plotVariableOptions = [
		{
			id: "z",
			text: "z"
		},
		{
			id: "t",
			text: "t"
		}
	];

	plotModeOptions = [
		{
			id: "slider",
			text: "slider"
		},
		{
			id: "frames",
			text: "frames"
		}
	];


	@Output()
	readonly modelChange: EventEmitter<InitModel> = new EventEmitter<InitModel>();

	private _model: InitModel;

	get model(): InitModel {
		return this._model;
	}

	@Input()
	set model(model: InitModel) {
		this._model = model;
		this.plotVariableOptions.sort((o1, o2) => {
			return o1.id === model.gridConfig.by ? -1 : o2.id === model.gridConfig.by ? 1 : 0;
		});
		this.plotModeOptions.sort((o1, o2) => {
			return o1.id === model.mode ? -1 : o2.id === model.mode ? 1 : 0;
		});
	}

	buildPlot() {
		this.modelChange.emit(this._model);
	}
}
