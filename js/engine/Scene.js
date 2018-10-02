import Node from './Node.js';

export default class Scene extends Node {
    constructor() {
        super();
    }

    /**
     * Update world matrices in the scene.
    */
    update() {
        this.tick();
    }
}