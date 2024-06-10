import { TeamSpeakClient } from "ts3-nodejs-library";

type CommandArgument = {
	name: string;
	type: "string" | "number";
};

interface ICommand {
	readonly name: string;
	readonly fullText: boolean;
	readonly args?: CommandArgument[];
	readonly adminCommand?: boolean;
	readonly help?: string;
	handler: (client: TeamSpeakClient, fullText: string, ...args: Array<number | string>) => void;
}

export { ICommand, CommandArgument };
