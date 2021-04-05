export interface SetupParticipant {
    node: string;
    deposit: number;
}

export interface SetupChannel {
    tokenSymbol: string;
    participant1: SetupParticipant;
    participant2: SetupParticipant;
}

export interface SetupToken {
    symbol: string;
    amount: number;
}

export interface SetupNode {
    name: string;
    tokens: SetupToken[];
}

export interface SetupJson {
    nodes: SetupNode[] | number;
    channels: SetupChannel[];
    tokens?: SetupToken[];
}
