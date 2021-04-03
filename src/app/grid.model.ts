export interface Grid {
	values: number[][];
	// TODO refactor zRange and tRange into range: {z: [], t: []}
	zRange: number[];
	tRange: number[];
	hz: number;
	ht: number;
	valueConstraints: {
		min: number;
		max: number;
	}
	/** if "z", values[i] is a range by z */
	by: "z" | "t"
}
