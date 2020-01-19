// GLOBAL APP COMPONENT
const APP_SYSTEM = 'arcademy';

const STATES = {
    START: 'start',
    MENU: 'menu',
    DEMO: 'demo'
};

let groupDistance = 0.3;
var getDistance = function(groupPos){
    var newPos = (new THREE.Vector3()).copy(groupPos);
    while(newPos.distanceTo(groupPos) < groupDistance * 2){
        newPos.x = Math.random() * 1 - 0.5;
        newPos.y = Math.random() * 0.8 - 0.4;
        newPos.z = Math.random() * 1 - 0.5;
    }
    return newPos;
}

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

    groups: [],
    elements: [],

    init: function() {
        this.updateGroupPositions = this.updateGroupPositions.bind(this);

        this.setNextSection = this.setNextSection.bind(this);

        // this.changeState( STATES.DEMO );

        setInterval(() => {
            // send the position update
            // TODO: if studentid, do that request instead and set the result to the camera's rotation

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

    updateGroupPositions: function(){
        // console.log('tick:', this.groups);
        let group, element, groupPop, i, j, positionDiff = new THREE.Vector3();

        // if the groups are close enough, they join
        if(this.groups[0] && this.groups[1] && this.groups[0].position.distanceTo(this.groups[1].position) < groupDistance){
            groupPop = this.groups.pop();
            this.groups[0].addGroup(groupPop);

            if(this.section < 4){
                this.setNextSection();
            }

            console.log('this.groups.pop:')

            // now remove the old group before processing
            // this.groups = [this.groups[0]];
        }

        // iterate over the groups
        for( i in this.groups){
            group = this.groups[i];

/*
            // check for an active element
            if(group.active){
                group.position.sub(group.active.delta);
            }
*/

            // recalculate target positions
            group.calculateTargets();

            let cubeDistance = 0.1;
            let cube;

            // iterate over all of the elements in the group
            for(j in group.elements){
                element = group.elements[j];

                // console.log('#sphere' + j + '|||group:', group, 'element:', element);

                // if the element isn't active, tween it to its target position
                if(group.active != element){
                    if(element && element.targetPosition && element.object3D){
                        // console.log('element.targetPosit:', element.object3D.position.x, element.object3D.position.y, element.object3D.position.z);
                        /*
                                                gsap.to(element.object3D.position, {
                                                    x:element.targetPosition.x,
                                                    y:element.targetPosition.y,
                                                    z:element.targetPosition.z,
                                                    duration: 1,
                                                    ease:"elastic.out(1, 0.3)"
                                                });
                        */
                        if(element.object3D.children.length){
                            TweenMax.to(element.object3D.children[0].position, group.active ? 1 + 2 * Math.abs(group.active.index - element.index) : 4, {x:element.targetPosition.x, y:element.targetPosition.y, z:element.targetPosition.z, ease:Elastic.easeOut});
                            // element.object3D.children[0].position.copy(element.targetPosition);
                        }
                        else {
                            TweenMax.to(element.object3D.position, group.active ? 1 + 2 * Math.abs(group.active.index - element.index) : 4, {x:element.targetPosition.x, y:element.targetPosition.y, z:element.targetPosition.z, ease:Elastic.easeOut});
                        }

                        // console.log('element:', element.getAttribute('position'));
                        // element.setAttribute('position', '0 0 0');

                        // element.setAttribute('position', (element.targetPosition.x + ' ' + element.targetPosition.y + ' ' + element.targetPosition.z));

                        // debugger;
                        /*
                                                TweenMax.to(element,1, {
                                                    attr: {
                                                        position: element.targetPosition.x + " " + element.targetPosition.y + element.targetPosition.z
                                                    },
                                                    ease:"elastic.out(1, 0.3)"
                                                })
                        */
                    }
                }
            }
        }
    },

    changeState: async function (data) {
        // emit the state change event for the old event
        console.log('state changed:', data);

        // update the scene data
        this.data.scene = data;

        // switch logic here because tired
        switch(data){
            case STATES.START:
                this.resetDemo();

                // turn off this element
                document.querySelector('#welcome-screen').setAttribute('visible', 'true');
                document.querySelector('#welcome-screen .play-button').setAttribute('visible', 'true');
                document.querySelector('#welcome-screen .play-button').setAttribute('enabled', 'true');

                // turn on the demo world
                document.querySelector('#demo-screen').setAttribute('visible', 'false');
                gsap.to(document.querySelector('#demo-screen .equation'), {attr: {opacity: 0}, delay: 1, duration:2});


                break;
            case STATES.DEMO:
                this.resetDemo();

                this.setupTwoBalls();
                break;
            default:
                break;
        }

        // document.querySelector('.modal-blocker').setAttribute('opacity', 1);
        this.el.emit(SCENE_CHANGED, {scene: this.data.scene})
    },

    resetDemo: function(){
        // remove all elements from their parents at least for now
        for(var i in this.elements){
            this.elements[i].object3D.parent.remove(this.elements[i].object3D);
        }

        // reset animation arrays
        this.groups = [];
        this.elements = [];
    },
    section: null,

    setupTwoBalls: function(){
        var group1 = new Group(this.el.object3D, new THREE.Vector3(-.5, 0.3, 0));
        this.groups.push(group1);

        var element = document.querySelector('#sphere0');
        this.elements.push(element);
        group1.addElement(element);

        var group2 = new Group(this.el.object3D, new THREE.Vector3(.7, 0.3, 0));
        this.groups.push(group2);

        element = document.querySelector('#sphere1');
        this.elements.push(element);
        group2.addElement(element);

        element = document.querySelector('#sphere2');
        this.elements.push(element);
        group2.addElement(element);

        element = document.querySelector('#sphere3');
        this.elements.push(element);
        group2.addElement(element);

        element = document.querySelector('#sphere4');
        this.elements.push(element);
        group2.addElement(element);

        var element = document.querySelector('#sphere5');
        this.elements.push(element);
        group2.addElement(element);

        element = document.querySelector('#sphere6');
        this.elements.push(element);
        group2.addElement(element);

        element = document.querySelector('#sphere7');
        this.elements.push(element);
        group2.addElement(element);

        element = document.querySelector('#sphere8');
        this.elements.push(element);
        group2.addElement(element);

        element = document.querySelector('#sphere9');
        this.elements.push(element);
        group2.addElement(element);

        element = document.querySelector('#sphere10');
        this.elements.push(element);
        group2.addElement(element);

        this.section = 1;

        document.querySelector('.equation').setAttribute('value', "1 + 1 = 2");

        // element = document.querySelector('#sphere2');
        // this.elements.push(element);
        // group2.addElement(element);
        //
        // element = document.querySelector('#sphere3');
        // this.elements.push(element);
        // group2.addElement(element);
        //
        // element = document.querySelector('#sphere4');
        // this.elements.push(element);
        // group2.addElement(element);

        // console.log('setup 2balls elems:', this.elements, 'groups:', this.groups);
    },

    setNextSection: function(){
        var group1, group2, element;

        console.log('next section:', this.section);
        if (this.section === 1){
            group2 = new Group(this.el.object3D, getDistance(this.groups[0].position));
            this.groups.push(group2);

            element = document.querySelector('#sphere2');
            this.elements.push(element);
            group2.addElement(element);

            element = document.querySelector('#sphere3');
            this.elements.push(element);
            group2.addElement(element);

            element = document.querySelector('#sphere4');
            this.elements.push(element);
            group2.addElement(element);

            document.querySelector('.equation').setAttribute('value', "2 + 3 = 5");

            this.section = 2;
        } else if (this.section === 2){
            group2 = new Group(this.el.object3D, getDistance(this.groups[0].position));
            this.groups.push(group2);

            var element = document.querySelector('#sphere5');
            this.elements.push(element);
            group2.addElement(element);

            element = document.querySelector('#sphere6');
            this.elements.push(element);
            group2.addElement(element);

            element = document.querySelector('#sphere7');
            this.elements.push(element);
            group2.addElement(element);

            element = document.querySelector('#sphere8');
            this.elements.push(element);
            group2.addElement(element);

            element = document.querySelector('#sphere9');
            this.elements.push(element);
            group2.addElement(element);

            element = document.querySelector('#sphere10');
            this.elements.push(element);
            group2.addElement(element);

            document.querySelector('.equation').setAttribute('value', "5 + 6 = 11");

            this.section = 3;
        }else if (this.section === 3){
            group2 = new Group(this.el.object3D, getDistance(this.groups[0].position));
            this.groups.push(group2);

            var element = document.querySelector('#sphere5');
            this.elements.push(element);
            group2.addElement(element);

            element = document.querySelector('#sphere6');
            this.elements.push(element);
            group2.addElement(element);

            element = document.querySelector('#sphere7');
            this.elements.push(element);
            group2.addElement(element);

            element = document.querySelector('#sphere8');
            this.elements.push(element);
            group2.addElement(element);

            element = document.querySelector('#sphere9');
            this.elements.push(element);
            group2.addElement(element);

            element = document.querySelector('#sphere10');
            this.elements.push(element);
            group2.addElement(element);

            document.querySelector('.equation').setAttribute('value', "5 + 6 = 11");

            this.section = 4;
        }
        else if(this.section === 4){

            document.querySelector('.equation').setAttribute('value', "Congratulations!");

            this.section = 5;

            // show the won dialog
            this.changeState(STATES.START);
        }

    },

    tick: function(){

        this.updateGroupPositions();

    }

        /*
    tick: function () {
                let ease = 0.3;

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
        */
});

AFRAME.registerComponent('element', {
    offPosition: '3000 3000 3000',
    active: false,
    index:null,
    init: function() {
        console.log('this.el:', this.el);

        TweenMax.to(this.el,0, {
            attr: {
                position: this.offPosition
            }
        });

        // bind the window hit function to this element handler
        window.hitEl = this.handleDown.bind(this);
        window.upEl = this.handleUp.bind(this);
    },
    startPosition: new THREE.Vector3(),
    handleDown: function(element){
        element.active = true;
        element.group.active = element;
        this.startPosition.copy(element.group.position);
        // document.querySelector('.equation').setAttribute('value', element.group + ":" + element.index);
    },
    handleUp: function(element){
        element.group.active = undefined;
        // TweenMax.to(element,1, {
        //     attr: {
        //         position: "0 0 0"
        //     },
        //     ease:"elastic.out(1, 0.3)"
        // });
        let elPos = new THREE.Vector3();
        elPos.copy(element.targetPosition);//.add(element.group.position).sub(this.startPosition);
        element.setAttribute('position', "0 0 0");

        if(element.object3D.children.length){
            // TweenMax.to(element.object3D.children[0].position, 1, {x:element.targetPosition.x, y:element.targetPosition.y, z:element.targetPosition.z, ease:Elastic.easeOut});
            element.object3D.children[0].position.copy(element.targetPosition);
        }
        else {
            element.object3D.position.copy(element.targetPosition);
            // TweenMax.to(element.object3D.position, group.active ? 1 + 5 * Math.abs(group.active.index - element.index) : 1, {x:element.targetPosition.x, y:element.targetPosition.y, z:element.targetPosition.z, ease:Elastic.easeOut});
        }

        // element.object3D.position.copy(element.targetPosition);
        // element.object3D.children[0].position.copy(element.targetPosition);
        // element.object3D.position.sub(element.targetPosition);
        // element.object3D.position.add(elPos);

        // document.querySelector('.equation').setAttribute('value', elPos.x + " " + elPos.y + " " + elPos.z);
    }
});

AFRAME.registerComponent('demo-screen', {
    init: function(){
        // object3D
    },
});

AFRAME.registerComponent('welcome-screen', {
    init: function(){
        // setup the play-button
        this.el.querySelector('.play-button').object3D.children[0].renderOrder = 30;
        this.el.querySelector('.play-button').getObject3D('mesh').material.alphaTest = 0.5;
        this.el.querySelector('.play-button').addEventListener('click', (function(evt){
            // change to the menu
            document.querySelector('a-scene').systems[APP_SYSTEM].changeState(STATES.DEMO);

            // turn off this element
            this.el.setAttribute('visible', 'false');
            this.el.querySelector('.play-button').remove();

            // turn on the demo world
            document.querySelector('#demo-screen').setAttribute('visible', 'true');
            gsap.to(document.querySelector('#demo-screen .equation'), {attr: {opacity: 1}, duration:2});

        }).bind(this));
    }
});

AFRAME.registerComponent('menu-screen', {
    init: function(){
    },


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
    },
});

