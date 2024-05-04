import { TeamSpeak, TeamSpeakClient } from "ts3-nodejs-library";

export interface ExtendedConnection extends TeamSpeak {
	connectionId?: string;
	registerCommand?(command: string, callback: (invoker: TeamSpeakClient, args: string[]) => Promise<void>): void;
}
