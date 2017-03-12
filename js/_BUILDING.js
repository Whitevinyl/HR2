
// Here we create the building and add it to the 3d scene created in _3D.js

// NOTE: This is still very rough experimentation! Will be separating out reusable
// functions, but for now it's pretty messy.

// all generation is made from three.js primitive meshes (box, plane & cylinder) using
// flat coloured materials. Randomisation helps out with antenna, dish & air-con placement.

//-------------------------------------------------------------------------------------------
//  SETUP
//-------------------------------------------------------------------------------------------

var meters = 0.04; // unit for building measurement

function Building() {

    // create container object //
    this.obj = new THREE.Object3D();
    scene3d.add( this.obj );

    // generate the building //
    this.generate();
}
var proto = Building.prototype;


//-------------------------------------------------------------------------------------------
//  GENERATE
//-------------------------------------------------------------------------------------------

proto.generate = function() {

    var i,l,geometry,material;

    // set our primary dimensions //
    this.dimensions = {
        width: 55,
        depth: 25,
        floors: 10,
        floorHeight: 4.2,
        base: 1.8,
        roof: 1.5,
        flatWidth: 10,
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


    // get & store total building height from combined floor heights //
    var bh = (m.base + m.roof + (m.floorHeight * m.floors)) * meters;
    this.height = bh;



    ////// GENERATING ... //////
    ////////////////////////////

    // MAIN BUILDING BLOCK //
    var col = new THREE.Color( colToHex(color.processRGBA(concreteCols[0],true)) );
    geometry = new THREE.BoxGeometry( m.width * meters, bh, m.depth * meters ); // w, h, d
    material = new materialType( {color: col} );

    var main = new THREE.Mesh( geometry, material );
    main.castShadow = true;
    main.receiveShadow = true;
    this.obj.add( main );




    // WINGS //
    // The two larger boxes each side //
    var w = m.wingWidth * meters;
    var d = (m.depth + (2 * m.wingSpill)) * meters;
    geometry = new THREE.BoxGeometry( w, bh, d );

    // L //
    var wing1 = new THREE.Mesh( geometry, material );
    wing1.castShadow = true;
    wing1.receiveShadow = true;
    this.obj.add( wing1 );
    wing1.position.x = -((m.width * meters) / 2) + (w / 2) - (m.wingSpill * meters);

    // R //
    var wing2 = new THREE.Mesh( geometry, material );
    wing2.castShadow = true;
    wing2.receiveShadow = true;
    this.obj.add( wing2 );
    wing2.position.x = ((m.width * meters) / 2) - (w / 2) + (m.wingSpill * meters);




    // FLOORS //
    // here we loop through each floor, adding 'headers' (the ribs that stick out above windows)
    // side & front windows, and the flat/apartment faces.


    w = (m.wingWidth + (m.headerSpill * 2)) * meters;
    var h = m.headerHeight * meters;
    d = (m.headerDepth + m.headerSpill) * meters;
    var f = m.floorHeight * meters;
    var startY = -(bh / 2) + (m.base * meters) - (h/2) + (f * 1);


    col = new THREE.Color( colToHex(color.processRGBA(concreteCols[2],true)) );
    material = new materialType( {color: col} );
    geometry = new THREE.BoxGeometry( w, h, d );
    var he;

    // do the loop //
    l = m.floors;
    for (i=0; i<l; i++) {
        var y = startY + (f * i);

        // headers //
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


        // side windows //
        var wx = -((m.width * meters) / 2) - (m.wingSpill * meters);
        var wy = y + ((m.headerHeight * meters) / 2) - ((m.floorHeight * meters) * 0.5);
        this.obj.add ( window1(wx, wy,0,'left',false) );
        this.obj.add ( window1(-wx,wy,0,'right',false) );

        // front windows //
        wx = -(5 * meters);
        var wz = ((m.depth * meters) / 2);
        this.obj.add ( window1(wx, wy,wz,'front',false) );
        this.obj.add ( window1(0, wy,wz,'front',false) );
        this.obj.add ( window1(-wx,wy,wz,'front',false) );


        // flats //
        var fx = -((m.width + (m.wingSpill * 2)) * meters) / 2;
        var fy = y + ((m.headerHeight * meters) / 2) - (m.floorHeight * meters);
        var fz = (((m.depth + (m.wingSpill * 2)) * meters) / 2);

        this.obj.add ( flat(m,fx + ((m.flatWidth * meters) / 2),fy,fz,'front',false) );
        this.obj.add ( flat(m,fx + ((m.flatWidth * meters) * 1.5),fy,fz,'front',false) );

        this.obj.add ( flat(m,-fx - ((m.flatWidth * meters) / 2),fy,fz,'front',false) );
        this.obj.add ( flat(m,-fx - ((m.flatWidth * meters) * 1.5),fy,fz,'front',false) );

        this.obj.add ( flat(m,fx + ((m.flatWidth * meters) / 2),fy,-fz,'back',false) );
        this.obj.add ( flat(m,fx + ((m.flatWidth * meters) * 1.5),fy,-fz,'back',false) );

        this.obj.add ( flat(m,-fx - ((m.flatWidth * meters) / 2),fy,-fz,'back',false) );
        this.obj.add ( flat(m,-fx - ((m.flatWidth * meters) * 1.5),fy,-fz,'back',false) );
    }


    // here I started putting these code blocks into individual methods - plan to do
    // the same with the above blocks.


    // BASE //
    this.base(m);


    // ENTRANCE //
    this.entrance(m);


    // ELEVATOR //
    this.elevator(m);


    // ANTENNAE //
    this.antennae(bh);


    // ROOF //
    this.roof(m);


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



// BASE //
proto.base = function(m) {

    var w = (m.width + m.wingSpill + 9) * meters;
    var d = (m.depth + m.wingSpill + 16) * meters;
    var x = (3 * meters);
    var y = -(this.height / 2);
    var z = 0;

    var col = new THREE.Color( colToHex(color.processRGBA(concreteCols[4],true)) );
    var material = new materialType( {color: col} );


    // floor 1 //
    var geometry = new THREE.PlaneGeometry( w,d );
    var p = new THREE.Mesh( geometry, material );
    p.receiveShadow = true;
    p.rotation.x = -TAU/4;
    p.position.set(x,y,z);
    this.obj.add( p );


    // floor 2 //
    var w2 = 40 * meters;
    var d2 = 20 * meters;
    var x2 = x - (w/2) + (w2/2);
    var z2 = (d/2) + (d2/2);

    geometry = new THREE.PlaneGeometry( w2,d2 );
    p = new THREE.Mesh( geometry, material );
    p.receiveShadow = true;
    p.rotation.x = -TAU/4;
    p.position.set(x2,y,z2);
    this.obj.add( p );


    // wall //
    var w3 = 0.6 * meters;
    var d3 = 20 * meters;
    var h3 = 1.3 * meters;
    var x3 = x - (w/2) + w2 - (w3/2);
    var y3 = y + (h3 / 2);
    var z3 = (d/2) + (d2/2);

    col = new THREE.Color( colToHex(color.processRGBA(concreteCols[3],true)) );
    material = new materialType( {color: col} );

    geometry = new THREE.BoxGeometry( w3,h3,d3 );
    p = new THREE.Mesh( geometry, material );
    p.castShadow = true;
    p.position.set(x3,y3,z3);

    this.obj.add( p );
};



// ROOF //
proto.roof = function(m) {
    var t = 0.4 * meters;
    var h = 1.1 * meters;
    var y = (this.height / 2) + (h * 0.55);

    var x1,z1,x2,z2;
    var pad = (t / 2) - 0.005;
    var col = new THREE.Color( colToHex(color.processRGBA(headerCols[3],true)) );

    // WALLS  LEFT //

    // front //
    x1 = (-((m.width + (m.wingSpill * 2)) * meters) / 2) + pad;
    z1 = ( ((m.depth + (m.wingSpill * 2)) * meters) / 2) - pad;
    x2 = (-((m.width + (m.wingSpill * 2)) * meters) / 2) + (m.wingWidth * meters) - pad;
    z2 = ( ((m.depth + (m.wingSpill * 2)) * meters) / 2) - pad;
    this.obj.add(wall(x1,z1,x2,z2,t,h,y,col));

    // side //
    x1 = (-((m.width + (m.wingSpill * 2)) * meters) / 2) + pad;
    z1 = ( ((m.depth + (m.wingSpill * 2)) * meters) / 2) - pad;
    x2 = (-((m.width + (m.wingSpill * 2)) * meters) / 2) + pad;
    z2 = (-((m.depth + (m.wingSpill * 2)) * meters) / 2) + pad;
    this.obj.add(wall(x1,z1,x2,z2,t,h,y,col));

    // back //
    x1 = (-((m.width + (m.wingSpill * 2)) * meters) / 2) + (m.wingWidth * meters) - pad;
    z1 = (-((m.depth + (m.wingSpill * 2)) * meters) / 2) + pad;
    x2 = (-((m.width + (m.wingSpill * 2)) * meters) / 2) + pad;
    z2 = (-((m.depth + (m.wingSpill * 2)) * meters) / 2) + pad;
    this.obj.add(wall(x1,z1,x2,z2,t,h,y,col));


    // WALLS RIGHT //

    // front //
    x1 = ( ((m.width + (m.wingSpill * 2)) * meters) / 2) - pad;
    z1 = ( ((m.depth + (m.wingSpill * 2)) * meters) / 2) - pad;
    x2 = ( ((m.width + (m.wingSpill * 2)) * meters) / 2) - (m.wingWidth * meters) + pad;
    z2 = ( ((m.depth + (m.wingSpill * 2)) * meters) / 2) - pad;
    this.obj.add(wall(x1,z1,x2,z2,t,h,y,col));

    // side //
    x1 = ( ((m.width + (m.wingSpill * 2)) * meters) / 2) - pad;
    z1 = ( ((m.depth + (m.wingSpill * 2)) * meters) / 2) - pad;
    x2 = ( ((m.width + (m.wingSpill * 2)) * meters) / 2) - pad;
    z2 = (-((m.depth + (m.wingSpill * 2)) * meters) / 2) + pad;
    this.obj.add(wall(x1,z1,x2,z2,t,h,y,col));

    // back //
    x1 = ( ((m.width + (m.wingSpill * 2)) * meters) / 2) - (m.wingWidth * meters) + pad;
    z1 = (-((m.depth + (m.wingSpill * 2)) * meters) / 2) + pad;
    x2 = ( ((m.width + (m.wingSpill * 2)) * meters) / 2) - pad;
    z2 = (-((m.depth + (m.wingSpill * 2)) * meters) / 2) + pad;
    this.obj.add(wall(x1,z1,x2,z2,t,h,y,col));


    // ROOF BOX //
    h = 2 * meters;
    var w = 9 * meters;
    var d = 6 * meters;
    col = new THREE.Color( colToHex(color.processRGBA(concreteCols[3],true)) );
    var material = new materialType( {color: col} );
    var geometry = new THREE.BoxGeometry( w, h, d );

    var box = new THREE.Mesh( geometry, material );
    box.castShadow = true;
    box.receiveShadow = true;
    box.position.set(-m.wingWidth * meters,(this.height / 2) + (h / 2),0);
    this.obj.add(box);


    // AIRCON UNITS //
    var x = -m.wingWidth * meters;
    y = this.height / 2;
    var z = (m.depth * meters) / 4;
    this.obj.add( aircon(x,y,z,'up') );
    this.obj.add( aircon(x - (5 * meters),y,z,'up') );
    this.obj.add( aircon(x + (5 * meters),y,z,'up') );
};



// BUILDING ENTRANCE //
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


    // door roof //
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


    // door sides //
    w = (m.entranceWidth - 6) * meters;
    h = (m.floorHeight + m.base) * meters;
    x = ((m.entranceWidth * meters) / 2) - (0.75 * meters);
    y = h / 2;
    z = 0.001;

    geometry = new THREE.BoxGeometry( 2* meters, h, 4 * meters );

    // L //
    p = new THREE.Mesh( geometry, material );
    p.castShadow = true;
    p.receiveShadow = true;
    ent.add( p );
    p.position.set(-x,y,1.5 * meters);

    // R //
    p = new THREE.Mesh( geometry, material );
    p.castShadow = true;
    p.receiveShadow = true;
    ent.add( p );
    p.position.set(x,y,1.5 * meters);


    // door itself //
    var col = new THREE.Color( colToHex(color.processRGBA(headerCols[3],true)) );
    material = new materialType( {color: col} );
    geometry = new THREE.PlaneGeometry( w, h );


    p = new THREE.Mesh( geometry, material );
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



// ROOF ANTENNAE //
proto.antennae = function(bh) {

    var m = this.dimensions;

    // thickness //
    var t = m.antenna * meters;
    var t2,blh, b, material;


    // spread range //
    var r = 1;

    // clusters //
    var n = 3;
    for (var j=0; j<n; j++) {
        var x = tombola.rangeFloat(-10,25);
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


// ELEVATOR COLUMN //
proto.elevator = function(m) {

    var w = 8 * meters;
    var h = this.height + (4 * meters);
    var d = 8 * meters;
    var x = 0;
    var y = -(this.height / 2); // base
    var z = -((m.depth * meters) / 2); // back

    var el = new THREE.Object3D();
    el.position.set(x,y,z);

    // MAIN COLUMN //
    var col = new THREE.Color( colToHex(color.processRGBA(headerCols[5],true)) );
    var material = new materialType( {color: col} );
    var geometry = new THREE.BoxGeometry( w,h,d );

    var spawner = new Spawner(w,h,d, new THREE.Mesh( geometry, material ));
    spawner.shadow(true, true);
    spawner.position(0,0,0);
    spawner.align('bottom');
    spawner.align('front');
    spawner.spawn( el );


    // TOP LIGHTS //
    x = (w / 2);
    y = h - (1 * meters);
    z = -d + (1.4 * meters);

    // L //
    el.add( lightPanel(-x,y,z,'left') );

    // R //
    el.add( lightPanel(x,y,z,'right') );



    // DOOR //
    var w2 = 3 * meters;
    var h2 = m.headerHeight * meters;
    var d2 = 5 * meters;
    var x2 = (w / 2) + (w2 / 2);
    var y2 = (m.floorHeight * meters) + (h2 / 2);
    var z2 = -(d / 2);

    // light //
    el.add( lightPanel(x + (w2 / 2),y2,z2 - (d2 / 2),'back') );


    // door roof //
    col = new THREE.Color( colToHex(color.processRGBA(concreteCols[1],true)) );
    material = new materialType( {color: col} );

    geometry = new THREE.BoxGeometry( w2, h2, d2 );
    spawner = new Spawner(w,h,d, new THREE.Mesh( geometry, material ));
    spawner.shadow(true, true);
    spawner.position(x2,y2,z2);
    spawner.spawn( el );

    // door sides //
    var w3 = 0.5 * meters;
    var h3 = (m.floorHeight * meters);
    var d3 = 1 * meters;
    var x3 = (w / 2) + (w3 / 2);

    // L //
    geometry = new THREE.BoxGeometry( w3, h3, d3 );
    spawner = new Spawner(w,h,d, new THREE.Mesh( geometry, material ));
    spawner.shadow(true, true);
    spawner.position(x3,h3/2,z2 - (2 * meters));
    spawner.spawn( el );

    // R //
    geometry = new THREE.BoxGeometry( w3, h3, d3 );
    spawner = new Spawner(w,h,d, new THREE.Mesh( geometry, material ));
    spawner.shadow(true, true);
    spawner.position(x3,h3/2,z2 + (2 * meters));
    spawner.spawn( el );


    this.obj.add( el );
};



// SUBSTATION BOX OUTSIDE //
proto.substation = function(m) {
    var w = 1 * meters;
    var h = 1.6 * meters;
    var d = 2.1 * meters;
    var bw = (m.width + (m.wingSpill * 2)) * meters;
    var x = (-bw / 2) - (w / 2);
    var y = -(this.height / 2);
    var z = ((m.depth * meters) / 2) + (15 * meters);
    var t = m.antenna * meters;
    var ah = 2.5 * meters;

    col3d = new THREE.Color( colToHex(color.processRGBA(headerCols[3],true)) );
    var material = new materialType( {color: col3d} );
    var geometry = new THREE.BoxGeometry( w,h,d );

    var mesh = new THREE.Mesh( geometry, material );
    mesh.position.set(x,y + (h/2),z);
    this.obj.add(mesh);
};



//-------------------------------------------------------------------------------------------
//  REUSABLE ELEMENTS
//-------------------------------------------------------------------------------------------


// WHITE RECTANGULAR LIGHT //
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


// DRAW WALL BETWEEN 2 POINTS //
function wall(x1,z1,x2,z2,t,h,y,col) {
    var w, d, x, z;

    // x axis //
    if (x1===x2) {
        w = t;
        d = z2 - z1;
        x = x1;
        z = z2 - (d/2);
    }

    // z axis //
    else {
        w = x2 - x1;
        d = t;
        x = x2 - (w/2);
        z = z1;
    }

    var material = new materialType( {color: col} );
    var geometry = new THREE.BoxGeometry( w, h, d );

    var wall = new THREE.Mesh( geometry, material );
    wall.castShadow = true;
    wall.receiveShadow = true;
    wall.position.set(x,y,z);
    return wall;
}



// SIDE & FRONT WINDOW //
function window1(x,y,z,orientation,lit) {

    var obj = new THREE.Object3D();
    obj.position.set(x,y,z);

    var w = 1.5 * meters;
    var h = 2 * meters;
    var f = 0.17 * meters;

    var col = new THREE.Color( colToHex(color.processRGBA(headerCols[5],true)) );
    var material = new materialType( {color: col} );
    var geometry = new THREE.PlaneGeometry( w, h );

    // frame //
    var frame = new Spawner(w,h,0, new THREE.Mesh( geometry, material ));
    frame.shadow(false,true);
    frame.align('back',0.001);
    frame.spawn(obj);

    col = new THREE.Color( colToHex(color.processRGBA(tombola.item(windowCols),true)) );
    material = new materialType( {color: col} );
    if (tombola.percent(10)) {
        material = new THREE.MeshBasicMaterial( {color: col} );
    }

    // top glass //
    var th = (h - (f * 3)) * 0.6;
    geometry = new THREE.PlaneGeometry( w - (f * 2), th );
    var top = new Spawner(w,h,0, new THREE.Mesh( geometry, material ));
    top.shadow(false,true);
    top.position(0,(-f) - (th / 2),0);
    top.align('bottom');
    top.align('back',0.002);
    top.spawn(obj);

    // bottom glass //
    var bh = (h - (f * 3)) * 0.4;
    geometry = new THREE.PlaneGeometry( w - (f * 2), bh );
    var bottom = new Spawner(w,h,0, new THREE.Mesh( geometry, material ));
    bottom.shadow(false,true);
    bottom.position(0,(f) + (bh / 2),0);
    bottom.align('top');
    bottom.align('back',0.002);
    bottom.spawn(obj);


    // cap/lintel //
    col = new THREE.Color( colToHex(color.processRGBA(concreteCols[3],true)) );
    material = new materialType( {color: col} );

    var ch = 0.5 * meters;
    geometry = new THREE.BoxGeometry( w, ch, ch );
    var cap = new Spawner(w,h,0, new THREE.Mesh( geometry, material ));
    cap.shadow(true,true);
    cap.position(0,-(ch / 2),(ch / 2));
    cap.align('bottom');
    cap.align('back');
    cap.spawn(obj);



    switch (orientation) {
        case 'left':
            obj.rotation.y = -TAU/4;
            break;
        case 'right':
            obj.rotation.y = TAU/4;
            break;
        case 'back':
            obj.rotation.y = TAU/2;
            break;
        case 'front':
            break;
    }

    return obj;
}


// FLAT / APARTMENT FACE //
function flat(m, x,y,z, orientation) {

    var obj = new THREE.Object3D();
    obj.position.set(x,y,z);

    var w = m.flatWidth * meters;
    var h = m.floorHeight * meters;
    var f = 0.17 * meters;

    // WINDOW FRAMES //
    var w2 = w * 0.4;
    var h2 = h * 0.6;

    var col = new THREE.Color( colToHex(color.processRGBA(headerCols[5],true)) );
    var material = new materialType( {color: col} );
    var geometry = new THREE.PlaneGeometry( w2, h2 );

    // L //
    var frame = new Spawner(w,h,0, new THREE.Mesh( geometry, material ));
    frame.shadow(false,true);
    frame.position(-(w2/2),0,0);
    frame.align('bottom');
    frame.align('back',0.001);
    frame.spawn(obj);

    // R //
    frame = new Spawner(w,h,0, new THREE.Mesh( geometry, material ));
    frame.shadow(false,true);
    frame.position((w2/2),0,0);
    frame.align('bottom');
    frame.align('back',0.001);
    frame.spawn(obj);


    // GLASS //
    var w3 = w2 - (f * 2);
    var h3 = h2 - (f * 2);

    col = new THREE.Color( colToHex(color.processRGBA(tombola.item(windowCols),true)) );
    material = new materialType( {color: col} );
    if (tombola.percent(10)) {
        material = new THREE.MeshBasicMaterial( {color: col} );
    }
    geometry = new THREE.PlaneGeometry( w3, h3 );

    // L //
    var glass = new Spawner(w,h,0, new THREE.Mesh( geometry, material ));
    glass.shadow(false,true);
    glass.position(-(w3/2)-f,0,0);
    glass.align('bottom');
    glass.align('back',0.002);
    glass.spawn(obj);

    // R //
    glass = new Spawner(w,h,0, new THREE.Mesh( geometry, material ));
    glass.shadow(false,true);
    glass.position((w3/2) + f,0,0);
    glass.align('bottom');
    glass.align('back',0.002);
    glass.spawn(obj);


    // DISH //
    if (tombola.percent(30)) {
        var rad = tombola.rangeFloat(0.5,1) * meters;
        var x2 = tombola.rangeFloat(-w/2,w/2);
        var y2 = (m.floorHeight * meters) - (m.headerHeight * meters);
        var z2 = (m.headerSpill * meters) + (0.2 * meters);


        col = new THREE.Color( colToHex(color.processRGBA(tombola.item(dishCols),true)) );
        material = new materialType( {color: col} );
        geometry = new THREE.CylinderGeometry( rad, rad, 0.3 * meters );
        var dish = new THREE.Mesh( geometry, material );
        dish.castShadow = true;
        obj.add(dish);
        dish.position.set(x2,y2,z2);
        dish.rotation.x = -TAU/4;
        dish.rotation.z = tombola.rangeFloat(-0.1,0.1) * TAU;
    }

    // AIR CON //
    if (tombola.percent(10)) {
        y2 = ((m.floorHeight * meters) / 2) - (0.5 * meters);
        obj.add (aircon(w2,y2,0,'front'));
    }


    switch (orientation) {
        case 'left':
            obj.rotation.y = -TAU/4;
            break;
        case 'right':
            obj.rotation.y = TAU/4;
            break;
        case 'back':
            obj.rotation.y = TAU/2;
            break;
        case 'front':
            break;
    }

    return obj;
}


// AIR-CON UNIT //
function aircon(x,y,z, orientation) {

    var w = 1.3 * meters;
    var h = 2 * meters;
    var d = 1 * meters;

    var col = new THREE.Color( colToHex(color.processRGBA(dishCols[1],true)) );
    var material = new materialType( {color: col} );
    var geometry = new THREE.BoxGeometry( w, h, d );
    var ac = new THREE.Mesh( geometry, material );
    ac.castShadow = true;
    ac.position.set(x,y,z + (d/2));

    switch (orientation) {
        case 'left':
            ac.rotation.y = -TAU/4;
            break;
        case 'right':
            ac.rotation.y = TAU/4;
            break;
        case 'back':
            ac.rotation.y = TAU/2;
            break;
        case 'front':
            break;
        case 'up':
            ac.rotation.x = -TAU/4;
            ac.position.set(x,y + (d/2),z);
            break;
    }
    return ac;
}


//-------------------------------------------------------------------------------------------
//  SPAWNER
//-------------------------------------------------------------------------------------------

// experimenting with a positioning helper, not really there yet, but you might see the idea.

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

Spawner.prototype.shadow = function( cast, receive ) {
    this.mesh.castShadow = cast;
    this.mesh.receiveShadow = receive;
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

// not using any of these here, from an older project.

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


