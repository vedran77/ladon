import { Logger } from "../logger/Logger";

export class Connector {
	private static _instance: Connector;

	public static get instance(): Connector {
		if (!this._instance) {
			this._instance = new Connector();
		}

		return this._instance;
	}

	public connect(): void {
		Logger.instance.info("Starting connection...");
	}
}
