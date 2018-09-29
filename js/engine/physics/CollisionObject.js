
export default class CollisionObject {

    constructor(mesh) {

        this.mesh = mesh;

        this._onIntersect = null;

    }

    setOnIntersectListener(listener) {
        this._onIntersect = listener;
    }
}