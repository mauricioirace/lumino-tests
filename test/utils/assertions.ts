import { ChannelIdentifier } from 'lumino-js-sdk';
import { sleep } from '.';
import { LuminoNode } from '../../src/types/node';
import { ChannelState } from '../common';

export function given(node: LuminoNode): ExpectationContext {
    return new ExpectationContext(node);
}

export class ExpectationContext {
    constructor(private node: LuminoNode) {}

    expectChannel(identifier: ChannelIdentifier): ChannelExpectation {
        return new ChannelExpectation(this.node, identifier);
    }
}

export class ChannelExpectation {
    constructor(
        private node: LuminoNode,
        private identifier: ChannelIdentifier
    ) {}

    async toHaveBalance(expected: number, timeout = 1000, retries = 5) {
        let actual = await this.node.client.sdk.getChannel(this.identifier);
        for (let i = 0; expected !== actual.balance && i < retries; i++) {
            await sleep(timeout);
            actual = await this.node.client.sdk.getChannel(this.identifier);
        }
        expect(actual.balance).toEqual(expected);
    }

    async toHaveDeposit(expected: number, timeout = 1000, retries = 5) {
        let actual = await this.node.client.sdk.getChannel(this.identifier);
        for (let i = 0; expected !== actual.total_deposit && i < retries; i++) {
            await sleep(timeout);
            actual = await this.node.client.sdk.getChannel(this.identifier);
        }
        expect(actual.total_deposit).toEqual(expected);
    }

    async toBeInState(expected: string, timeout = 1000, retries = 5) {
        let actual = await this.node.client.sdk.getChannel(this.identifier);
        for (let i = 0; expected !== actual.state && i < retries; i++) {
            await sleep(timeout);
            actual = await this.node.client.sdk.getChannel(this.identifier);
        }
        expect(actual.state).toEqual(expected);
    }

    async toBe(expected: ChannelState) {
        const actual = await this.node.client.sdk.getChannel(this.identifier);
        expect(actual.token_address).toBe(expected.token);
        expect(actual.partner_address).toBe(expected.partner);
        expect(actual.total_deposit).toBe(expected.deposit);
        expect(actual.balance).toBe(expected.balance);
        expect(actual.state).toBe(expected.state);
    }
}
