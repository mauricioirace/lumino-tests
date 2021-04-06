import {StartedGenericContainer} from "testcontainers/dist/generic-container";
import LuminoClient from "../lumino-client";
import { Dictionary } from "../util/collection";

export interface LuminoNode extends Node {
    client: LuminoClient;
}

export interface Node {
    container: StartedGenericContainer;
}

export type NodeList = Dictionary<Node>

