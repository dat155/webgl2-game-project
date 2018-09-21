
import Node from '../Node.js';
/**
 * A drawable scenegraph node with material and geometry.
 *
 * @class Mesh
 * @extends {Node}
 */
export default class Mesh extends Node {
    constructor(primitives) {
        super();

        this.primitives = primitives;

    }
}