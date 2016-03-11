(function() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    var aspectRatio = width / height;
    var viewSize = 10;

    var camera = new THREE.OrthographicCamera(
        -(aspectRatio * viewSize / 2),
        (aspectRatio * viewSize / 2),
        (viewSize / 2),
        -(viewSize / 2)
    );

    camera.position.z = viewSize;

    var blocks = {
        t: (function() {
            var shape = new THREE.Shape();
            shape.moveTo(0, 0);
            shape.lineTo(0, 1);
            shape.lineTo(1, 1);
            shape.lineTo(1, 2);
            shape.lineTo(2, 2);
            shape.lineTo(2, 1);
            shape.lineTo(3, 1);
            shape.lineTo(3, 0);

            var geometry = new THREE.ExtrudeGeometry(shape, {
                amount: 1,
                bevelSize: 0,
                bevelSegments: 0
            });

            // Adjust center point
            geometry.translate(-1.5, -.5, -.5);

            return geometry;
        }())
    };

    var renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0xffdfba);

    var material = new THREE.MeshBasicMaterial({
        color: 0xffb3ba
    });

    var cube = new THREE.Mesh(blocks.t, material);

    var scene = new THREE.Scene();
    scene.add(cube);

    renderer.render(scene, camera);

    document.body.appendChild(renderer.domElement);
}());