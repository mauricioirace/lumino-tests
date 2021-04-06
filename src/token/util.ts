import Web3 from "web3";

export function getTokenAddress(symbol:string): string {
    switch (symbol) {
        case "LUM":
        case "RIF":
        default:
            return '0x4Bc2450bD377c47e4E7e79F830BeE28B37DDe75d';
    }
}

export function toWei(amount: Number): Number {
    return Number(Web3.utils.toWei(amount.toString()))
}