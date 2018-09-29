

/**
 * A drawable part of a mesh.
 *
 * @export
 * @class Primitive
 */
export default class Primitive {

    /**
     * Creates an instance of Primitive.
     * @param {object} attributes An object containing accessors. A POSITION-attribute accessor must be specified.
     * @param {Material} material
     * @param {Accessor} [indices=null] An accessor pointing to an index buffer.
     * @param {integer} [mode=4]
     * 
     * @memberof Primitive
     */
    constructor(attributes, material, indices = null, mode = 4) {

        this.attributes = attributes;
        this.indices = indices;

        this.material = material;
        this.mode = mode;

        this.vao = null;

    }

}