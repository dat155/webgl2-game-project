import { getMinMax } from '../primitives/utils.js';
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

        this.boundingBox = null;
        this.updateBoundingBox();

    }

    updateBoundingBox() {

        let vertices = [];

        for (let primitive of this.primitives) {
            let { min, max } = primitive.attributes.POSITION;

            vertices.push(...min);
            vertices.push(...max);
        }

        this.boundingBox = getMinMax(vertices);

    }
    
}