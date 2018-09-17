
import { mat4, vec3, quat } from './lib/gl-matrix.js';

/**
 * A scenegraph node.
 *
 * @class Node
 */
export default class Node {

    constructor(parent = null) {

        this.localMatrix = mat4.create();
        this.worldMatrix = mat4.create();

        this.translation = vec3.fromValues(0, 0, 0);
        this.scale = vec3.fromValues(1, 1, 1);
        this.rotation = quat.create(); // quaternion

        if (parent) {
            parent.add(this);
        }

        this.children = [];
    }

    add(child) {
        if (child && this.children.indexOf(child) === -1) {
            this.children.push(child);
        }
    }

    remove(child) {
        if (child) {
            let index = this.children.indexOf(child);

            if (index !== -1) {
                this.children.splice(index, 1);
            }
        }
    }

    tick(parentWorldMatrix = null) {
        this.updateLocalMatrix(); // Recalculate this node's localMatrix.

        // Do this if the node has a parent
        if (parentWorldMatrix !== null) {

            // Multiply the localMatrix of this node with the worldMatrix of its parent.
            mat4.multiply(this.worldMatrix, parentWorldMatrix, this.localMatrix);

        } else {

            //Just set the localMatrix as the worldMatrix since this node does not have a parent
            mat4.copy(this.worldMatrix, this.localMatrix);

        }

        // Propagate the update downwards in the scenegraph 
        // (the children will use this node's worldMatrix in the tick)
        for (let i = 0; i < this.children.length; i++) {
            this.children[i].tick(this.worldMatrix);
        }
        
    }

    updateLocalMatrix() {
        mat4.fromRotationTranslationScale(this.localMatrix, this.rotation, this.translation, this.scale);
    }

    setScale(x, y, z) {
        this.scale[0] = x;
        this.scale[1] = y;
        this.scale[2] = z;
    }

    applyScale(x, y, z) {
        this.scale[0] *= x;
        this.scale[1] *= y;
        this.scale[2] *= z;
    }

    setTranslation(x, y, z) {
        this.translation[0] = x;
        this.translation[1] = y;
        this.translation[2] = z;
    }

    applyTranslation(x, y, z) {
        this.translation[0] += x;
        this.translation[1] += y;
        this.translation[2] += z;
    }

    setRotationFromEuler(x, y, z) {
        quat.fromEuler(this.rotation, x, y, z);
    }

    rotateX(rad) {
        quat.rotateX(this.rotation, this.rotation, rad);
    }

    rotateY(rad) {
        quat.rotateY(this.rotation, this.rotation, rad);
    }

    rotateZ(rad) {
        quat.rotateZ(this.rotation, this.rotation, rad);
    }
}