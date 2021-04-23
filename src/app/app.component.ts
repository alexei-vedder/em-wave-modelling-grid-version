import {Component, OnInit} from '@angular/core';
import {InitModel} from "./models/init-model.model";
import {Grid} from "./models/grid.model";
import {Mode} from "./models/mode.enum";

const getInitialModel: () => InitModel = () => {
	const lambda = 2,
		c = 1e14 // 299.792458e12

	return {
		l: 4,
		L: 2,
		c,
		lambda,
		T: lambda / c, // 1.76e-14

		mode: Mode.slider,
		by: "z",

		I: 100,
		K: 100,
		epsilon: 1e-4
	}
};

@Component({
	selector: 'app-root',
	template: `
		<header class="header">
			<h1 class="title header__title">EM wave model / Grid version</h1>
			<h3 class="header__subtitle">By Golubev & Vedernikov, 6408</h3>
		</header>

		<main class="root">
			<init-plot-data [(model)]="model">
			</init-plot-data>

			<p *ngIf="workerNotSupported" style="color: red">Your browser doesn't support WebWorkers. Cannot build the plot</p>

			<plot [grids]="grids"
				  [mode]="model.mode"
				  (initialized)="loading = !$event">
			</plot>

		</main>

		<spinner [enabled]="loading"></spinner>
	`
})
export class AppComponent implements OnInit {

	loading: boolean = false;
	workerNotSupported: boolean = false;
	grids: { scheme: Grid, tabFn: Grid, extraSchemes: Grid[] };
	private worker: Worker;

	private _model: InitModel;

	get model(): InitModel {
		return this._model;
	}

	set model(model: InitModel) {
		this._model = model;
		this.evaluate();
	}

	ngOnInit() {
		if (window.Worker) {
			this.worker = new Worker("./evaluation.worker", {type: "module"});
			this.worker.onmessage = this.onEvaluationDone.bind(this);
			this.model = getInitialModel();
		} else {
			this.workerNotSupported = true;
		}
	}

	private evaluate() {
		this.loading = true;
		this.worker.postMessage([this.model]);
	}

	private onEvaluationDone({data}) {
		console.log("message from worker", data);
		this.grids = data;
	}
}
