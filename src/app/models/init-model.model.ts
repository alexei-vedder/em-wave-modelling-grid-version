export interface InitModel {

	l: number;

	L: number;

	/** max time in seconds */
	T: number;

	lambda: number;

	/** light speed in mkm */
	c: number;

	mode: "frames" | "slider";

	by: "z" | "t";

	/** number of points by Z */
	I: number;
	/** number of points by T */
	K: number;
	/** for analytical evaluation */
	epsilon: number;
}
