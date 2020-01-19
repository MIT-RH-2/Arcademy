// GLOBAL APP COMPONENT
const APP_SYSTEM = 'arcademy';

const STATES = {
    START: 'start',
    MENU: 'menu',
    DEMO: 'demo'
};

const CHANGE_SCENE = 'changeScene';
const SCENE_CHANGED = 'sceneChanged';

// APP SYSTEM, basically the cengralized data model
AFRAME.registerSystem( APP_SYSTEM, {
    schema: {
        scene: {
            type: 'string',
            default: ''
        }
    },

    // infoShowing: false,
    // navShowing: false,

    group: null,

    init: function() {
        this.group = new Group();

        this.group.reorganizeElements();
    },

    changeState: async function (data) {
        // emit the state change event for the old event
        console.log('state changed:', data);

        // update the scene data
        this.data.scene = data;

        // document.querySelector('.modal-blocker').setAttribute('opacity', 1);
        this.el.emit(SCENE_CHANGED, {scene: this.data.scene})
    }
});

// SKY CONTROLLER
AFRAME.registerComponent('sky-controller', {
    appEl: null,
    init: function () {

        // save a reference to the app system
        this.appEl = document.querySelector('a-scene');

        // listen for state changes coming from the scene
        this.appEl.addEventListener(SCENE_CHANGED, this.updateScene.bind(this));

        this.el.object3D.children[0].renderOrder = 1;

        // update based on the current state
        this.updateScene();
    },
    updateScene: function (evt) {
        var skyId;
        switch (this.appEl.systems[APP_SYSTEM].data.scene) {
            case STATES.START:
            case STATES.MENU:
            case STATES.DEMO:
            default:
                skyId = '#classroom';
                break;
        }

        this.el.setAttribute('src', skyId);
    }

});

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
/*
                $.post(postUrl, {
                    'user-id': userId,
                    'user-rotation': {x: cameraEl.rotation.x, y: cameraEl.rotation.y, z: cameraEl.rotation.z},
                    'user-rotation-x':cameraEl.rotation.x,
                    'user-rotation-y':cameraEl.rotation.y,
                    'user-rotation-z':cameraEl.rotation.z
                });
*/
                $.ajax({
                    type: 'POST',
                    crossDomain: true,
                    data: {
                        'user-id': userId,
                        'user-rotation': {x: cameraEl.rotation.x, y: cameraEl.rotation.y, z: cameraEl.rotation.z},
                        'user-rotation-x':cameraEl.rotation.x,
                        'user-rotation-y':cameraEl.rotation.y,
                        'user-rotation-z':cameraEl.rotation.z
                    },
                    dataType: 'jsonp',
                    url: postUrl,
                    success: function(jsondata){
                        console.log('sending post data:', jsondata);
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
        // cube.position.x = (1-ease) * cube.position.x + ease * (nextCube.position.x + cubeDistance);
        // cube.position.y = (1-ease) * cube.position.y + ease * nextCube.position.y;
        // cube.position.z = (1-ease) * cube.position.z + ease * nextCube.position.z;

        gsap.to(nextCube.position, {x: cube.position.x + cubeDistance, y: cube.position.y, z: cube.position.z, duration: 1, ease:"elastic.out(1, 0.3)"});
        // TweenMax.to(nextCube.position, 1, {x: cube.position.x + cubeDistance, y: cube.position.y, z: cube.position.z});

        cube = document.querySelector('#cube1').object3D;
        nextCube = document.querySelector('#cube2').object3D;

        // cube.position.x = (1-ease) * cube.position.x + ease * (nextCube.position.x + cubeDistance);
        // cube.position.y = (1-ease) * cube.position.y + ease * nextCube.position.y;
        // cube.position.z = (1-ease) * cube.position.z + ease * nextCube.position.z;

        gsap.to(nextCube.position, {x: cube.position.x + cubeDistance, y: cube.position.y, z: cube.position.z, duration: 1, ease:"elastic.out(1, 0.3)"});
        // TweenMax.to(nextCube.position, 1, {x: cube.position.x + cubeDistance, y: cube.position.y, z: cube.position.z});
    }
});

AFRAME.registerComponent('welcome-screen', {
    init: function(){
        // setup the play-button
        this.el.querySelector('.play-button').object3D.children[0].renderOrder = 30;
        this.el.querySelector('.play-button').getObject3D('mesh').material.alphaTest = 0.5;
        this.el.querySelector('.play-button').addEventListener('click', (function(evt){
            // change to the menu
            document.querySelector('a-scene').systems[APP_SYSTEM].changeState(STATES.MENU);

            // turn off this element
            this.el.setAttribute('visible', 'false');

            // turn on the demo world
            document.querySelector('#demo-world').setAttribute('visible', 'true');
            gsap.to(document.querySelector('#demo-world .equation'), {attr: {opacity: 1}, duration:2});

        }).bind(this));
    }
});

AFRAME.registerComponent('menu-screen', {
    init: function(){
    },


});

