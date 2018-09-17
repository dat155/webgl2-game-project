
const basicVertexShaderSource = fetchShaderSource('shaders/basic-vertex-shader.glsl');
const basicFragmentShaderSource = fetchShaderSource('shaders/basic-fragment-shader.glsl');

class BasicShader extends Shader {
    constructor(gl, material) {
        super(gl, material, basicVertexShaderSource, basicFragmentShaderSource);

        // get specific uniform locations.
        this.uniformLocations.color = gl.getUniformLocation(this.program, 'color');
        this.uniformLocations.map = gl.getUniformLocation(this.program, 'map');

    }
}