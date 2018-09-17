
import { Renderer, Node, Mesh, BoxGeometry, BasicMaterial, CubeMapMaterial, PerspectiveCamera, FPSController } from './engine/index.js';


// create renderer and canvas element, append canvas to DOM.
let renderer = new Renderer(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let scene = new Node();


let boxGeometry = new BoxGeometry();
let boxMaterial = new BasicMaterial({
    color: [1.0, 0.0, 1.0, 1.0]
});

let box = new Mesh(boxGeometry, boxMaterial);

scene.add(box);
box.applyTranslation(0, 0, -20);

let camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 5000);
scene.add(camera);


/// Skybox:
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

scene.add(skyBox);


// handle resizing of the viewport.
window.addEventListener('resize', () => {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}, false);


let cameraController = new FPSController(camera);

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

let then = 0;
function loop(now) {

    let delta = now - then;
    then = now;

    const moveSpeed = move.speed * delta;

    let longitudinal = 0;
    let lateral = 0;

    if (move.forward) {
        longitudinal += moveSpeed;
    }

    if (move.backward) {
        longitudinal -= moveSpeed;
    }

    if (move.left) {
        lateral += moveSpeed;
    }

    if (move.right) {
        lateral -= moveSpeed;
    }

    cameraController.update(pitch, yaw, longitudinal, lateral);

    // reset movement buffers.
    yaw = 0;
    pitch = 0;

    // update the world matrices of the entire scene graph (Since we are starting at the root node).
    scene.tick();
    renderer.render(scene, camera);

    // Ask the the browser to draw when it's convenient
    window.requestAnimationFrame(loop);
}
window.requestAnimationFrame(loop);
