
/**
 * A drawable scenegraph node with material and geometry.
 *
 * @class Mesh
 * @extends {Node}
 */
class Mesh extends Node {
    constructor(geometry, material) {
        super();

        this.geometry = geometry;
        this.material = material;
    }
}