export const Timeouts = {
    SETUP: 10 * 60 * 1000, // 5 minutes
    TEARDOWN: 10 * 60 * 1000, // 1 minute
    TEST: 5 * 60 * 1000 // 1 minute
};

export enum State {
    OPEN = 'opened',
    CLOSED = 'closed'
}

export interface ChannelState {
    /* Representation of channel data as obtained from a Lumino API. */
    token?: string; // hex address
    partner?: string; // hex address
    deposit?: number; // in Wei
    balance?: number; // in Wei
    state?: State;
}
