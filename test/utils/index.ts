import Lumino from 'lumino-js-sdk';
import { LuminoTestEnvironment } from '../../src/types/lumino-test-environment';
import { ChannelState } from '../common';

export function isEmpty(value: any): boolean {
    return Array.isArray(value) ? value.length <= 0 : !value;
}

export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
