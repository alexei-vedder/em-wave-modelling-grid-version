import {Component, EventEmitter, Output} from '@angular/core';
import {PlotModel} from "./plot-model";

export const INITIAL_MODEL: PlotModel = {
    l: 10,
    L: 4,
    c: 3e14,
    lambda: 2,
    T: 6.67e-15,
    iterationsTotal: 200
}

@Component({
    selector: 'init-plot-data',
    template: `
        <div class="init-plot-data">
            <div class="init-plot-data-wrapper">
                <div class="init-plot-data-wrapper__triple-block">
                    <number-input [value]="model.l" (valueChange)="model.l = $event" [step]="1"
                                  [text]="'l (mkm)'"></number-input>
                    <number-input [value]="model.L" (valueChange)="model.L = $event" [step]="1"
                                  [text]="'L (mkm)'"></number-input>
                    <number-input [value]="model.T" (valueChange)="model.T = $event" [step]="1e-15"
                                  [text]="'T (s)'"></number-input>
                </div>
                <div class="init-plot-data-wrapper__triple-block">
                    <number-input [value]="model.lambda" (valueChange)="model.lambda = $event" [step]="1"
                                  [text]="'&lambda; (mkm)'"></number-input>
                    <number-input [value]="model.c" (valueChange)="model.c = $event" [step]="1e12"
                                  [text]="'c (mkm/s)'"></number-input>
                    <number-input [value]="model.iterationsTotal" (valueChange)="model.iterationsTotal = $event"
                                  [step]="10"
                                  [text]="'iterations total'"></number-input>
                </div>
            </div>

            <button class="init-plot-data__button" (click)="buildPlot()">Build the plot</button>
        </div>
    `
})
export class InitPlotDataComponent {

    model: PlotModel = INITIAL_MODEL;

    @Output()
    readonly modelChange: EventEmitter<PlotModel> = new EventEmitter<PlotModel>();

    buildPlot() {
        this.modelChange.emit(this.model);
    }
}
