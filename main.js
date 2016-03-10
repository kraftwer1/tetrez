(function() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    var aspectRatio = width / height;
    var viewSize = 5;

    var camera = new THREE.OrthographicCamera(
        -(aspectRatio * viewSize / 2),
        (aspectRatio * viewSize / 2),
        (viewSize / 2),
        -(viewSize / 2)
    );

    camera.position.z = viewSize;

    var renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(width, height);

    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({ color: 0x000000 });
    var cube = new THREE.Mesh(geometry, material);

    var scene = new THREE.Scene();
    scene.add(cube);

    var render = function() {
        requestAnimationFrame(render);

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        renderer.render(scene, camera);
    };

    render();

    document.body.appendChild(renderer.domElement);
}());