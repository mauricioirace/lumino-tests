import Lumino from 'lumino-js-sdk';
import { LuminoTestEnvironment } from '../../src/types/lumino-test-environment';
import { ChannelState } from '../common';

export function isEmpty(value: any): boolean {
    return Array.isArray(value) ? value.length <= 0 : !value;
}

export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function verifyEnv(env: LuminoTestEnvironment): Promise<void> {
    expect(Object.keys(env.nodes).length).toBe(2);
    const firstNode = env.nodes[0];
    const secondNode = env.nodes[1];
    const firstAddress = await firstNode.client.address;
    const secondAddress = await secondNode.client.address;
    expect(isEmpty(firstAddress)).toBe(false);
    expect(isEmpty(secondAddress)).toBe(false);
}

export async function verifyChannel(
    sdk: Lumino,
    token: string,
    partner: string,
    expected: ChannelState
): Promise<void> {
    const channelInfo = await sdk.getChannel({
        tokenAddress: token,
        partnerAddress: partner
    });

    expect(channelInfo.token_address).toBe(expected.token);
    expect(channelInfo.partner_address).toBe(expected.partner);
    expect(channelInfo.total_deposit).toBe(expected.deposit);
    expect(channelInfo.balance).toBe(expected.balance);
    expect(channelInfo.state).toBe(expected.state);
}
