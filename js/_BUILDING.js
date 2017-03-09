
// Here we create the building and add it to the 3d scene

//-------------------------------------------------------------------------------------------
//  SETUP
//-------------------------------------------------------------------------------------------

function Building() {
    this.obj = new THREE.Object3D();
    scene3d.add( this.obj );

    this.simplex = new SimplexNoise();
    this.size = 2.5;

    this.generate();
}
var proto = Building.prototype;


//-------------------------------------------------------------------------------------------
//  GENERATE
//-------------------------------------------------------------------------------------------

proto.generate = function() {

    var i,s,l,geometry,material;


    this.dimensions = {
        width: 70,
        depth: 30,
        floors: 11,
        floorHeight: 5,
        floorSpace: 0.5,
        base: 3,
        roof: 1.5,
        wingWidth: 25,
        wingSpill: 2,
        balconyDepth: 12,
        balconySpill: 0.8
    };

    var m = this.dimensions;
    var meters = 0.035;

    var bh = (m.base + m.roof + ((m.floorHeight + m.floorSpace) * m.floors)) * meters;

    // BASE //
    /*geometry = new THREE.PlaneGeometry( 2, 2, 1, 1 );
    material = new materialType( {color: col3d} );
    this.terrain = new THREE.Mesh( geometry, material );
    this.terrain.rotation.x = -TAU/4;
     meshUpdate(this.terrain);
    this.obj.add( this.terrain );*/



    // MAIN //
    col3d = new THREE.Color( colToHex(color.processRGBA(brickCols[1],true)) );
    geometry = new THREE.BoxGeometry( m.width * meters, bh, m.depth * meters ); // w, h, d
    material = new materialType( {color: col3d} );

    var main = new THREE.Mesh( geometry, material );
    this.obj.add( main );




    // WINGS //
    var w = m.wingWidth * meters;
    var d = (m.depth + (2 * m.wingSpill)) * meters;
    geometry = new THREE.BoxGeometry( w, bh, d );

    var wing1 = new THREE.Mesh( geometry, material );
    this.obj.add( wing1 );
    wing1.position.x = -((m.width * meters) / 2) + (w / 2) - (m.wingSpill * meters);

    var wing2 = new THREE.Mesh( geometry, material );
    this.obj.add( wing2 );
    wing2.position.x = ((m.width * meters) / 2) - (w / 2) + (m.wingSpill * meters);




    // FLOORS //
    w = (m.wingWidth + (m.balconySpill * 2)) * meters;
    var h = (m.floorHeight / 2) * meters;
    d = (m.balconyDepth + m.balconySpill) * meters;
    var f = (m.floorHeight + m.floorSpace) * meters;

    col3d = new THREE.Color( colToHex(color.processRGBA(brickCols[3],true)) );
    material = new materialType( {color: col3d} );
    geometry = new THREE.BoxGeometry( w, h, d );

    l = m.floors;
    for (i=0; i<l; i++) {

        var y = -(bh / 2) + (m.base * meters) + (f * i);

        var fl = new THREE.Mesh( geometry, material );
        this.obj.add(fl);
        fl.position.x = - ((m.width * meters) / 2) + (w / 2) - (m.wingSpill * meters) - (m.balconySpill * meters);
        fl.position.z =   ((m.depth * meters) / 2) - (d / 2) + (m.wingSpill * meters) + (m.balconySpill * meters);
        fl.position.y = y;

        var fr = new THREE.Mesh( geometry, material );
        this.obj.add(fr);
        fr.position.x = ((m.width * meters) / 2) - (w / 2) + (m.wingSpill * meters) + (m.balconySpill * meters);
        fr.position.z = ((m.depth * meters) / 2) - (d / 2) + (m.wingSpill * meters) + (m.balconySpill * meters);
        fr.position.y = y;

        var bl = new THREE.Mesh( geometry, material );
        this.obj.add(bl);
        bl.position.x = - ((m.width * meters) / 2) + (w / 2) - (m.wingSpill * meters) - (m.balconySpill * meters);
        bl.position.z = - ((m.depth * meters) / 2) + (d / 2) - (m.wingSpill * meters) - (m.balconySpill * meters);
        bl.position.y = y;

        var br = new THREE.Mesh( geometry, material );
        this.obj.add(br);
        br.position.x =   ((m.width * meters) / 2) - (w / 2) + (m.wingSpill * meters) + (m.balconySpill * meters);
        br.position.z = - ((m.depth * meters) / 2) + (d / 2) - (m.wingSpill * meters) - (m.balconySpill * meters);
        br.position.y = y;
    }
};


//-------------------------------------------------------------------------------------------
//  UPDATE
//-------------------------------------------------------------------------------------------

proto.update = function() {
    // ROTATE //
    //this.obj.rotation.y += ((TAU/360) * 0.05);
};


//-------------------------------------------------------------------------------------------
//  MATHS
//-------------------------------------------------------------------------------------------


function meshRotate(mesh) {
    mesh.rotation.y = tombola.rangeFloat(0,TAU);
    meshUpdate(mesh);
}

function meshUpdate(mesh) {
    mesh.updateMatrix();
    mesh.geometry.applyMatrix( mesh.matrix );
    mesh.matrix.identity();
    mesh.position.set( 0, 0, 0 );
    mesh.rotation.set( 0, 0, 0 );
    mesh.scale.set( 1, 1, 1 );
}

function scale3D( obj, scale ) {
    obj.scale.x = scale;
    obj.scale.y = scale;
    obj.scale.z = scale;
}

function pointDistance(p1, p2) {
    return Math.sqrt( (p1.x-p2.x)*(p1.x-p2.x) + (p1.z-p2.z)*(p1.z-p2.z) );
}


