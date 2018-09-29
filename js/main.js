
import { vec3 } from './engine/lib/gl-matrix.js';
import { Renderer, Scene, Node, Mesh, Primitives, BasicMaterial, CubeMapMaterial, PerspectiveCamera, MouseLookController } from './engine/index.js';
import { CollisionObject, PhysicsManager } from './engine/index.js';


// create renderer and canvas element, append canvas to DOM.
let renderer = new Renderer(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new Scene();

const physicsManager = new PhysicsManager();

// playground setup.
const boxMaterial = new BasicMaterial({
    color: [1.0, 1.0, 1.0, 1.0],
    map: renderer.loadTexture('resources/dev_grid.png')
});
const boxPrimitive = Primitives.createBox(boxMaterial);

const player = new Mesh([boxPrimitive]);
scene.add(player);

const playerCollisionObject = new CollisionObject(player);

playerCollisionObject.setOnIntersectListener((delta, entity) => {
    scene.remove(entity.mesh);
    physicsManager.remove(entity);
});

physicsManager.add(playerCollisionObject);

// add stuff to the scene:
const floorMaterial = new BasicMaterial({
    map: renderer.loadTexture('resources/dev_dfloor.png')
});
const planePrimitive = Primitives.createPlane(floorMaterial);

const floor = new Mesh([planePrimitive]);
floor.applyScale(8, 1, 8);
floor.applyTranslation(0, -0.5, 0);
scene.add(floor);

// add some randomly positioned boxes.
for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 8; y++) {

        //if (Math.random() < 0.15) {
            let box = new Mesh([boxPrimitive]);
            box.setTranslation(x - (8 / 2) + 0.5, 0, y - (8 / 2) + 0.5);

            scene.add(box);

            // add collision object.
            const boxCollisionObject = new CollisionObject(box);
            physicsManager.add(boxCollisionObject);
        //}

    }
}



// CAMERA SETUP:
let camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 5000);

// handle resizing of the viewport.
window.addEventListener('resize', () => {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}, false);


// MOUSE LOOK CONTROLLER SETUP.

let mouseLookController = new MouseLookController(camera);

let moveNode = new Node();
moveNode.add(camera);

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

// MOVEMENT CONTROLLER SETUP:

let move = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    speed: 0.01,
    mode: 0
};

window.addEventListener('keydown', (e) => {
    e.preventDefault();

    if (e.code === 'KeyF') {
        if (move.mode === 0) {
            move.mode = 1;

            player.remove(moveNode);
            scene.add(moveNode);

            moveNode.setTranslation(player.translation[0], player.translation[1] + 4, player.translation[2] + 8);

        } else {
            move.mode = 0;

            // reset moveNode translation and camera rotation.
            moveNode.setTranslation(0.0, 0.0, 0.0);
            camera.setRotationFromEuler(0.0, 0.0, 0.0);

            // place camera according to player
            scene.remove(moveNode);
            player.add(moveNode);
            moveNode.setTranslation(0, 4, 8);

            camera.setRotationFromEuler(-25.0, 0.0, 0.0);

        }
    }
});

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

// place camera according to player
scene.remove(moveNode);
player.add(moveNode);
moveNode.setTranslation(0, 4, 8);

camera.setRotationFromEuler(-25.0, 0.0, 0.0);

/// SKYBOX SETUP:
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

let skyBoxPrimitive = Primitives.createBox(skyBoxMaterial, true);


let skyBox = new Mesh([skyBoxPrimitive]);
skyBox.setScale(1500, 1500, 1500);

moveNode.add(skyBox);


const velocity = vec3.fromValues(0.0, 0.0, 0.0);

// this tick is very important, to make sure nodes are positioned correctly before the first physics update.
scene.tick();

let then = 0;
function loop(now) {

    let delta = now - then;
    then = now;

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

    if (move.mode === 0) {

        player.applyTranslation(...velocity);

    } else if (move.mode === 1) {

        // free flight.
        mouseLookController.update(pitch, yaw);

        // apply rotation to velocity vector, and translate moveNode with it.
        vec3.transformQuat(velocity, velocity, camera.rotation);
        moveNode.applyTranslation(...velocity);

    }

    // reset mouse movement accumulator every frame.
    yaw = 0;
    pitch = 0;

    // physics updates here.
    physicsManager.update(delta);

    // update the world matrices of the entire scene graph (Since we are starting at the root node).
    scene.tick();
    renderer.render(scene, camera);

    // Ask the the browser to draw when it's convenient
    window.requestAnimationFrame(loop);
}
window.requestAnimationFrame(loop);
