import { Logger } from "../logger";
import { TeamSpeak } from "ts3-nodejs-library";
import { uid } from "uid";
import { ExtendedConnection } from "./ExtendedConnection";
import { Command } from "command-manager";

interface SpawnOptions extends Partial<TeamSpeak.ConnectionParams> {
	botColor?: string;
	prefix?: string;
}

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
	 * @returns {ExtendedConnection | null} connectionId
	 */
	public async spawn(options: SpawnOptions): Promise<ExtendedConnection | null> {
		const connectionId: string = uid(32);
		let connection: ExtendedConnection | null = null;

		try {
			const { botColor, prefix, ...rest } = options;
			const tsInstance: TeamSpeak = new TeamSpeak(rest);

			connection = await tsInstance.connect();
			connection.connectionId = connectionId;

			if (botColor) {
				connection.botColor = botColor;
			} else {
				connection.botColor = "#ff0000";
			}

			if (prefix) {
				connection.botPrefix = prefix;
			} else {
				connection.botPrefix = "!";
			}

			connection.on("textmessage", (textMessage) => {
				if (textMessage.msg.startsWith(connection!.botPrefix as string)) {
					Command.callCommand(connectionId, textMessage.invoker, textMessage.msg);
				}
			});

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

		return connection;
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
