import {NodeList} from "../types/node";

export interface LuminoTesting {
    nodes: () => NodeList;
    stop: () => void;
}
