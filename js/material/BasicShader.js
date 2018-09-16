
const basicVertexShaderSource = fetchShaderSource('shaders/basic-vertex-shader.glsl');
const basicFragmentShaderSource = fetchShaderSource('shaders/basic-fragment-shader.glsl');

class BasicShader extends Shader {
    constructor(gl) {
        super(gl, basicVertexShaderSource, basicFragmentShaderSource);

        // get specific uniform locations.
        this.uniformLocations.color = gl.getUniformLocation(this.program, 'color');
        this.uniformLocations.map = gl.getUniformLocation(this.program, 'map');
        this.uniformLocations.hasMap = gl.getUniformLocation(this.program, 'hasMap');

    }
}