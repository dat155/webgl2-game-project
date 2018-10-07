
export default class Shader {
    constructor(gl, material, vertexShaderSource, fragmentShaderSource) {

        const { defines } = material;

        let definesString = "";

        for (let define in defines) {

            const value = defines[define];

            if (value !== null) {
                definesString += `#define ${define} ${value}\n`;
            } else {
                definesString += `#define ${define}\n`;
            }
            
        }

        const program = this.constructor.build(gl, vertexShaderSource.replace('__DEFINES__', definesString), fragmentShaderSource.replace('__DEFINES__', definesString));
        gl.useProgram(program);

        // Get standard uniform locations.
        this.uniformLocations = {
            modelViewMatrix: gl.getUniformLocation(program, 'modelViewMatrix'),
            modelViewProjectionMatrix: gl.getUniformLocation(program, 'modelViewProjectionMatrix'),
            normalMatrix: gl.getUniformLocation(program, 'normalMatrix')
        };

        this.uniformBlocks = [];

        this.program = program;
    }

    static compile(gl, source, type) {
        let shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw Error(gl.getShaderInfoLog(shader));
        }

        return shader;
    }

    static build(gl, vertexShaderSource, fragmentShaderSource) {
        let vertexShader = this.compile(gl, vertexShaderSource, gl.VERTEX_SHADER);
        let fragmentShader = this.compile(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);

        let program = gl.createProgram();

        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            throw Error('Could not build shaders.');
        }

        // detach shaders allowing webgl to clean up.
        //gl.detachShader(program, vertexShader);
        //gl.detachShader(program, fragmentShader);

        return program;
    }

    destroy() {
        gl.deleteProgram(this.program);
    }
}