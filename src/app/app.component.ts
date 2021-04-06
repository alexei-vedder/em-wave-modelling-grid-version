import {Component, OnInit} from '@angular/core';
import {InitModel} from "./models/init-model.model";
import {Grid} from "./models/grid.model";
import {Mode} from "./models/mode.model";

const getInitialModel: () => InitModel = () => {
	const
		l = 4,
		L = 2,
		lambda = 2,
		c = 1e14, // 299.792458e12,
		mode = Mode.slider,
		by = "z",
		I = 100,
		K = 100,
		epsilon = 1e-3;

	return {
		l,
		L,
		c,
		lambda,
		T: lambda / c, // 1.76e-14

		mode,
		by,

		I,
		K,
		epsilon
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
		this.worker = new Worker("./evaluation.worker", {type: "module"});
		this.worker.onmessage = this.onEvaluationDone.bind(this);
		this.model = getInitialModel();
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
