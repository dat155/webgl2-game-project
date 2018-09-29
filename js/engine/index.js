
/**
 * A simple WebGL2 graphics engine.
 */

export { default as Renderer } from './Renderer.js';
export { default as Node } from './Node.js';
export { default as Scene } from './Scene.js';
export { default as Mesh } from './mesh/Mesh.js';
export { default as BasicMaterial } from './material/BasicMaterial.js';
export { default as CubeMapMaterial } from './material/CubeMapMaterial.js';

export { default as PerspectiveCamera } from './camera/PerspectiveCamera.js';

export { default as MouseLookController } from './controls/MouseLookController.js';

export { default as CollisionObject } from './physics/CollisionObject.js';
export { default as PhysicsManager } from './physics/PhysicsManager.js';

import { default as createPlane } from './primitives/createPlane.js';
import { default as createBox } from './primitives/createBox.js';

export const Primitives = { createPlane, createBox };