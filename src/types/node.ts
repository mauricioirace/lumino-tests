import LuminoClient from "../lumino-client";
import {StartedTestContainer} from "testcontainers";

export interface LuminoNode extends Node {
    name: string;
    client: LuminoClient;
}

export interface Node {
    container: StartedTestContainer;
}

export type NodeList = { [key: string]: Node };

