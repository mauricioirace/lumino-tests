export const Timeouts = {
    SETUP: 10 * 60 * 1000, // 5 minutes
    TEARDOWN: 10 * 60 * 1000, // 1 minute
    TEST: 5 * 60 * 1000 // 1 minute
};

export enum State {
    OPEN = 'opened',
    CLOSED = 'closed'
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
