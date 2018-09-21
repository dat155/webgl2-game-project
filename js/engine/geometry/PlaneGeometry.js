
import { COMPONENT } from '../lib/constants.js';
import Geometry from './Geometry.js';

/**
 * Generates the geometry for a plane.
 *
 * @export
 * @class PlaneGeometry
 */
export default class PlaneGeometry extends Geometry {

    constructor() {
        super();

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

    }
}