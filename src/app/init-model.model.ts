export interface InitModel {

	l: number;

	L: number;

	/** max time in seconds */
	T: number;

	lambda: number;

	/** light speed in mkm */
	c: number;

	mode: "frames" | "slider";

	gridConfig: {
		/** number of points by Z */
		I: number;
		/** number of points by T */
		K: number;

		by: "z" | "t";
	};
}
