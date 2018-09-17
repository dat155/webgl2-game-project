
import Shader from './Shader.js';
import fetchShaderSource from '../lib/fetchShaderSource.js';

let vertexShaderSource = fetchShaderSource('shaders/cubemap-vertex-shader.glsl');
let fragmentShaderSource = fetchShaderSource('shaders/cubemap-fragment-shader.glsl');

export default class CubeMapShader extends Shader {
    constructor(gl, material) {
        super(gl, material, vertexShaderSource, fragmentShaderSource);

        // get specific uniform locations.
        this.uniformLocations.map = gl.getUniformLocation(this.program, "map");
    }
}
