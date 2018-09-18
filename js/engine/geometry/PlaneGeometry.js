
import { COMPONENT } from '../lib/constants.js';
import { vec3 } from '../lib/gl-matrix.js';

/**
 * Generates the geometry for a plane.
 *
 * @export
 * @class PlaneGeometry
 */
export default class PlaneGeometry {

    /**
     * Gives us the min and max vectors.
     * This is useful for bounding box checks.
     *
     * @static
     * @param {Array<Number>} vertices
     * @returns { min: Number, max: Number }
     * @memberof BoxGeometry
     */
    static getMinMax(vertices) {

        let min = vec3.fromValues(0, 0, 0);
        let max = vec3.fromValues(0, 0, 0);

        for (let i = 0; i < (vertices.length / 3); i += 3) {

            min[0] = Math.min(min[0], vertices[i + 0]);
            min[1] = Math.min(min[1], vertices[i + 1]);
            min[2] = Math.min(min[2], vertices[i + 2]);

            max[0] = Math.max(max[0], vertices[i + 0]);
            max[1] = Math.max(max[1], vertices[i + 1]);
            max[2] = Math.max(max[2], vertices[i + 2]);

        }

        return {  min, max };

    }

    constructor() {

        let vertices = [
            -0.5, 0, 0.5, // a
            0.5, 0, 0.5,  // b
            0.5, 0, -0.5, // c

            -0.5, 0, 0.5, // a
            0.5, 0, -0.5, // c
            -0.5, 0, -0.5 // d
        ];
        
        let normals = [
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0
        ];

        let uvs = [
            0, 0, // a
            1, 0, // b
            1, 1, // c
            0, 0, // a
            1, 1, // c
            0, 1  // d
        ];


        this.attributeBuffer = new Float32Array(vertices.concat(normals, uvs));

        let { min, max } = this.constructor.getMinMax(vertices);

        this.attributes = {
            POSITION: {
                count: vertices.length,
                byteOffset: 0,
                componentType: COMPONENT.TYPE.FLOAT,
                type: 'VEC3',
                min,
                max
            },
            NORMAL: {
                count: normals.length,
                byteOffset: vertices.length * 4,
                componentType: COMPONENT.TYPE.FLOAT,
                type: 'VEC3'
            },
            TEXCOORD: {
                count: uvs.length,
                byteOffset: vertices.length * 4 + normals.length * 4,
                componentType: COMPONENT.TYPE.FLOAT,
                type: 'VEC2'
            }
        };

        // instantiate Vertex Array Object variable to null.
        this.vao = null;
    }
}