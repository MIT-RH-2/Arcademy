// CURSOR-COMPONENT
AFRAME.registerComponent('updatecubes', {
    init: function(){
        setInterval(() => {
            const params = new URLSearchParams(window.location.search);
            const userId = params.get("user-id");
            if(userId){
                console.log('user id is:', userId);
                let postUrl = "https://aswnjqe5rb.execute-api.us-east-2.amazonaws.com/GA/users";
                var cameraEl = document.querySelector('#camera').object3D;
                var data = {
                        'user-id': userId,
                        'user-rotation': {x: cameraEl.rotation.x, y: cameraEl.rotation.y, z: cameraEl.rotation.z},
                        'user-rotation-x':cameraEl.rotation.x,
                        'user-rotation-y':cameraEl.rotation.y,
                        'user-rotation-z':cameraEl.rotation.z
                    };
                $.ajax({
                    type: 'POST',
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    url: postUrl,
                    success: function(jsondata){
                        console.log('sending post data:', jsondata);
                    },
		    error: function(e) {
			console.log('ERROR posting data:', e);
                    }
                })
            }
        }, 800);
    },
    tick: function () {

        let ease = 0.3;

        let cubeDistance = 0.3;
        let cube = document.querySelector('#cube0').object3D;
        let nextCube = document.querySelector('#cube1').object3D;
        cube.position.x = (1-ease) * cube.position.x + ease * (nextCube.position.x + cubeDistance);
        cube.position.y = (1-ease) * cube.position.y + ease * nextCube.position.y;
        cube.position.z = (1-ease) * cube.position.z + ease * nextCube.position.z;

        // gsap.to(nextCube.position, {x: cube.position.x + cubeDistance, y: cube.position.y, z: cube.position.z, duration: 0.3});
        // TweenMax.to(nextCube.position, 1, {x: cube.position.x + cubeDistance, y: cube.position.y, z: cube.position.z});

        cube = document.querySelector('#cube1').object3D;
        nextCube = document.querySelector('#cube2').object3D;

        cube.position.x = (1-ease) * cube.position.x + ease * (nextCube.position.x + cubeDistance);
        cube.position.y = (1-ease) * cube.position.y + ease * nextCube.position.y;
        cube.position.z = (1-ease) * cube.position.z + ease * nextCube.position.z;

        // gsap.to(nextCube.position, {x: cube.position.x + cubeDistance, y: cube.position.y, z: cube.position.z, duration: 0.3});
        // TweenMax.to(nextCube.position, 1, {x: cube.position.x + cubeDistance, y: cube.position.y, z: cube.position.z});
    }
});

