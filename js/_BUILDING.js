
// Here we create the building and add it to the 3d scene

//-------------------------------------------------------------------------------------------
//  SETUP
//-------------------------------------------------------------------------------------------

var meters = 0.04;

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
        width: 55,
        depth: 25,
        floors: 10,
        floorHeight: 4.2,
        base: 1.8,
        roof: 1.5,
        wingWidth: 20,
        wingSpill: 3,
        headerDepth: 11,
        headerSpill: 1,
        headerHeight: 1.6,
        entranceWidth: 11,
        entranceDepth: 8,
        antenna: 0.21
    };

    var m = this.dimensions;

    var bh = (m.base + m.roof + (m.floorHeight * m.floors)) * meters;
    this.height = bh;

    // BASE //
    /*geometry = new THREE.PlaneGeometry( 2, 2, 1, 1 );
    material = new materialType( {color: col3d} );
    this.terrain = new THREE.Mesh( geometry, material );
    this.terrain.rotation.x = -TAU/4;
     meshUpdate(this.terrain);
    this.obj.add( this.terrain );*/



    // MAIN //
    col3d = new THREE.Color( colToHex(color.processRGBA(concreteCols[3],true)) );
    geometry = new THREE.BoxGeometry( m.width * meters, bh, m.depth * meters ); // w, h, d
    material = new materialType( {color: col3d} );

    var main = new THREE.Mesh( geometry, material );
    main.castShadow = true;
    main.receiveShadow = true;
    this.obj.add( main );




    // WINGS //
    var w = m.wingWidth * meters;
    var d = (m.depth + (2 * m.wingSpill)) * meters;
    geometry = new THREE.BoxGeometry( w, bh, d );

    var wing1 = new THREE.Mesh( geometry, material );
    wing1.castShadow = true;
    wing1.receiveShadow = true;
    this.obj.add( wing1 );
    wing1.position.x = -((m.width * meters) / 2) + (w / 2) - (m.wingSpill * meters);

    var wing2 = new THREE.Mesh( geometry, material );
    wing2.castShadow = true;
    wing2.receiveShadow = true;
    this.obj.add( wing2 );
    wing2.position.x = ((m.width * meters) / 2) - (w / 2) + (m.wingSpill * meters);




    // FLOORS //
    w = (m.wingWidth + (m.headerSpill * 2)) * meters;
    var h = m.headerHeight * meters;
    d = (m.headerDepth + m.headerSpill) * meters;
    var f = m.floorHeight * meters;
    var startY = -(bh / 2) + (m.base * meters) - (h/2) + (f * 1);

    col3d = new THREE.Color( colToHex(color.processRGBA(concreteCols[1],true)) );
    material = new materialType( {color: col3d} );
    geometry = new THREE.BoxGeometry( w, h, d );
    var he;

    l = m.floors;
    for (i=0; i<l; i++) {

        var y = startY + (f * i);

        he = new THREE.Mesh( geometry, material );
        he.castShadow = true;
        he.receiveShadow = true;
        this.obj.add(he);
        he.position.x = - ((m.width * meters) / 2) + (w / 2) - (m.wingSpill * meters) - (m.headerSpill * meters);
        he.position.z =   ((m.depth * meters) / 2) - (d / 2) + (m.wingSpill * meters) + (m.headerSpill * meters);
        he.position.y = y;

        he = new THREE.Mesh( geometry, material );
        he.castShadow = true;
        he.receiveShadow = true;
        this.obj.add(he);
        he.position.x = ((m.width * meters) / 2) - (w / 2) + (m.wingSpill * meters) + (m.headerSpill * meters);
        he.position.z = ((m.depth * meters) / 2) - (d / 2) + (m.wingSpill * meters) + (m.headerSpill * meters);
        he.position.y = y;

        he = new THREE.Mesh( geometry, material );
        he.castShadow = true;
        he.receiveShadow = true;
        this.obj.add(he);
        he.position.x = - ((m.width * meters) / 2) + (w / 2) - (m.wingSpill * meters) - (m.headerSpill * meters);
        he.position.z = - ((m.depth * meters) / 2) + (d / 2) - (m.wingSpill * meters) - (m.headerSpill * meters);
        he.position.y = y;

        he = new THREE.Mesh( geometry, material );
        he.castShadow = true;
        he.receiveShadow = true;
        this.obj.add(he);
        he.position.x =   ((m.width * meters) / 2) - (w / 2) + (m.wingSpill * meters) + (m.headerSpill * meters);
        he.position.z = - ((m.depth * meters) / 2) + (d / 2) - (m.wingSpill * meters) - (m.headerSpill * meters);
        he.position.y = y;
    }


    // ENTRANCE //
    this.entrance(m);


    // ELEVATOR //
    this.elevator(m);


    // ANTENNAE //
    this.antennae(bh);


    // SUBSTATION //
    this.substation(m);


    // SIDE LIGHTS //
    var x = -((m.width * meters) / 2) - (m.wingSpill * meters);
    y = (bh / 2) - (m.roof * meters);
    var z = 2.5 * meters;

    this.obj.add( lightPanel(x,y,-z,'left') );
    this.obj.add( lightPanel(x,y,z,'left') );
    this.obj.add( lightPanel(-x,y,-z,'right') );
    this.obj.add( lightPanel(-x,y,z,'right') );
};




proto.entrance = function(m) {


    var w = m.entranceWidth * meters;
    var h = m.headerHeight * meters;
    var d = m.entranceDepth * meters;
    var x;
    var y = -(this.height / 2);
    var z = ((m.depth * meters) / 2);
    var p;

    // create object //
    var ent = new THREE.Object3D();
    ent.position.set(0,y,z);


    // roof //
    col3d = new THREE.Color( colToHex(color.processRGBA(concreteCols[1],true)) );
    var material = new materialType( {color: col3d} );
    var geometry = new THREE.BoxGeometry( w, h, d );

    var e = new THREE.Mesh( geometry, material );
    e.castShadow = true;
    e.receiveShadow = true;
    ent.add( e );
    y = (m.base * meters) - (h/2) + (m.floorHeight * meters);
    z = (d / 2);
    e.position.set(0,y,z);


    // columns //
    /*h = m.floorHeight * meters;
    x = ((m.entranceWidth * meters) / 2) - (2 * meters);
    y = (h / 2);
    z = d - (2 * meters);

    geometry = new THREE.BoxGeometry( meters, h, meters );

    // L //
    p = new THREE.Mesh( geometry, material );
    p.castShadow = true;
    p.receiveShadow = true;
    ent.add( p );
    p.position.set(-x,y,z);

    // R //
    p = new THREE.Mesh( geometry, material );
    p.castShadow = true;
    p.receiveShadow = true;
    ent.add( p );
    p.position.set(x,y,z);*/



    // door //
    w = (m.entranceWidth - 6) * meters;
    h = (m.floorHeight + m.base) * meters;
    x = ((m.entranceWidth * meters) / 2) - (0.75 * meters);
    y = h / 2;
    z = 0.001;

    geometry = new THREE.BoxGeometry( 2* meters, h, 4 * meters );

    p = new THREE.Mesh( geometry, material );
    p.castShadow = true;
    p.receiveShadow = true;
    ent.add( p );
    p.position.set(-x,y,1.5 * meters);

    p = new THREE.Mesh( geometry, material );
    p.castShadow = true;
    p.receiveShadow = true;
    ent.add( p );
    p.position.set(x,y,1.5 * meters);


    col3d = new THREE.Color( colToHex(color.processRGBA(windowCols[0],true)) );
    geometry = new THREE.PlaneGeometry( w, h );
    material = new THREE.MeshBasicMaterial( {color: col3d} );

    p = new THREE.Mesh( geometry, material );
    p.castShadow = true;
    p.receiveShadow = true;
    ent.add( p );
    p.position.set(0,y,z);


    // lights //
    x = ((m.entranceWidth * meters) / 2);
    y = (m.base * meters) - ((m.headerHeight * meters) / 2) + (m.floorHeight * meters);
    z = (d / 2);

    // L //
    ent.add( lightPanel(-x,y,z,'left') );

    // R //
    ent.add( lightPanel(x,y,z,'right') );

    this.obj.add( ent );
};



function lightPanel(x,y,z,orientation) {
    var w = 1 * meters;
    var h = 0.6 * meters;
    var geometry = new THREE.PlaneGeometry( w, h );
    var material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
    var p = new THREE.Mesh( geometry, material );
    p.position.set(x,y,z);
    switch (orientation) {
        case 'left':
            p.rotation.y = -TAU/4;
            p.position.x -= 0.001;
            break;
        case 'right':
            p.rotation.y = TAU/4;
            p.position.x += 0.001;
            break;
        case 'back':
            p.rotation.y = TAU/2;
            p.position.z -= 0.001;
            break;
        case 'front':
            p.position.z += 0.001;
            break;
    }

    return p;
}




proto.antennae = function(bh) {

    var m = this.dimensions;

    // thickness //
    var t = m.antenna * meters;
    var t2,blh, b, material;



    var r = 1;

    // clusters //
    var n = tombola.range(2,3);
    for (var j=0; j<n; j++) {
        var x = tombola.rangeFloat(-25,25);
        var y = tombola.rangeFloat(-9,9);

        // antennae per cluster //
        var n2 = tombola.range(2,4);
        for (var i=0; i<n2; i++) {

            var h = tombola.rangeFloat(2,22) * meters;

            col3d = new THREE.Color( colToHex(color.processRGBA(brickCols[3],true)) );
            material = new materialType( {color: col3d} );
            var geometry = new THREE.BoxGeometry( t, h, t );
            var a = new THREE.Mesh( geometry, material );
            this.obj.add(a);
            a.position.x =  (x + tombola.rangeFloat(-r,r)) * meters;
            a.position.z =  (y + tombola.rangeFloat(-r,r)) * meters;
            a.position.y =  (bh/2) + (h/2);


            // block //
            if (tombola.percent(50)) {
                t2 = tombola.rangeFloat(0.3,0.8) * meters;
                blh = tombola.rangeFloat(0.5 * meters,(h/2));
                col3d = new THREE.Color( colToHex(color.processRGBA(tombola.item(headerCols),true)) );
                material = new materialType( {color: col3d} );
                geometry = new THREE.BoxGeometry( t2, blh, t2 );
                b = new THREE.Mesh( geometry, material );
                b.castShadow = true;
                this.obj.add(b);
                b.position.x =  a.position.x;
                b.position.z =  a.position.z;
                b.position.y =  a.position.y + tombola.rangeFloat(-(h/2),(h/2));
            }

            // block 2 //
            if (tombola.percent(10)) {
                t2 = tombola.rangeFloat(0.3,0.8) * meters;
                blh = tombola.rangeFloat(0.5 * meters,(h/2));
                col3d = new THREE.Color( colToHex(color.processRGBA(tombola.item(headerCols),true)) );
                material = new materialType( {color: col3d} );
                geometry = new THREE.BoxGeometry( t2, blh, t2 );
                b = new THREE.Mesh( geometry, material );
                b.castShadow = true;
                this.obj.add(b);
                b.position.x =  a.position.x;
                b.position.z =  a.position.z;
                b.position.y =  a.position.y + tombola.rangeFloat(-(h/2),(h/2));
            }

            // dish //
            if (tombola.percent(10)) {
                var rad = tombola.rangeFloat(0.2,1.3) * meters;
                col3d = new THREE.Color( colToHex(color.processRGBA(tombola.item(headerCols),true)) );
                material = new materialType( {color: col3d} );
                geometry = new THREE.CylinderGeometry( rad, rad, 0.4 * meters );
                b = new THREE.Mesh( geometry, material );
                b.castShadow = true;
                this.obj.add(b);
                b.position.x =  a.position.x;
                b.position.z =  a.position.z;
                b.position.y =  a.position.y + tombola.rangeFloat(-(h/2),(h/2));
                b.rotation.x = -TAU/4;
                b.rotation.z = Math.random() * TAU;
            }

        }

    }
};


proto.elevator = function(m) {
    var w = 8 * meters;
    var h = this.height + (4 * meters);
    var d = 8 * meters;
    var x = 0;
    var y = -(this.height / 2); // base
    var z = -((m.depth * meters) / 2); // back

    col3d = new THREE.Color( colToHex(color.processRGBA(headerCols[5],true)) );
    var material = new materialType( {color: col3d} );
    var geometry = new THREE.BoxGeometry( w,h,d );

    var spawner = new Spawner(w,h,d, new THREE.Mesh( geometry, material ));
    spawner.mesh.castShadow = true;
    spawner.mesh.receiveShadow = true;
    spawner.position(x,y,z);
    spawner.align('bottom');
    spawner.align('front');
    spawner.spawn( this.obj);
};



proto.substation = function(m) {
    var w = 1 * meters;
    var h = 1.6 * meters;
    var d = 2.1 * meters;
    var x = -30 * meters;
    var y = -(this.height / 2);
    var z = ((m.depth * meters) / 2) + (25 * meters);
    var t = m.antenna * meters;
    var ah = 2 * meters;

    col3d = new THREE.Color( colToHex(color.processRGBA(headerCols[3],true)) );
    var material = new materialType( {color: col3d} );
    var geometry = new THREE.BoxGeometry( w,h,d );

    var mesh = new THREE.Mesh( geometry, material );
    //mesh.castShadow = true;
    mesh.position.set(x,y + (h/2),z);
    this.obj.add(mesh);

    col3d = new THREE.Color( colToHex(color.processRGBA(brickCols[3],true)) );
    material = new materialType( {color: col3d} );
    geometry = new THREE.BoxGeometry( t, ah, t );

    mesh = new THREE.Mesh( geometry, material );
    mesh.position.set(x,y + (ah/2),z - (0.5 * meters));
    this.obj.add(mesh);
};


// bounding box positioning helper //
function Spawner(w,h,d,mesh) {
    this.w = w;
    this.h = h;
    this.d = d;
    this.mesh = mesh;
}
Spawner.prototype.spawn = function( obj ) {
    obj.add (this.mesh);
    // null references here?
};

Spawner.prototype.position = function(x,y,z) {
    this.mesh.position.set(x,y,z);
};

Spawner.prototype.align = function(origin,padding) {
    padding = padding || 0;

    switch (origin) {

        case 'back':
            this.mesh.position.z += ((this.d / 2) + padding);
            break;

        case 'front':
            this.mesh.position.z -= ((this.d / 2) + padding);
            break;

        case 'left':
            this.mesh.position.x -= ((this.w / 2) + padding);
            break;

        case 'right':
            this.mesh.position.x += ((this.w / 2) + padding);
            break;

        case 'top':
            this.mesh.position.y -= ((this.h / 2) + padding);
            break;

        case 'bottom':
        case 'base':
            this.mesh.position.y += ((this.h / 2) + padding);
            break;
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


