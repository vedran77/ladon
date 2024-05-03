import { Logger } from "../logger";
import { TeamSpeak } from "ts3-nodejs-library";
import { uid } from "uid";

class ConnectionManager {
	private static _instance: ConnectionManager;

	private _connections: Map<string, TeamSpeak>;

	public static get instance(): ConnectionManager {
		if (!this._instance) {
			this._instance = new ConnectionManager();
			this._instance._connections = new Map<string, TeamSpeak>();
		}

		return this._instance;
	}

	/**
	 * @description Spawns a new connection
	 * @param {Partial<TeamSpeak.ConnectionParams>} options options
	 * @returns {string} connectionId
	 */
	public async spawn(options: Partial<TeamSpeak.ConnectionParams>): Promise<string> {
		const connectionId: string = uid(32);

		try {
			const tsInstance: TeamSpeak = new TeamSpeak(options);
			const connection = await tsInstance.connect();

			this._connections.set(connectionId, connection);
			Logger.instance.success("connection-manager", {
				message: `Connection ${connectionId} spawned`,
			});
		} catch (error) {
			Logger.instance.error("connection-manager", {
				message: `Failed to spawn connection ${connectionId}`,
				error: error,
			});
		}

		return connectionId;
	}

	/**
	 * @description Destroys a connection
	 * @param {string} connectionId connectionId
	 */
	public destroy(connectionId: string): void {
		const connection: TeamSpeak | undefined = this._connections.get(connectionId);

		if (!connection) {
			Logger.instance.error("connection-manager", {
				message: `Connection ${connectionId} not found`,
			});
			return;
		}

		connection.forceQuit();
		this._connections.delete(connectionId);
		Logger.instance.success("connection-manager", {
			message: `Connection ${connectionId} destroyed`,
		});
	}

	/**
	 * @description Get a connection
	 * @param {string} connectionId connectionId
	 * @returns {TeamSpeak | undefined} connection
	 */
	public get(connectionId: string): TeamSpeak | undefined {
		return this._connections.get(connectionId);
	}

	/**
	 * @description Get all connections
	 * @returns {Map<string, TeamSpeak>} connections
	 */
	public getAll(): Map<string, TeamSpeak> {
		return this._connections;
	}
}

export { ConnectionManager };
