import _ from "lodash";

import { TeamSpeakClient } from "ts3-nodejs-library";
import { CommandArgument, ICommand } from "./ICommand";
import { ExtendedConnection } from "connection-manager/ExtendedConnection";
import { ConnectionManager } from "connection-manager";

class Command {
	private static _commandList: Map<
		string,
		Map<string, (client: TeamSpeakClient, fullText: string, connection: ExtendedConnection, ...args: string[]) => void>
	> = new Map();

	public static callCommand(connectionId: string, client: TeamSpeakClient, text: string): void {
		const connection: ExtendedConnection | undefined = ConnectionManager.instance.get(connectionId);

		if (_.isUndefined(connection)) {
			throw new Error(`Connection ${connectionId} does not exist.`);
		}

		const args: string[] = text.slice(connection.botPrefix!.length).split(/ +/);
		const command: string | undefined = args.shift()?.toLowerCase();

		const commandsOnInstance:
			| Map<string, (client: TeamSpeakClient, fullText: string, connection: ExtendedConnection, ...args: string[]) => void>
			| undefined = this._commandList.get(connectionId);

		if (!command || !commandsOnInstance || !commandsOnInstance.has(command)) {
			client.message(`[b][color=#ff0000] ERROR: [color=#FFFFFF] Command ${command} does not exits.`);
			return;
		}

		const handler: (client: TeamSpeakClient, fullText: string, connection: ExtendedConnection, ...args: string[]) => void =
			commandsOnInstance.get(command)!;
		handler(client, _.join(args, " "), connection, ...args);
	}

	public static loadCommands(connectionId: string, allCommands: ICommand[]): void {
		const connection: ExtendedConnection | undefined = ConnectionManager.instance.get(connectionId);

		if (_.isUndefined(connection)) {
			throw new Error(`Connection ${connectionId} does not exist.`);
		}

		const commandsMap = this._commandList.get(connectionId) || new Map();

		_.forEach(allCommands, (command: ICommand) => {
			commandsMap.set(
				command.name,
				(client: TeamSpeakClient, fullText: string, connection: ExtendedConnection, ...args: string[]) => {
					if (!!command.fullText) {
						if (_.isUndefined(args[0])) {
							client.message(
								`[b]${connection.botColor} USAGE: [color=#FFFFFF] ${connection.botPrefix}${command.name
								} [ ${_.get(command, "args.0.name")} ]`
							);
							return;
						}

						command.handler(client, fullText, ...args);
					} else {
						const commandArgs: Array<number | string> = [];
						let argsCorrect: boolean = true;

						if (!_.isEmpty(args)) {
							if (args.length !== command.args?.length) {
								let args: string = "";

								_.forEach(command.args, (arg) => {
									args += `[ ${arg.name} ] `;
								});

								client.message(
									`[b]${connection.botColor} USAGE: [color=#FFFFFF] ${connection.botPrefix}${command.name} ${args}`
								);
								return;
							}

							_.forEach(command.args, (arg: CommandArgument, current: number) => {
								const currentArgument: string = args[current];
								let parsedArg: number | string = Number(currentArgument);

								if (arg.type === "number") {
									if (_.isNaN(parsedArg)) {
										argsCorrect = false;
										client.message(
											`[b]${connection.botColor} CMD: [color=#FFFFFF] ${connection.botPrefix}${command.name} || parameter ${arg.name} must be number.`
										);
										return;
									}
								}

								if (arg.type === "string") {
									if (!_.isNaN(parsedArg)) {
										argsCorrect = false;
										client.message(
											`[b]${connection.botColor} CMD: [color=#FFFFFF] ${connection.botPrefix}${command.name} || parameter ${arg.name} must be string.`
										);
										return;
									} else {
										parsedArg = currentArgument;
									}
								}

								commandArgs.push(parsedArg);
							});
						}

						if (!argsCorrect) {
							if (command.help) {
								_.forEach(command.help, (help: string) => {
									client.message(
										`[b]${connection.botColor} CMD: [color=#FFFFFF] ${connection.botPrefix}${command.name} || ${help}`
									);
									return;
								});

								return;
							}

							client.message(
								`${connection.botPrefix}${command.name} ${_.join(
									_.map(command.args, (arg: CommandArgument) => `[${arg.name}]`),
									" "
								)}`
							);
						}

						command.handler(client, fullText, ...commandArgs);
					}
				}
			);
		});

		this._commandList.set(connectionId, commandsMap);
	}
}

export { Command };
