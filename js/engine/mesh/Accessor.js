/**
 * Accessor
 * All large data for meshes is stored in buffers and retrieved via accessors.
 */

// constants:
// const componentType = {
//     BYTE: 5120,
//     UNSIGNED_BYTE: 5121,
//     SHORT: 5122,
//     UNSIGNED_SHORT: 5123,
//     UNSIGNED_INT: 5125,
//     FLOAT: 5126
// };

// const type = {
//     SCALAR: 1,
//     VEC2: 2,
//     VEC3: 3,
//     VEC4: 4,
//     MAT2: 4,
//     MAT3: 9,
//     MAT4: 16
// };

export default class Accessor {

    /**
     * Creates an instance of Accessor.
     * @param {BufferView} bufferView
     * @param {integer} componentType
     * @param {string} type
     * @param {integer} count
     * @param {number[]} min
     * @param {number[]} max
     * @param {number} [byteOffset=0]
     * @param {boolean} [normalized=false]
     * @memberof Accessor
     */
    constructor(bufferView, componentType, type, count, byteOffset = 0, min, max, normalized = false) {

        this.bufferView = bufferView;

        this.type = type;
        this.componentType = componentType;

        this.byteOffset = byteOffset;
        this.count = count;

        this.min = min;
        this.max = max;

        this.normalized = normalized;

    }
}