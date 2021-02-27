import {Component} from '@angular/core';
import {PlotModel} from "./plot-model";

@Component({
    selector: 'app-root',
    template: `
        <header class="header">
            <h1 class="title">EM wave model / Grid version</h1>
        </header>

        <main class="root">
            <init-plot-data (modelChange)="model = $event">
            </init-plot-data>
            <plot [model]="model">
            </plot>
        </main>
    `
})
export class AppComponent {
    model: PlotModel;
}
