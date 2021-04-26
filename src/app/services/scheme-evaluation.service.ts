import {pi, sin, square, transpose} from 'mathjs';
import {InitModel} from "../models/init-model.model";
import {Grid} from "../models/grid.model";
import {AbstractEvaluationService} from "./abstract-evaluation.service";

export class SchemeEvaluationService extends AbstractEvaluationService {

	async evaluate(model: InitModel): Promise<Grid> {

		const {c, lambda, l, L, T, I, K} = model;

		const scheme = this.createGridTemplate(
			{z: 0, t: 0},
			{z: L, t: T},
			I,
			K,
			{
				min: -l / 2,
				max: l / 2
			}
		);

		const {ht, hz, values: u} = scheme,
			{min: minValue, max: maxValue} = scheme.valueConstraints,
			omega = 2 * pi * (c / lambda),
			greekPi = pi * c / l;


		for (let i = 0; i <= I; ++i) {
			u[i][0] = 0;
		}

		for (let k = 1; k <= K; ++k) {
			u[0][k] = sin(omega * k * ht);
		}

		for (let k = 1; k <= K; ++k) {
			u[I][k] = 0;
		}

		const a = square(ht),
			b = square(c / hz);

		for (let k = 1; k <= K - 1; ++k) {
			for (let i = 1; i <= I - 1; ++i) {

				const d1 = u[i + 1][k],
					d2 = u[i][k],
					d3 = u[i - 1][k],
					d = d1 - 2 * d2 + d3,
					e = greekPi * u[i][k],
					g = (2 * u[i][k]) - u[i][k - 1],
					h = b * d;

				const value = a * (h - e) + g;

				u[i][k + 1] = value // < minValue ? minValue : maxValue < value ? maxValue : value;
			}
		}

		if (model.by === "z") {
			scheme.values = transpose(scheme.values);
			scheme.by = "z";
		}

		return scheme;
	}
}
