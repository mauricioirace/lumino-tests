import {StartedGenericContainer} from "testcontainers/dist/generic-container";
import LuminoClient from "../lumino-client";

export interface LuminoNode extends Node {
    client: LuminoClient;
}

export interface Node {
    container: StartedGenericContainer;
}

export type NodeList = { [key: string]: Node };

