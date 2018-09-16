class Camera extends Node {

    constructor() {
        super();

        this.viewMatrix = mat4.create();
    }

    tick() {
        super.tick();
        
        // view matrix is the inverse of the world matrix.
        mat4.invert(this.viewMatrix, this.worldMatrix);
    }

}