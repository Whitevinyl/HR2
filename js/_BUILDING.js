
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
        floorHeight: 5.5,
        base: 3,
        roof: 1.5,
        wingWidth: 25,
        wingSpill: 4,
        headerDepth: 12,
        headerSpill: 1.3,
        headerHeight: 2.5,
        entranceWidth: 14,
        entranceDepth: 8
    };

    var m = this.dimensions;
    var meters = 0.03;

    var bh = (m.base + m.roof + (m.floorHeight * m.floors)) * meters;

    // BASE //
    /*geometry = new THREE.PlaneGeometry( 2, 2, 1, 1 );
    material = new materialType( {color: col3d} );
    this.terrain = new THREE.Mesh( geometry, material );
    this.terrain.rotation.x = -TAU/4;
     meshUpdate(this.terrain);
    this.obj.add( this.terrain );*/



    // MAIN //
    col3d = new THREE.Color( colToHex(color.processRGBA(headerCols[2],true)) );
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

    col3d = new THREE.Color( colToHex(color.processRGBA(headerCols[5],true)) );
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
    w = m.entranceWidth * meters;
    d = m.entranceDepth * meters;
    geometry = new THREE.BoxGeometry( w, h, d );

    var e = new THREE.Mesh( geometry, material );
    e.castShadow = true;
    e.receiveShadow = true;
    this.obj.add( e );
    e.position.z = ((m.depth * meters) / 2) + (d / 2);
    e.position.y = startY;



    h = m.floorHeight * meters;
    var x = ((m.entranceWidth * meters) / 2) - (2 * meters);
    y = -(bh / 2) + (h / 2);
    var z = ((m.depth * meters) / 2) + d - (2 * meters);

    geometry = new THREE.BoxGeometry( meters, h, meters );

    var p = new THREE.Mesh( geometry, material );
    p.castShadow = true;
    p.receiveShadow = true;
    this.obj.add( p );
    p.position.x = - x;
    p.position.z = z;
    p.position.y = y;

    p = new THREE.Mesh( geometry, material );
    p.castShadow = true;
    p.receiveShadow = true;
    this.obj.add( p );
    p.position.x = x;
    p.position.z = z;
    p.position.y = y;


    // ANTENNAE //
    this.antennae(bh,meters);


    // PANEL LIGHTS //
    w = 0.05;
    h = 0.03;
    x = - (((m.entranceWidth * meters) / 2) + 0.001);
    y = -(bh / 2) + (((m.floorHeight + m.base) * meters)) - ((m.headerHeight * meters) / 2);
    z = ((m.depth * meters) / 2) + (d / 2);

    geometry = new THREE.PlaneGeometry( w, h );
    material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
    p = new THREE.Mesh( geometry, material );

    this.obj.add( p );
    p.position.x = x;
    p.position.y = y;
    p.position.z = z;
    p.rotation.y = -TAU/4;

    x = (((m.entranceWidth * meters) / 2) + 0.001);
    p = new THREE.Mesh( geometry, material );

    this.obj.add( p );
    p.position.x = x;
    p.position.y = y;
    p.position.z = z;
    p.rotation.y = TAU/4;

    /*var light = new THREE.PointLight( 0xffffff, 20, 40 * meters );
    scene3d.add( light );
    z = ((m.depth * meters) / 2) + 0.3;
    light.position.set( 0, y + 0.2, z);


    var helper = new THREE.PointLightHelper( light, 0.1 );
    scene3d.add( helper );*/


    /*var rectLight = new THREE.RectAreaLight( 0xffffff, 70,  w * 2, h * 2 );
    rectLight.matrixAutoUpdate = true;
    rectLight.intensity = 150;
    this.obj.add(rectLight);
    rectLight.position.set( 0, y, z+0.1 );*/

    //p.rotation.z = -TAU/4;

};




proto.antennae = function(bh, meters) {

    // thickness //
    var t = 0.008;
    var t2,blh, b, material;



    var r = 1.2;

    // clusters //
    var n = tombola.range(1,3);
    for (var j=0; j<n; j++) {
        var x = tombola.rangeFloat(-25,25);
        var y = tombola.rangeFloat(-8,8);

        // antennae per cluster //
        var n2 = tombola.range(2 + (n===1),4);
        for (var i=0; i<n2; i++) {
            var h = tombola.rangeFloat(0.1,0.9);

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
                t2 = tombola.rangeFloat(0.02,0.03);
                blh = tombola.rangeFloat(0.01,(h/2));
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
                t2 = tombola.rangeFloat(0.02,0.03);
                blh = tombola.rangeFloat(0.01,(h/2));
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
                var rad = tombola.rangeFloat(0.01,0.05);
                blh = tombola.rangeFloat(0.01,(h/2));
                col3d = new THREE.Color( colToHex(color.processRGBA(tombola.item(headerCols),true)) );
                material = new materialType( {color: col3d} );
                geometry = new THREE.CylinderGeometry( rad, rad, 0.02 );
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


