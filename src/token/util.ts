import {SetupToken} from "../types/setup";
import {DEFAULT_TOKENS} from "../constants";

export function getTokenAddress(symbol: string) {
    switch (symbol) {
        case "LUM":
        case "RIF":
        default:
            return '0x4Bc2450bD377c47e4E7e79F830BeE28B37DDe75d';
    }
}

export function validateTokens(tokens?: SetupToken[]): void {
    if (tokens) {
        const notExistentTokens = tokens.filter(token => DEFAULT_TOKENS.indexOf(token.symbol) === -1);
        if (notExistentTokens.length > 0) {
            throw new Error(`You need to specify a valid token symbol on the tokens configuration. 
                                    Valid values are ${DEFAULT_TOKENS}. Error: invalid values ${notExistentTokens.map(token => token.symbol)}`);
        }
    }
}
