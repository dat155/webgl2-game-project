
import { vec3 } from '../lib/gl-matrix.js';
import { COMPONENT } from '../lib/constants.js';
import { getMinMax } from './utils.js';

import BufferView from '../mesh/BufferView.js';
import Accessor from '../mesh/Accessor.js';
import Primitive from '../mesh/Primitive.js';

const isLittleEndian = new Uint8Array(new Uint32Array([0x12345678]).buffer)[0] === 0x78;

/**
 * Generates a box, and returns a primitive.
 * 
 * @param {Material} material 
 * @param {integer} mode 
 * @param {boolean} [flipNormals=false]
 * @returns {Primitive}
 */
export default (material, flipNormals = false, mode) => {

    const indices = [];
    const vertices = [];
    const uvs = [];
    const normals = [];

    const baseVertices = [
        vec3.fromValues(-0.5, -0.5, 0.5),
        vec3.fromValues(-0.5, 0.5, 0.5),
        vec3.fromValues(0.5, 0.5, 0.5),
        vec3.fromValues(0.5, -0.5, 0.5),
        vec3.fromValues(-0.5, -0.5, -0.5),
        vec3.fromValues(-0.5, 0.5, -0.5),
        vec3.fromValues(0.5, 0.5, -0.5),
        vec3.fromValues(0.5, -0.5, -0.5)
    ];

    const faces = [
        [1, 0, 3, 2],
        [2, 3, 7, 6],
        [3, 0, 4, 7],
        [6, 5, 1, 2],
        [4, 5, 6, 7],
        [5, 4, 0, 1]
    ];

    for (let f = 0; f < faces.length; ++f) {

        // generate indices.
        const offset = f * 4;

        if (flipNormals) {
            indices.push(offset, offset + 2, offset + 1); // face 1 reversed
            indices.push(offset, offset + 3, offset + 2); // face 2 reversed
        } else {
            indices.push(offset, offset + 1, offset + 2); // face 1
            indices.push(offset, offset + 2, offset + 3); // face 2
        }

        // generate vertices.
        const a = baseVertices[faces[f][0]];
        const b = baseVertices[faces[f][1]];
        const c = baseVertices[faces[f][2]];
        const d = baseVertices[faces[f][3]];

        vertices.push(...a, ...b, ...c, ...d);

        // generate uvs.
        uvs.push(0, 0);
        uvs.push(1, 0);
        uvs.push(1, 1);
        uvs.push(0, 1);

        // generate normals.
        const ab = vec3.subtract(vec3.create(), a, b);
        const bc = vec3.subtract(vec3.create(), b, c);

        const normal = vec3.normalize(vec3.create(), vec3.cross(vec3.create(), ab, bc));

        normals.push(...normal, ...normal, ...normal, ...normal); // same normal for every vertex in this face.

    }

    const attributeBuffer = new ArrayBuffer(vertices.length * 4 + normals.length * 4 + uvs.length * 4); // 4, as in 4 bytes per element.

    const dataView = new DataView(attributeBuffer);

    // copy over vertices.
    for (let i = 0; i < vertices.length; i++) {
        dataView.setFloat32(i * 4, vertices[i], isLittleEndian);
    }

    // copy over normals.
    for (let i = 0; i < normals.length; i++) {
        dataView.setFloat32((vertices.length + i) * 4, normals[i], isLittleEndian);
    }

    // copy over uvs.
    for (let i = 0; i < uvs.length; i++) {
        dataView.setFloat32((vertices.length + normals.length + i) * 4, uvs[i], isLittleEndian);
    }

    const bufferView = new BufferView(attributeBuffer);

    let { min, max } = getMinMax(vertices);


    const attributes = {
        POSITION: new Accessor(bufferView, COMPONENT.TYPE.FLOAT, 'VEC3', vertices.length, 0, min, max),
        NORMAL: new Accessor(bufferView, COMPONENT.TYPE.FLOAT, 'VEC3', normals.length, vertices.length * 4),
        TEXCOORD_0: new Accessor(bufferView, COMPONENT.TYPE.FLOAT, 'VEC2', uvs.length, vertices.length * 4 + normals.length * 4)
    };

    // set the size of indices dynamically based on the total number of vertices.
    let componentType = null;
    let indexBuffer = null;

    if (vertices.count < Math.pow(2, 8)) {
        componentType = COMPONENT.TYPE.UNSIGNED_BYTE;
        indexBuffer = new Uint8Array(indices);
    } else if (vertices.count < Math.pow(2, 16)) {
        componentType = COMPONENT.TYPE.UNSIGNED_SHORT;
        indexBuffer = new Uint16Array(indices);
    } else {
        componentType = COMPONENT.TYPE.UNSIGNED_INT;
        indexBuffer = new Uint32Array(indices);
    }

    const indicesAccessor = new Accessor(new BufferView(indexBuffer.buffer), componentType, 'SCALAR', indices.length);

    const primitive = new Primitive(attributes, material, indicesAccessor, mode);

    return primitive;

};