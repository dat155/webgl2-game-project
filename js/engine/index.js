
/**
 * A simple WebGL2 graphics engine.
 */

export { default as Renderer } from './Renderer.js';
export { default as Node } from './Node.js';
export { default as Scene } from './Scene.js';
export { default as Mesh } from './mesh/Mesh.js';
export { default as Light } from './light/Light.js';

export { default as BasicMaterial } from './material/BasicMaterial.js';
export { default as PhongMaterial } from './material/PhongMaterial.js';
export { default as CubeMapMaterial } from './material/CubeMapMaterial.js';

export { default as PerspectiveCamera } from './camera/PerspectiveCamera.js';

export { default as MouseLookController } from './controls/MouseLookController.js';

import { default as createPlane } from './primitives/createPlane.js';
import { default as createBox } from './primitives/createBox.js';

export const Primitives = { createPlane, createBox };