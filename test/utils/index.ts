import Lumino from 'lumino-js-sdk';

export function isEmpty(value: any): boolean {
    return Array.isArray(value) ? value.length <= 0 : !value;
}

export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export enum State {
    OPEN = 'opened',
    CLOSED = 'closed',
}

export class ChannelState {
    /* Representation of channel data as obtained from a Lumino API. */
    token: string; // hex address
    partner: string; // hex address
    deposit: number; // in Wei
    balance: number; // in Wei
    state: State;

    constructor(
        tokenAddr: string,
        partnerAddr: string,
        totalDeposit: number,
        balance: number,
        state: State
    ) {
        this.token = tokenAddr;
        this.partner = partnerAddr;
        this.deposit = totalDeposit;
        this.balance = balance;
        this.state = state;
    }
}

export async function verifyChannel(
    sdk: Lumino,
    token: string,
    partner: string,
    expected: ChannelState
): Promise<void> {
    const channelInfo = await sdk.getChannel({
        tokenAddress: token,
        partnerAddress: partner,
    });

    expect(channelInfo.token_address).toBe(expected.token);
    expect(channelInfo.partner_address).toBe(expected.partner);
    expect(channelInfo.total_deposit).toBe(expected.deposit);
    expect(channelInfo.balance).toBe(expected.balance);
    expect(channelInfo.state).toBe(expected.state);
}
