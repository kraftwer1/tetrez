(function() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    var aspectRatio = width / height;
    var viewSize = Tetrez.config.dimension.y;
    var nextRotationStopX = 0;
    var nextRotationStopY = 0;
    var rotationStep = Math.PI * 2 / 2500;

    var scene = new THREE.Scene();

    var camera = new THREE.OrthographicCamera(
        -(aspectRatio * viewSize / 2),
        (aspectRatio * viewSize / 2),
        (viewSize / 2),
        -(viewSize / 2)
    );

    camera.position.z = viewSize;

    var ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

    // Light from above
    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.y = Tetrez.config.dimension.y;
    scene.add(directionalLight);

    var group = new THREE.Group();
    scene.add(group);

    // Uncomment to add plane
    // var geometry = new THREE.PlaneGeometry(Tetrez.config.dimension.x, Tetrez.config.dimension.y);
    // var material = new THREE.MeshBasicMaterial({ color: 0xffdfba, side: THREE.DoubleSide });
    // var plane = new THREE.Mesh(geometry, material);
    // scene.add(plane);

    var geometry = new THREE.BoxGeometry(1, 1, 1);

    var renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById("canvas"),
        antialias: true
    });

    renderer.setSize(width, height);
    renderer.setClearColor(0x000000);
    renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);

    var render = function() {
        if (group.rotation.x < nextRotationStopX) {
            group.rotation.x += rotationStep;       
        }

        if (group.rotation.y < nextRotationStopY) {
            group.rotation.y += rotationStep;       
        }

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    };

    // Initial render
    render();

    // Keep references to the lastly rendered meshs blocks
    // so they can be garbage collected later
    var lastMeshes = [];

    Tetrez.view = {
        draw: function() {
            // Garbage collection (remove all existing meshes from scene)
            for (var i = lastMeshes.length - 1; i >= 0; --i) {
                group.remove(lastMeshes[i]);
                lastMeshes.splice(lastMeshes.indexOf(i), 1);
            }

            for (var i = 0; i < Tetrez.field.field.length; ++i) {
                for (var j = 0; j < Tetrez.field.field[i].length; ++j) {
                    if (Tetrez.field.field[i][j].type !== 0) {
                        var material = new THREE.MeshLambertMaterial({ color: Tetrez.field.field[i][j].color });
                        var block = new THREE.Mesh(geometry, material);

                        block.translateY((Tetrez.config.dimension.y / 2 - .5) - i);
                        block.translateX(-(Tetrez.config.dimension.x / 2 - .5) + j);

                        group.add(block);
                        lastMeshes.push(block);
                    }
                }
            }
        },

        rotate: function(rotation) {
            if (rotation.x) nextRotationStopX += rotation.x;
            if (rotation.y) nextRotationStopY += rotation.y;
        }
    };
}());