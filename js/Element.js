/*
// Model for the experience data
function Element ( ) {
    console.log('made the element:', this);

    this.active = false;

    this.init();
}

Element.prototype.init = function(){
    debugger;
    // use the default object as a factory and make it visible
    var geometry = new THREE.SphereGeometry( 5, 32, 32 );
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    this.object3D = new THREE.Mesh( geometry, material );
    this.object3D.position = new THREE.Vector3(-1, 1, -2);
    this.object3D.visible = true;

    this.object3D.element = this;
};

Element.prototype.addElement = function(element){
    // push a 3D element into the list of elements
    this.elements.push(element);

    this.reorganizeElements();
};

*/
