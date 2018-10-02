
import Shader from './Shader.js';
import fetchShaderSource from '../lib/fetchShaderSource.js';

let vertexShaderSource = fetchShaderSource('shaders/basic-vertex-shader.glsl');
let fragmentShaderSource = fetchShaderSource('shaders/basic-fragment-shader.glsl');

export default class BasicShader extends Shader {
    constructor(gl, material) {
        super(gl, material, vertexShaderSource, fragmentShaderSource);

        // get uniform locations specific to this shader.
        this.uniformLocations.color = gl.getUniformLocation(this.program, 'color');
        this.uniformLocations.map = gl.getUniformLocation(this.program, 'map');

    }
}