import { SetupToken } from '../types/setup';
import { Token } from '../constants';
import Web3 from 'web3';

export const tokenAddresses = {
    [Token.LUM.toString()]: '0x0E569743F573323F430B6E14E5676EB0cCAd03D9',
    [Token.RIF.toString()]: '0x1Af2844A588759D0DE58abD568ADD96BB8B3B6D8'
};

export function isValidTokenSymbol(symbol: string): boolean {
    switch (symbol) {
        case Token.LUM.toString():
        case Token.RIF.toString():
            return true;
        default:
            return false;
    }
}

export function toWei(amount: number): number {
    return Number(Web3.utils.toWei(amount.toString()));
}

export function validateTokens(tokens?: SetupToken[]): void {
    if (tokens) {
        const notExistentTokens = tokens.filter(
            (token) => !isValidTokenSymbol(token.symbol)
        );
        if (notExistentTokens.length > 0) {
            throw new Error(`You need to specify a valid token symbol on the tokens configuration. 
                             Valid values are ${Object.keys(Token)}. 
                             Error: invalid values ${notExistentTokens.map(
                                 (token) => token.symbol
                             )}`);
        }
    }
}
