import {Component, Input, OnInit} from '@angular/core';
import {PlotModel} from "./plot-model";

function tabulateRange(from: number, to: number, step: number): number[] {
    if (to < from) {
        throw new Error("param 'from' should be less than param 'to'");
    }
    const tabulation: number[] = [];
    let xCurrent = from;
    while (xCurrent <= to + step / 2) {
        tabulation.push(xCurrent);
        xCurrent += step;
    }
    return tabulation;
}

function createGrid(from: { x0, z0 }, to: { xn, zn }, hx = 0.1, hz = 0.1): number[][] {
    const xRange = tabulateRange(from.x0, to.xn, hx);
    const zRange = tabulateRange(from.z0, to.zn, hz);
    const grid = [];
    for (let zj of zRange) {
        grid.push([]);
        for (let xi of xRange) {
            grid[grid.length - 1].push({z: zj, x: xi});
        }
    }
    return grid;
}

@Component({
    selector: 'plot',
    template: `
        <div class="plot-wrapper">
            <plotly-plot class="plot"
                         [data]="graph.data" 
                         [layout]="graph.layout" 
                         [config]="graph.config">
            </plotly-plot>
        </div>
    `
})
export class PlotComponent implements OnInit {

    graph;

    #model: PlotModel;

    get model(): PlotModel {
        return this.#model;
    }

    @Input()
    set model(value: PlotModel) {
        if (value) {
            this.#model = value;
            this.buildPlot();
        }
    }

    ngOnInit() {
        /* TODO remove */ this.buildPlot();
        console.log(createGrid({x0: 0, z0: 0}, {xn: 5, zn: 5}, .5, .5));
    }

    buildPlot() {
        this.graph = {
            data: [{
                x: [0, 1, 2, 3, 4],
                y: [0, 2, 4, 8, 16],
                mode: 'lines',
                type: 'scatter',
                line: {
                    color: "#55a919"
                }
            }],
            layout: {
                xaxis: {
                    title: {
                        text: "z"
                    },
                    range: [0, 4]
                },
                yaxis: {
                    title: {
                        text: "(f(z))"
                    },
                    range: [0, 20]
                },
                title: {
                    text: "Test Plot"
                }
            },
            config: {
                scrollZoom: true
            }
        }
    }
}
