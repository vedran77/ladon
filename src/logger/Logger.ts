import chalk from "chalk";

class Logger {
	private static _instance: Logger;

	public static get instance(): Logger {
		if (!this._instance) {
			this._instance = new Logger();
		}

		return this._instance;
	}

	public log(eventName: string, meta?: any) {
		console.log(`[${eventName}] ${meta ? JSON.stringify(meta) : ""}`);
	}

	public error(eventName: string, meta?: any) {
		console.error(
			`[${chalk.bgRed(eventName)}] ${meta ? JSON.stringify(meta) : ""}`
		);
	}

	public warn(eventName: string, meta?: any) {
		console.warn(
			`[${chalk.bgYellow(eventName)}] ${meta ? JSON.stringify(meta) : ""}`
		);
	}

	public info(eventName: string, meta?: any) {
		console.info(
			`[${chalk.bgBlue(eventName)}] ${meta ? JSON.stringify(meta) : ""}`
		);
	}

	public success(eventName: string, meta?: any) {
		console.log(
			`[${chalk.bgGreen(eventName)}] ${meta ? JSON.stringify(meta) : ""}`
		);
	}

	public debug(eventName: string, meta?: any) {
		console.debug(
			`[${chalk.bgMagenta(eventName)}] ${meta ? JSON.stringify(meta) : ""
			}`
		);
	}

	public trace(eventName: string, meta?: any) {
		console.trace(
			`[${chalk.bgCyan(eventName)}] ${meta ? JSON.stringify(meta) : ""}`
		);
	}

	public table(eventName: string, meta?: any) {
		console.table(`[${eventName}] ${meta ? JSON.stringify(meta) : ""}`);
	}
}

export { Logger };
