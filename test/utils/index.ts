import Lumino from 'lumino-js-sdk';
import { LuminoTestEnvironment } from '../../src/types/lumino-test-environment';
import { LuminoNode } from '../../src/types/node';
import { ChannelState } from '../common';

export function isEmpty(value: any): boolean {
    return Array.isArray(value) ? value.length <= 0 : !value;
}

export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function verifyEnv(env: LuminoTestEnvironment): Promise<void> {
    expect(Object.keys(env.nodes).length).toBe(2);
    const firstNode = env.nodes.node0 as LuminoNode;
    const secondNode = env.nodes.node1 as LuminoNode;
    const firstAddr = (await firstNode.client.sdk.getAddress()).our_address;
    const secondAddr = (await secondNode.client.sdk.getAddress()).our_address;
    expect(isEmpty(firstAddr)).toBe(false);
    expect(isEmpty(secondAddr)).toBe(false);
}
