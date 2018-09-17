
/**
 * A WebGL2 renderer.
 *
 * @class Renderer
 */
class Renderer {
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

    load(mesh) {

        /// load geometry:

        let geometry = mesh.geometry;

        let vao = this.gl.createVertexArray();
        this.gl.bindVertexArray(vao);

        if (geometry.indices) {

            // create buffer (allocates a buffer on the GPU and gives us a reference)
            let buffer = this.gl.createBuffer();

            // bind buffer to the ELEMENT_ARRAY_BUFFER target.
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, buffer);

            // upload the data.
            this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, geometry.indexBuffer, this.gl.STATIC_DRAW);

        }

        // create buffer
        let buffer = this.gl.createBuffer()

        // bind buffer to the ARRAY_BUFFER target.
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);

        // upload the positions, normals, uvs, etc...
        this.gl.bufferData(this.gl.ARRAY_BUFFER, geometry.attributeBuffer, this.gl.STATIC_DRAW);

        for (let name in geometry.attributes) {

            let attribute = geometry.attributes[name];

            // setup and enable vertex attributes (Using the predefined and constant locations.)
            this.gl.vertexAttribPointer(Constants.ATTRIBUTE_LOCATION[name], Constants.TYPE[attribute.type], attribute.componentType, false, 0, attribute.byteOffset);
            this.gl.enableVertexAttribArray(Constants.ATTRIBUTE_LOCATION[name]);

        }

        geometry.vao = vao;

        /// initiate shaderprogram
        let material = mesh.material;
        material.shader = new material.Shader(this.gl, material);

    }

    draw(mesh, camera) {

        let shader = mesh.material.shader;

        this.gl.useProgram(shader.program);

        let modelViewMatrix = mat4.multiply(mat4.create(), camera.viewMatrix, mesh.worldMatrix);

        // upload the projection matrix, and the model view matrix:
        this.gl.uniformMatrix4fv(shader.uniformLocations.projectionMatrix, false, camera.projectionMatrix);
        this.gl.uniformMatrix4fv(shader.uniformLocations.modelViewMatrix, false, modelViewMatrix);

        // upload shader specific uniforms:
        mesh.material.uploadUniforms(this.gl);

        // bind the geometry:
        this.gl.bindVertexArray(mesh.geometry.vao);

        if (mesh.geometry.indices) {
            const indices = mesh.geometry.indices;
            const offset = indices.byteOffset / Constants.COMPONENT.SIZE[indices.componentType];

            this.gl.drawElements(this.gl.TRIANGLES, indices.count, indices.componentType, offset);

        } else {
            this.gl.drawArrays(this.gl.TRIANGLES, 0, mesh.geometry.attributes.POSITION.count / 3);
        }

    }

    render(scene, camera) {

        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        const meshes = this.getMeshNodes(scene);

        for (let mesh of meshes) {

            if (mesh.geometry.vao === null) {
                this.load(mesh);
            }

            this.draw(mesh, camera);

        }

    }

    loadTexture(url) {
        let image = new Image();

        image.src = url;

        let texture = this.gl.createTexture();

        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        //this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);

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
                    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
                    var targets = [
                        this.gl.TEXTURE_CUBE_MAP_POSITIVE_X, this.gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
                        this.gl.TEXTURE_CUBE_MAP_POSITIVE_Y, this.gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
                        this.gl.TEXTURE_CUBE_MAP_POSITIVE_Z, this.gl.TEXTURE_CUBE_MAP_NEGATIVE_Z
                    ];
                    for (let j = 0; j < 6; j++) {
                        this.gl.texImage2D(targets[j], 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image[j]);
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