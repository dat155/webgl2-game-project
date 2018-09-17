
import { vec3, quat } from '../lib/gl-matrix.js';

export default class MouseLookController {

    constructor(camera) {
        this.camera = camera;

        this.FD = vec3.fromValues(0, 0, 1);
        this.UD = vec3.fromValues(0, 1, 0);
        this.LD = vec3.fromValues(1, 0, 0);

        this.pitchQuat = quat.create();
        this.yawQuat = quat.create();
    }

    update(pitch, yaw) {
        
        quat.setAxisAngle(this.pitchQuat, this.LD, -pitch);
        quat.setAxisAngle(this.yawQuat, this.UD, -yaw);

        quat.multiply(this.camera.rotation, this.yawQuat, quat.multiply(this.camera.rotation, this.camera.rotation, this.pitchQuat));

    }
    
}