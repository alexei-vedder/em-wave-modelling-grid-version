/// <reference lib="webworker" />


import {SchemeEvaluationService} from "./services/scheme-evaluation.service";
import {Mode} from "./models/mode.model";
import {ceil, round} from "mathjs";
import {InitModel} from "./models/init-model.model";
import {AnalyticalEvaluationService} from "./services/analytical-evaluation.service";

/**
 * based on assumption that TcI <= KL
 */
function resolveTimeDensity(model: InitModel): void {
	model.K = ceil(model.T * model.c * model.I / model.L);
}

async function evaluateAll({data: [model]}) {
	console.log("worker got a message", model);

	const schemeService = new SchemeEvaluationService();
	const tabFnService = new AnalyticalEvaluationService();

	resolveTimeDensity(model);
	const scheme = await schemeService.evaluate(model);
	const tabFn = await tabFnService.evaluate(model);
	const extraSchemes = [];

	if (model.mode === Mode.convergence) {
		for (let i = 2; i <= 8; i *= 2) {
			const changedModel = {...model};
			changedModel.I = round(model.I / i);
			resolveTimeDensity(changedModel);
			extraSchemes.push(await schemeService.evaluate(changedModel));
		}
	}

	const grids = {
		scheme,
		tabFn,
		extraSchemes
	}

	postMessage(grids);
}

addEventListener('message', evaluateAll);
