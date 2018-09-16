
class Material {
    constructor(Shader) {
        if (Shader === undefined) {
            throw Error('WarpGL: You must provide a Shader-class when extending Material.');
        }
        this.Shader = Shader;
        this.uniforms = {};
    }
}