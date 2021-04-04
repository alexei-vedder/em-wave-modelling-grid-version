export interface Grid {
	values: number[][];
	range: {
		z: number[];
		t: number[];
	}
	hz: number;
	ht: number;
	valueConstraints: {
		min: number;
		max: number;
	}
	/** if "z", values[i] is a range by z */
	by: "z" | "t"
}
