import { Mesh, Primitives, BasicMaterial } from '../engine/index.js';
import { CollisionObject } from '../physics/index.js';

export default class ObstacleManager {
    constructor(scene, physicsManager, floorTexture, blockTexture) {

        this.scene = scene;
        this.physicsManager = physicsManager;

        const boxMaterial = new BasicMaterial({
            color: [1.0, 1.0, 1.0, 1.0],
            map: blockTexture
        });

        this.boxPrimitive = Primitives.createBox(boxMaterial);


        const floorMaterial = new BasicMaterial({
            map: floorTexture
        });

        this.planePrimitive = Primitives.createPlane(floorMaterial);

        this.sizeX = 8;
        this.sizeY = 8 * 2;
        this.density = 0.10;

        this.nextChunk = null;
        this.currentChunk = null;
        this.previousChunk = null;

        this.initialize();
    }

    generateChunk(offset) {

        const sizeX = this.sizeX;
        const sizeY = this.sizeY;
        const density = this.density;

        // create the floor:
        const floor = new Mesh([this.planePrimitive]);
        floor.applyScale(sizeX, 1, sizeY);
        floor.applyTranslation(0, -0.5, offset - (sizeY / 2));
        this.scene.add(floor);

        // generate blocks:
        const numberOfBlocks = Math.floor((sizeX * sizeY) * density);

        const blocks = [];
        const populated = new Map();

        for (let i = 0; i < numberOfBlocks; i++) {

            let x = Math.floor(Math.random() * sizeX);
            let y = Math.floor(Math.random() * sizeY);

            while (true) {

                if (populated.has((y * sizeX) + x)) {

                    x = Math.floor(Math.random() * sizeX);
                    y = Math.floor(Math.random() * sizeY);

                } else {
                    break;
                }

            }

            let block = new Mesh([this.boxPrimitive]);
            block.setTranslation(x - (sizeX / 2) + 0.5, 0, (y - (sizeY - 0.5)) + offset);
            this.scene.add(block);

            // add collision object.
            const blockCollisionObject = new CollisionObject(block);
            this.physicsManager.add(blockCollisionObject);

            blocks.push(blockCollisionObject);

        }

        return { floor, blocks, offset };

    }

    destroyChunk(chunk) {

        if (chunk !== null) {
            this.scene.remove(chunk.floor);

            for (let block of chunk.blocks) {

                this.scene.remove(block.mesh);
                this.physicsManager.remove(block);

            }
        }

    }

    update(positionZ) {

        const offset = Math.floor(positionZ); // position[2] is the z-component of the position vector.

        if (offset % this.sizeY === 0) {

            if (offset < this.currentChunk.offset) {
                // the player just entered the next chunk.

                // destroy the previous chunk.
                this.destroyChunk(this.previousChunk);
                this.previousChunk = this.currentChunk;

                // set next chunk as current chunk.
                this.currentChunk = this.nextChunk;

                // create a new next chunk.
                this.nextChunk = this.generateChunk(offset - this.sizeY);

            }

        }

    }

    initialize() {

        this.nextChunk = this.generateChunk(-this.sizeY);
        this.currentChunk = this.generateChunk(0);

    }
}