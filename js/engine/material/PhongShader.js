import Shader from './Shader.js';
import fetchShaderSource from '../lib/fetchShaderSource.js';

const vertexShaderSource = fetchShaderSource('shaders/phong-vertex-shader.glsl');
const fragmentShaderSource = fetchShaderSource('shaders/phong-fragment-shader.glsl');

export default class PhongShader extends Shader {
    constructor(gl, material) {
        super(gl, material, vertexShaderSource, fragmentShaderSource);

        // get uniform locations specific to this shader.
        this.uniformLocations.color = gl.getUniformLocation(this.program, 'materialColor');
        this.uniformLocations.ambient = gl.getUniformLocation(this.program, 'materialAmbient');
        this.uniformLocations.specular = gl.getUniformLocation(this.program, 'materialSpecular');
        this.uniformLocations.shininess = gl.getUniformLocation(this.program, 'shininess');

        this.uniformLocations.lightPosition = gl.getUniformLocation(this.program, "lightPosition");
        this.uniformLocations.lightDiffuse = gl.getUniformLocation(this.program, "lightDiffuse");
        this.uniformLocations.lightSpecular = gl.getUniformLocation(this.program, "lightSpecular");
        this.uniformLocations.lightAmbient = gl.getUniformLocation(this.program, "lightAmbient");
        this.uniformLocations.lightAttenuation = gl.getUniformLocation(this.program, "lightAttenuation");

        this.uniformLocations.map = gl.getUniformLocation(this.program, 'map');

        // activate the light uniform block.
        this.uniformBlocks.push('LIGHT');
    }
}