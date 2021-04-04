import {Component} from '@angular/core';
import {InitModel} from "./models/init-model.model";
import {SchemeEvaluationService} from "./services/scheme-evaluation.service";
import {Grid} from "./models/grid.model";
import {AnalyticalEvaluationService} from "./services/analytical-evaluation.service";
import {Mode} from "./models/mode.model";
import {ceil, round} from "mathjs";

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
				  [mode]="model.mode">
			</plot>
		</main>
	`
})
export class AppComponent {

	grids: { scheme: Grid, tabFn: Grid, extraSchemes: Grid[] };

	constructor(private schemeService: SchemeEvaluationService,
				private tabFnService: AnalyticalEvaluationService) {
		this.model = getInitialModel();
	}

	private _model: InitModel;

	get model(): InitModel {
		return this._model;
	}

	set model(model: InitModel) {
		this._model = model;
		this.evaluate();
	}

	private async evaluate() {
		this.resolveTimeDensity(this.model);
		const scheme = await this.schemeService.evaluate(this.model);
		const tabFn = await this.tabFnService.evaluate(this.model);
		const extraSchemes = [];

		if (this.model.mode === Mode.convergence) {
			for (let i = 2; i <= 8; i *= 2) {
				const model = {...this.model};
				model.I = round(this.model.I / i);
				this.resolveTimeDensity(model);
				extraSchemes.push(await this.schemeService.evaluate(model));
			}
		}

		this.grids = {
			scheme,
			tabFn,
			extraSchemes
		}
	}

	/**
	 * based on assumption that TcI <= KL
	 */
	private resolveTimeDensity(model: InitModel): void {
		model.K = ceil(model.T * model.c * model.I / model.L);
	}
}
