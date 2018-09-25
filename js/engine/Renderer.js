
import { ATTRIBUTE_LOCATION, COMPONENT, TYPE } from './lib/constants.js';
import { mat4 } from './lib/gl-matrix.js';
import Mesh from './mesh/Mesh.js';

/**
 * A WebGL2 renderer.
 *
 * @class Renderer
 */
export default class Renderer {
    constructor(width, height) {
        this.domElement = document.createElement('canvas');
        this.domElement.width = width;
        this.domElement.height = height;

        this.gl = this.domElement.getContext('webgl2');

        if (!this.gl) {
            alert('WebGL 2.0 isn\'t available');
        }

        this.gl.viewport(0, 0, this.domElement.width, this.domElement.height);
        this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);

    }

    setSize(width, height) {
        this.domElement.width = width;
        this.domElement.height = height;
        this.gl.viewport(0, 0, this.domElement.width, this.domElement.height);
        this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
    }

    getMeshNodes(node) {

        if (node instanceof Mesh) {
            return [node].concat(...node.children.map(this.getMeshNodes.bind(this)));
        } else {
            return [].concat(...node.children.map(this.getMeshNodes.bind(this)));
        }

    }

    load(primitive) {

        if (primitive.vao === null) {

            let vao = this.gl.createVertexArray();
            this.gl.bindVertexArray(vao);

            if (primitive.indices !== null) {

                let accessor = primitive.indices;
                let bufferView = accessor.bufferView;

                if (bufferView.glBuffer) {

                    // a buffer already exists on the GPU.
                    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, bufferView.glBuffer);

                } else {

                    // create buffer (allocates a buffer on the GPU and gives us a reference)
                    let buffer = this.gl.createBuffer();

                    // bind buffer to the ELEMENT_ARRAY_BUFFER target.
                    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, buffer);

                    let dataView = new DataView(bufferView.buffer, bufferView.byteOffset, bufferView.byteLength);

                    // upload the data.
                    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, dataView, this.gl.STATIC_DRAW);

                    bufferView.glBuffer = buffer;

                }

            }

            // create and link attribute accessors, and possibly upload bufferView to GPU.
            for (let name in primitive.attributes) {

                let accessor = primitive.attributes[name];
                let bufferView = accessor.bufferView;

                if (bufferView.glBuffer) {

                    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, bufferView.glBuffer);

                } else {

                    // create buffer and upload data.

                    let buffer = this.gl.createBuffer();
                    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);

                    let dataView = new DataView(bufferView.buffer, bufferView.byteOffset, bufferView.byteLength);

                    this.gl.bufferData(this.gl.ARRAY_BUFFER, dataView, this.gl.STATIC_DRAW);

                    // setup and enable vertex attributes (Using the predefined and constant locations.)
                    this.gl.vertexAttribPointer(ATTRIBUTE_LOCATION[name], TYPE[accessor.type], accessor.componentType, accessor.normalized, bufferView.byteStride, accessor.byteOffset);
                    this.gl.enableVertexAttribArray(ATTRIBUTE_LOCATION[name]);

                    bufferView.glBuffer = buffer;

                }
            }

            primitive.vao = vao;

        }

        if (primitive.material.shader === null) {

            /// initiate shaderprogram
            let material = primitive.material;
            material.shader = new material.Shader(this.gl, material);

        }

    }

    draw(mesh, camera) {

        let modelViewMatrix = mat4.multiply(mat4.create(), camera.viewMatrix, mesh.worldMatrix);

        for (let primitive of mesh.primitives) {

            if (primitive.vao === null || primitive.material.shader === null) {
                this.load(primitive);
            }

            let shader = primitive.material.shader;
            this.gl.useProgram(shader.program);

            // upload the projection matrix, and the model view matrix:
            this.gl.uniformMatrix4fv(shader.uniformLocations.projectionMatrix, false, camera.projectionMatrix);
            this.gl.uniformMatrix4fv(shader.uniformLocations.modelViewMatrix, false, modelViewMatrix);

            // upload shader specific uniforms:
            primitive.material.uploadUniforms(this.gl);

            // bind the geometry:
            this.gl.bindVertexArray(primitive.vao);

            if (primitive.indices) {

                const indices = primitive.indices;
                const offset = indices.byteOffset / COMPONENT.SIZE[indices.componentType];

                this.gl.drawElements(this.gl.TRIANGLES, indices.count, indices.componentType, offset);

            } else {

                this.gl.drawArrays(this.gl.TRIANGLES, 0, primitive.attributes.POSITION.count / 3);
                
            }

        }

    }

    render(scene, camera) {

        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        const meshes = this.getMeshNodes(scene);

        for (let mesh of meshes) {

            this.draw(mesh, camera);

        }

    }

    loadTexture(url) {
        let image = new Image();

        image.src = url;

        let texture = this.gl.createTexture();

        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);

        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));

        image.addEventListener('load', () => {
            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);

            this.gl.generateMipmap(this.gl.TEXTURE_2D);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST_MIPMAP_LINEAR);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        });

        return texture;
    }

    loadCubeMap(urls) {
        let ct = 0;
        let image = new Array(6);

        let cubeMap = this.gl.createTexture();

        for (let i = 0; i < 6; i++) {
            image[i] = new Image();
            image[i].addEventListener('load', () => {
                ct++;
                if (ct == 6) {

                    this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, cubeMap);

                    for (let j = 0; j < 6; j++) {

                        let target = this.gl.TEXTURE_CUBE_MAP_POSITIVE_X + j;

                        this.gl.texImage2D(target, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image[j]);
                        this.gl.texParameteri(this.gl.TEXTURE_CUBE_MAP, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
                        this.gl.texParameteri(this.gl.TEXTURE_CUBE_MAP, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
                        this.gl.texParameterf(this.gl.TEXTURE_CUBE_MAP, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
                        this.gl.texParameteri(this.gl.TEXTURE_CUBE_MAP, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_NEAREST);
                    }

                    this.gl.generateMipmap(this.gl.TEXTURE_CUBE_MAP);
                }
            });
            image[i].src = urls[i];
        }

        return cubeMap;
    }
}