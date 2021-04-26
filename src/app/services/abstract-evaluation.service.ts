import {InitModel} from "../models/init-model.model";
import {Grid} from "../models/grid.model";
import {Matrix, zeros} from "mathjs";

export abstract class AbstractEvaluationService {

	abstract async evaluate(model: InitModel): Promise<Grid>;

	protected createGridTemplate(from: { z, t }, to: { z, t }, I, K, valueConstraints: { min, max }): Grid {
		const zRange = this.tabulateRange(from.z, to.z, I + 1);
		const tRange = this.tabulateRange(from.t, to.t, K + 1);
		const values = (zeros(zRange.length, tRange.length) as Matrix).toArray() as number[][];
		return {
			values,
			range: {
				z: zRange,
				t: tRange
			},
			hz: (to.z - from.z) / (I),
			ht: (to.t - from.t) / (K),
			valueConstraints,
			by: "t"
		};
	}

	private tabulateRange(from: number, to: number, totalPoints: number): number[] {
		if (to < from) {
			throw new Error("param 'from' should be less than param 'to'");
		}
		const tabulation: number[] = [];
		const step = (to - from) / (totalPoints - 1);
		let xCurrent = from;
		while (xCurrent < to + step / 2) {
			tabulation.push(xCurrent);
			xCurrent += step;
		}
		return tabulation;
	}
}
