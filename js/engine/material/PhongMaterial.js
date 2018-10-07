
import { vec4 } from '../lib/gl-matrix.js';

import Material from './Material.js';
import PhongShader from './PhongShader.js';


export default class PhongMaterial extends Material {
    constructor({
        color = vec4.fromValues(1.0, 1.0, 1.0, 1.0),
        specular = vec4.fromValues(1.0, 1.0, 1.0, 1.0),
        ambient = vec4.fromValues(0.2, 0.2, 0.2, 1.0),
        shininess = 30.0,
        map = null
    } = {}) {
        super(PhongShader);

        this.uniforms.color = color;
        this.uniforms.specular = specular;
        this.uniforms.ambient = ambient;
        this.uniforms.shininess = shininess;

        this.uniforms.map = map;

        if (map !== null) {
            this.defines.HAS_MAP = true;
        }

    }

    uploadUniforms(gl) {

        if (this.shader) {

            gl.uniform4fv(this.shader.uniformLocations.color, this.uniforms.color);
            gl.uniform4fv(this.shader.uniformLocations.specular, this.uniforms.specular);
            gl.uniform4fv(this.shader.uniformLocations.ambient, this.uniforms.ambient);

            gl.uniform1f(this.shader.uniformLocations.shininess, this.uniforms.shininess);

            if (this.uniforms.map) {
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, this.uniforms.map);
                gl.uniform1i(this.shader.uniformLocations.map, 0);
            }

        } else {
            throw Error('The shader has not been initialized.');
        }

    }

}