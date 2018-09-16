"use strict";

window.addEventListener('load', () => {

    // create renderer and canvas element, append canvas to DOM.
	let renderer = new Renderer(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    let scene = new Node();

    let boxGeometry = new BoxGeometry();
    let boxMaterial = new BasicMaterial({
        color: vec4.fromValues(1.0, 0.0, 0.0, 1.0)
    });

    let box = new Mesh(boxGeometry, boxMaterial);

    scene.add(box);
    box.applyTranslation(0, 0, -20);

    let camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 5000);
    scene.add(camera);

    // handle resizing of the viewport.
    window.addEventListener('resize', () => {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);

    }, false);

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

    // CAMERA SETUP END ----------
    let then = 0;
    function loop(now) {

        let delta = now - then;
        then = now;

        let velocity = vec3.fromValues(0.0, 0.0, 0.0);

        if (move.forward) {
            velocity[2] = -move.speed * delta;
        }
        if (move.backward) {
            velocity[2] = move.speed * delta;
        }
        if (move.left) {
            velocity[0] = -move.speed * delta;
        }
        if (move.right) {
            velocity[0] = move.speed * delta;
        }

        camera.applyTranslation(...velocity);
		
        // update the world matrices of the entire scene graph (Since we are starting at the root node).
        scene.tick();
        renderer.render(scene, camera);

        // Ask the the browser to draw when it's convenient
        window.requestAnimationFrame(loop);
    }
    window.requestAnimationFrame(loop);
});