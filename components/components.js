// CURSOR-COMPONENT
AFRAME.registerComponent('updatecubes', {
    tick: function () {

        let cube = document.querySelector('#cube0').object3D;
        let nextCube = document.querySelector('#cube1').object3D;
        cube.position.x = 0.8 * cube.position.x + (0.2 * nextCube.position.x + 0.08);
        cube.position.y = 0.8 * cube.position.y + 0.2 * nextCube.position.y;
        cube.position.z = 0.8 * cube.position.z + 0.2 * nextCube.position.z;
        // TweenMax.to(nextCube.position, 1, {x: cube.position.x + 0.5, y: cube.position.y, z: cube.position.z});

        cube = document.querySelector('#cube1').object3D;
        nextCube = document.querySelector('#cube2').object3D;
        cube.position.x = 0.8 * cube.position.x + (0.2 * nextCube.position.x + 0.08);
        cube.position.y = 0.8 * cube.position.y + 0.2 * nextCube.position.y;
        cube.position.z = 0.8 * cube.position.z + 0.2 * nextCube.position.z;
        // TweenMax.to(nextCube.position, 1, {x: cube.position.x + 0.5, y: cube.position.y, z: cube.position.z});

    }
});

