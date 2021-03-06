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
    enableHub?: boolean;
}

export interface SetupJson {
    enableHub?: boolean;
    nodes: SetupNode[] | number;
    channels: SetupChannel[];
    tokens?: SetupToken[];
    enableExplorer?: boolean;
    notifiers?: number;
}
