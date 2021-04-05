import {Node} from "types/node";

export interface LuminoTesting {
    nodes: () => Node[];
    stop: () => void;
}
