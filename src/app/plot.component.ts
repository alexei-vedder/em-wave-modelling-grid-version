import {Component, Input, OnInit} from '@angular/core';
import {PlotModel} from "./plot-model";

@Component({
    selector: 'plot',
    template: `
        <div class="plot-wrapper">
            <div class="plot"></div>
        </div>
    `
})
export class PlotComponent implements OnInit {

    #model: PlotModel;

    get model(): PlotModel {
        return this.#model;
    }

    @Input()
    set model(value: PlotModel) {
        this.#model = value;
        this.buildPlot();
    }

    ngOnInit() {
        this.buildPlot();
    }

    buildPlot() {
        // TODO
    }
}
