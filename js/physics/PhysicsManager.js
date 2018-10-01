
import { vec3 } from '../engine/lib/gl-matrix.js';

export default class PhysicsManager {

    static intersectAABB(a, b) {
        return (a.min[0] <= b.max[0] && a.max[0] >= b.min[0])
            && (a.min[1] <= b.max[1] && a.max[1] >= b.min[1])
            && (a.min[2] <= b.max[2] && a.max[2] >= b.min[2]);
    }

    constructor() {
        this.entities = [];
    }

    add(entity) {
        if (entity && this.entities.indexOf(entity) === -1) {
            this.entities.push(entity);
        }
    }

    remove(entity) {
        if (entity) {
            let index = this.entities.indexOf(entity);

            if (index !== -1) {
                this.entities.splice(index, 1);
            }
        }
    }

    update(delta) {

        // Currently we assume that the meshes have axis-aligned bounding boxes,
        // but if a rotation is introduced to the worldMatrix we will have a problem.
        // We can implement some way to calculate a bounding box after having rotated the mesh,
        // i.e. transform the original bounding box and take the min-max (inaccurate but fast),
        // or transform every vertex of the model and take the min-max (precise but slow).
        
        // Alternatively use the separating axis theorem (SAT).

        for (let i = 0; i < this.entities.length; i += 1) {

            const entity = this.entities[i];

            for (let j = 0; j < this.entities.length; j += 1) {

                if (i === j) {
                    continue;
                }

                const entity2 = this.entities[j];

                // assume axis-aligned bounding box.
                if (PhysicsManager.intersectAABB(entity.mesh.boundingBox, entity2.mesh.boundingBox)) {

                    if (entity._onIntersect !== null) {
                        entity._onIntersect(delta, entity2);
                    }

                    if (entity2._onIntersect !== null) {
                        entity2._onIntersect(delta, entity);
                    }
                    
                }

            }
        }

    }
}