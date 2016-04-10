(function() {
    var viewSize = Tetrez.config.dimension.y;
    var rotationStep = Math.PI * 2 / 2500;
    var xRotationQueue = new Tetrez.Queue;
    var yRotationQueue = new Tetrez.Queue;

    var camera = new THREE.OrthographicCamera();
    var scene = new THREE.Scene();

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

    renderer.setClearColor(0x000000);
    renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);

    var render = function() {
        var xNextRotationTarget = xRotationQueue.getCurrent();
        var yNextRotationTarget = yRotationQueue.getCurrent();

        if (typeof xNextRotationTarget !== "undefined") {
            if (Math.abs(group.rotation.x - xNextRotationTarget) < 0.01) {
                xRotationQueue.pop();
            } else if (group.rotation.x > xNextRotationTarget) {
                group.rotation.x -= rotationStep;
            } else {
                group.rotation.x += rotationStep;
            }
        }

        if (typeof yNextRotationTarget !== "undefined") {
            if (Math.abs(group.rotation.y - yNextRotationTarget) < 0.01) {
                yRotationQueue.pop();
            } else if (group.rotation.y > yNextRotationTarget) {
                group.rotation.y -= rotationStep;
            } else {
                group.rotation.y += rotationStep;
            }
        }

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    };

    // Keep references to the lastly rendered meshs blocks
    // so they can be garbage collected later
    var lastMeshes = [];

    Tetrez.view = {
        init: function() {
            var width = window.innerWidth;
            var height = window.innerHeight;
            var aspectRatio = width / height;

            camera.left = -(aspectRatio * viewSize / 2);
            camera.right = (aspectRatio * viewSize / 2);
            camera.top = (viewSize / 2);
            camera.bottom = -(viewSize / 2);
            camera.position.z = viewSize;
            camera.updateProjectionMatrix();

            renderer.setSize(width, height);

            // Initial render
            render();
        },

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
            if (rotation.x) xRotationQueue.push(xRotationQueue.getLastPopped() + rotation.x);
            if (rotation.y) yRotationQueue.push(yRotationQueue.getLastPopped() + rotation.y);
        },

        isFrontSideBack: function() {
            var currentRelativeRotation = group.rotation.y % (Math.PI * 2);

            return (currentRelativeRotation >= Math.PI / 2 && currentRelativeRotation < Math.PI * 1.5);
        }
    };
}());