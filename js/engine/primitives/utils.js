import { vec3 } from '../lib/gl-matrix.js';

export const getMinMax = (vertices) => {

    let min = vec3.fromValues(+Infinity, +Infinity, +Infinity);
    let max = vec3.fromValues(-Infinity, -Infinity, -Infinity);

    for (let i = 0; i < vertices.length; i += 3) {
        
        min[0] = Math.min(min[0], vertices[i + 0]);
        min[1] = Math.min(min[1], vertices[i + 1]);
        min[2] = Math.min(min[2], vertices[i + 2]);

        max[0] = Math.max(max[0], vertices[i + 0]);
        max[1] = Math.max(max[1], vertices[i + 1]);
        max[2] = Math.max(max[2], vertices[i + 2]);

    }

    return { min, max };

};