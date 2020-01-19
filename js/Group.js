// Model for the experience data
function Group ( position ) {
    this.position = position || new THREE.Vector3(0, 0, -3);

    this.elements = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

    this.radix = 10;
}

Group.prototype.addElement = function(element){
    // push a 3D element into the list of elements
    this.elements.push(element);

    this.reorganizeElements();
};

Group.prototype.reorganizeElements = function(){
    let row, column;
    for(var i = 0; i < this.elements.length; i++){
        // process the element's index
        row = Math.floor(i / this.radix);
        column = i % this.radix;

        console.log('row:', row, 'column:', column);
    }
};

Group.prototype.getPositionFromIndex = function(index){
    let position = new THREE.Vector3();

    // distribute the number

    return position;
}