import { TeamSpeak, TeamSpeakClient } from "ts3-nodejs-library";

export interface ExtendedConnection extends TeamSpeak {
	connectionId?: string;
	botPrefix?: string;
	botColor?: string;
}
