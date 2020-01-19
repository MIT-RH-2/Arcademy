// Model for the experience data
function Group ( parentElement, position ) {
    this.parentElement = parentElement;
    this.position = position || new THREE.Vector3(0, 0, -3);

    this.elements = [];

    this.radix = 10;

    this.active = null;
}

Group.prototype.addElement = function(element){
    if(!element){
        console.warn('cant add undefined elements');
        return;
    }
    // push a 3D element into the list of elements
    element.group = this;
    this.elements.push(element);

    element.setAttribute('visible', 'true');

    // move the element to a neutral position so it can be positioned better
    if(element){
        TweenMax.to(element,1, {
            attr: {
                position: "0 0 0"
            },
            ease:"elastic.out(1, 0.3)"
        });
    }
};

Group.prototype.addGroup = function(group){
    // for every element in the group, remove it from there and add it to this one
    while( group.elements.length ){
    // console.log(group.elements.length);
        this.addElement( group.removeElement(group.elements.pop()) );
    // console.log(group.elements.length);
    }

    this.calculateTargets();
};

Group.prototype.removeElement = function(element){
    if(this.elements.indexOf(element) >= 0){
        // get rid of the element
        this.elements.splice(this.elements.indexOf(element), 1);
    }
    element.setAttribute('visible', 'false');

    // console.log('removing element:', element, 'to group:', this, element.getAttribute('visible'));
    return element;
};

Group.prototype.calculateTargets = function(){
    // console.log('calculateTargets');
    let row, column, remainder, percentWidth, scaler;
    let widthTotal = 1.5;
    for(var i = 0; i < this.elements.length; i++){
        // console.log(this.elements.length / i);
        // process the element's index
        row = Math.floor(i / this.radix);
        column = i % this.radix;
        // remainder = row ? 0 : (this.radix * this.elements.length / this.radix) - ;

        // percentWidth = column / this.radix;
        // scaler = remainder ?

        // update the index in case something was cut or whatever
        this.elements[i].index = i;
        this.elements[i].setAttribute('visible', 'true');

        this.elements[i].targetPosition = (new THREE.Vector3(column * 0.1, row * 0.15, 0)).add(this.position);

        // console.log(i + ' x:'+ this.elements[i].targetPosition.x +  ' y:'+ this.elements[i].targetPosition.y )

        if(!this.elements[i].object3D.parent){
            this.parentElement.add(this.elements[i].object3D);
        }
    }
};

Group.prototype.getPositionFromIndex = function(index){
    let position = new THREE.Vector3();

    // distribute the number

    return position;
}