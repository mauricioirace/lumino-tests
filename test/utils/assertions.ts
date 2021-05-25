import { ChannelParams } from 'lumino-js-sdk';
import { sleep } from '.';
import { LuminoNode } from '../../src/types/node';
import { ChannelState } from '../common';

export function given(node: LuminoNode): ExpectationContext {
    return new ExpectationContext(node);
}

export class ExpectationContext {
    constructor(private node: LuminoNode) {}

    expectChannel(channel: ChannelParams): ChannelExpectation {
        return new ChannelExpectation(this.node, channel);
    }
}

export class ChannelExpectation {
    constructor(private node: LuminoNode, private channel: ChannelParams) {}

    async toHaveBalance(expected: number, timeout = 1000, retries = 5) {
        const actual = await this.pollChannelUntil(
            (channel) => expected === channel.balance,
            timeout,
            retries
        );
        expect(actual.balance).toEqual(expected);
    }

    async toHaveDeposit(expected: number, timeout = 1000, retries = 5) {
        const actual = await this.pollChannelUntil(
            (channel) => expected === channel.total_deposit,
            timeout,
            retries
        );
        expect(actual.total_deposit).toEqual(expected);
    }

    async toBeInState(expected: string, timeout = 1000, retries = 5) {
        const actual = await this.pollChannelUntil(
            (channel) => expected === channel.state,
            timeout,
            retries
        );
        expect(actual.state).toEqual(expected);
    }

    // TODO: Remove these polling, as it's actually hiding a bug
    private async pollChannelUntil(
        predicate: (actual: any) => boolean,
        timeout = 1000,
        retries = 5
    ) {
        let actual = await this.node.client.sdk.getChannel(this.channel);
        for (let i = 0; !predicate(actual) && i < retries; i++) {
            await sleep(timeout);
            actual = await this.node.client.sdk.getChannel(this.channel);
        }
        return actual;
    }

    async toBe(expected: ChannelState) {
        const actual = await this.node.client.sdk.getChannel(this.channel);
        if (expected.token !== undefined && expected.token !== null) {
            expect(actual.token_address).toBe(expected.token);
        }
        if (expected.partner !== undefined && expected.partner !== null) {
            expect(actual.partner_address).toBe(expected.partner);
        }
        if (expected.deposit !== undefined && expected.deposit !== null) {
            expect(actual.total_deposit).toBe(expected.deposit);
        }
        if (expected.balance !== undefined && expected.balance !== null) {
            expect(actual.balance).toBe(expected.balance);
        }
        if (expected.state !== undefined && expected.state !== null) {
            expect(actual.state).toBe(expected.state);
        }
    }
}
