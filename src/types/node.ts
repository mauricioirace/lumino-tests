import LuminoClient from '../lumino-client';
import { Dictionary } from '../util/collection';
import { StartedTestContainer } from 'testcontainers';

export interface LuminoNode extends Node {
    name: string;
    client: LuminoClient;
}

export interface Node {
    container: StartedTestContainer;
}

export type NodeList = Dictionary<Node>;
