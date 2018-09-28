import { getMinMax } from '../primitives/utils.js';
import { ATTRIBUTE } from '../lib/constants.js';
import Node from '../Node.js';
/**
 * A drawable scenegraph node with material and geometry.
 *
 * @class Mesh
 * @extends {Node}
 */
export default class Mesh extends Node {

    /**
     * @param {Primitive[]} primitives 
     */
    constructor(primitives) {
        super();

        this.primitives = primitives;

    }

    getBoundingBox() {

        let vertices = [];

        for (let primitive of this.primitives) {
            let { min, max } = primitive.attributes[ATTRIBUTE.POSITION];

            vertices.push(...min);
            vertices.push(...max);
        }

        return getMinMax(vertices);

    }
}