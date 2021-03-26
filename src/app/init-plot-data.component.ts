import {Component, EventEmitter, Input, Output} from '@angular/core';
import {InitModel} from "./init-model";



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
								  [step]="1e-15"
								  [text]="'T (s)'"></number-input>
				</div>
				<div class="init-plot-data-wrapper__triple-block">
					<number-input [value]="model.lambda" (valueChange)="model.lambda = $event"
								  [step]="1"
								  [text]="'&lambda; (mkm)'"></number-input>
					<number-input [value]="model.c" (valueChange)="model.c = $event"
								  [step]="1e13"
								  [text]="'c (mkm/s)'"></number-input>
					<number-input [value]="model.gridConfig.I" (valueChange)="model.gridConfig.I = $event"
								  [step]="10"
								  [text]="'I (max index by Z)'"></number-input>
					<number-input [value]="model.gridConfig.K" (valueChange)="model.gridConfig.K = $event"
								  [step]="10"
								  [text]="'K (max index by T)'"></number-input>
				</div>
			</div>

			<button class="init-plot-data__button" (click)="buildPlot()">Build the plot</button>
		</div>
	`
})
export class InitPlotDataComponent {

	@Input()
    model: InitModel;

    @Output()
    readonly modelChange: EventEmitter<InitModel> = new EventEmitter<InitModel>();

    buildPlot() {
        this.modelChange.emit(this.model);
    }
}
