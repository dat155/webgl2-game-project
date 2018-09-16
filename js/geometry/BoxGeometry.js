class BoxGeometry {
    constructor({ flipNormals = false } = {}) {

        let indices = [];
        let vertices = [];
        let uvs = [];
        let normals = [];

        let baseVertices = [
            vec3.fromValues(-0.5, -0.5, 0.5),
            vec3.fromValues(-0.5, 0.5, 0.5),
            vec3.fromValues(0.5, 0.5, 0.5),
            vec3.fromValues(0.5, -0.5, 0.5),
            vec3.fromValues(-0.5, -0.5, -0.5),
            vec3.fromValues(-0.5, 0.5, -0.5),
            vec3.fromValues(0.5, 0.5, -0.5),
            vec3.fromValues(0.5, -0.5, -0.5)
        ];

        let faces = [
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

        this.attributeBuffer = new ArrayBuffer(vertices.length * 4 + normals.length * 4 + uvs.length * 4); // 4, as in 4 bytes per element.

        const dataView = new DataView(this.attributeBuffer);
        const isLittleEndian = new Uint8Array(new Uint32Array([0x12345678]).buffer)[0] === 0x78;

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

        this.attributes = {
            POSITION: {
                count: vertices.length,
                byteOffset: 0,
                componentType: Constants.COMPONENT.TYPE.FLOAT,
                type: 'VEC3'
            },
            NORMAL: {
                count: normals.length,
                byteOffset: vertices.length * 4,
                componentType: Constants.COMPONENT.TYPE.FLOAT,
                type: 'VEC3'
            },
            TEXCOORD: {
                count: uvs.length,
                byteOffset: vertices.length * 4 + normals.length * 4,
                componentType: Constants.COMPONENT.TYPE.FLOAT,
                type: 'VEC3'
            }
        };

        
        this.indices = {
            count: indices.length,
            byteOffset: 0,
            componentType: null,
            type: 'SCALAR'
        }

        this.indexBuffer = null;

        // set the size of indices dynamically based on the total number of vertices.
        if (vertices.count < Math.pow(2, 8)) {
            this.indices.componentType = Constants.COMPONENT.TYPE.UNSIGNED_BYTE;
            this.indexBuffer = new Uint8Array(indices);
        } else if (vertices.count < Math.pow(2, 16)) {
            this.indices.componentType = Constants.COMPONENT.TYPE.UNSIGNED_SHORT;
            this.indexBuffer = new Uint16Array(indices);
        } else {
            this.indices.componentType = Constants.COMPONENT.TYPE.UNSIGNED_INT;
            this.indexBuffer = new Uint32Array(indices);
        }

        // instantiate Vertex Array Object variable to null.
        this.vao = null;
    }
}