
import { vec3 } from './engine/lib/gl-matrix.js';
import { Renderer, Node, Mesh, BoxGeometry, BasicMaterial, CubeMapMaterial, PerspectiveCamera, MouseLookController } from './engine/index.js';


// create renderer and canvas element, append canvas to DOM.
let renderer = new Renderer(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let scene = new Node();

// add stuff to the scene:

let boxGeometry = new BoxGeometry();
let boxMaterial = new BasicMaterial({
    color: [1.0, 0.0, 1.0, 1.0]
});

let box = new Mesh(boxGeometry, boxMaterial);

scene.add(box);
box.applyTranslation(0, 0, -20);

/// CAMERA SETUP:
let moveNode = new Node();
scene.add(moveNode);

let camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 5000);
moveNode.add(camera);


// handle resizing of the viewport.
window.addEventListener('resize', () => {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}, false);

let mouseLookController = new MouseLookController(camera);

let canvas = renderer.domElement;

canvas.addEventListener('click', () => {
    canvas.requestPointerLock();
});

let yaw = 0;
let pitch = 0;

function updateCamRotation(event) {
    yaw += event.movementX * 0.001;
    pitch += event.movementY * 0.001;
}

document.addEventListener('pointerlockchange', () => {
    if (document.pointerLockElement === canvas) {
        canvas.addEventListener('mousemove', updateCamRotation, false);
    } else {
        canvas.removeEventListener('mousemove', updateCamRotation, false);
    }
});

let move = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    speed: 0.01
};

window.addEventListener('keydown', (e) => {
    e.preventDefault();
    if (e.code === 'KeyW') {
        move.forward = true;
    } else if (e.code === 'KeyS') {
        move.backward = true;
    } else if (e.code === 'KeyA') {
        move.left = true;
    } else if (e.code === 'KeyD') {
        move.right = true;
    }
});

window.addEventListener('keyup', (e) => {
    e.preventDefault();
    if (e.code === 'KeyW') {
        move.forward = false;
    } else if (e.code === 'KeyS') {
        move.backward = false;
    } else if (e.code === 'KeyA') {
        move.left = false;
    } else if (e.code === 'KeyD') {
        move.right = false;
    }
});


/// SKYBOX SETUP:
let skyBoxGeometry = new BoxGeometry({ flipNormals: true });
let skyBoxMaterial = new CubeMapMaterial({
    map: renderer.loadCubeMap([
        'resources/skybox/right.png',
        'resources/skybox/left.png',
        'resources/skybox/top.png',
        'resources/skybox/bottom.png',
        'resources/skybox/front.png',
        'resources/skybox/back.png'
    ])
});

let skyBox = new Mesh(skyBoxGeometry, skyBoxMaterial);
skyBox.setScale(1500, 1500, 1500);

moveNode.add(skyBox);

let velocity = vec3.fromValues(0.0, 0.0, 0.0);

let then = 0;
function loop(now) {

    let delta = now - then;
    then = now;

    mouseLookController.update(pitch, yaw);

    // reset mouse movement accumulator for each frame.
    yaw = 0;
    pitch = 0;

    const moveSpeed = move.speed * delta;

    vec3.set(velocity, 0.0, 0.0, 0.0);

    if (move.forward) {
        velocity[2] -= moveSpeed;
    }

    if (move.backward) {
        velocity[2] += moveSpeed;
    }

    if (move.left) {
        velocity[0] -= moveSpeed;
    }

    if (move.right) {
        velocity[0] += moveSpeed;
    }

    vec3.transformQuat(velocity, velocity, camera.rotation);
    moveNode.applyTranslation(...velocity);

    // update the world matrices of the entire scene graph (Since we are starting at the root node).
    scene.tick();
    renderer.render(scene, camera);

    // Ask the the browser to draw when it's convenient
    window.requestAnimationFrame(loop);
}
window.requestAnimationFrame(loop);
