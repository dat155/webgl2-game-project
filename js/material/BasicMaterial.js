
class BasicMaterial extends Material {
    constructor({
        color = vec4.fromValues(1.0, 1.0, 1.0, 1.0),
        map = null
    } = {}) {
        
        super(BasicShader);

        this.uniforms.color = color;
        this.uniforms.map = map;
        this.uniforms.hasMap = map ? true : false;

    }

    uploadUniforms(gl) {

        if (this.shader) {

            gl.uniform4fv(this.shader.uniformLocations.color, this.uniforms.color);

            gl.uniform1i(this.shader.uniformLocations.hasMap, this.uniforms.hasMap);

            if (this.uniforms.hasMap) {
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, this.uniforms.map);
                gl.uniform1i(this.shader.uniformLocations.map, 0);
            }

        } else {
            throw Error('The shader has not been initialized.');
        }

    }
}