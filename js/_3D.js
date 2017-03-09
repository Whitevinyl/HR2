
// Here we build the initial scene using three.js

//-------------------------------------------------------------------------------------------
//  SETUP
//-------------------------------------------------------------------------------------------

var scene3d,camera3d,renderer3d,directional3d,ambient3d,col3d,materialType;
var building;

function setup3d() {

    // setup renderer //
    renderer3d = new THREE.WebGLRenderer({antialias: true});
    renderer3d.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer3d.domElement );


    // setup view //
    scene3d = new THREE.Scene();
    camera3d = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 0.01, 50 );


    // point camera //
    camera3d.position.z = 7.1; // distance
    camera3d.position.y = 2.2; // height
    camera3d.rotation.x = -((TAU/360)*20); // angle


    // create fog & background color //
    col3d = new THREE.Color( colToHex(color.processRGBA(bgCols[2],true)) );
    scene3d.background = col3d;
    scene3d.fog = new THREE.Fog(col3d,6,10);


    // lighting //
    materialType = THREE.MeshBasicMaterial;
    addlighting();

    // create building //
    building = new Building();
}


function addlighting() {
    materialType = THREE.MeshLambertMaterial;

    var balance = 0.95;

    // directional //
    directional3d = new THREE.DirectionalLight( 0xefefff, 1 - balance );
    directional3d.position.set( 1, 2, 2 ).normalize();
    directional3d.castShadow = true;
    scene3d.add( directional3d );

    // ambient //
    ambient3d = new THREE.AmbientLight( 0xffffff, balance );
    scene3d.add( ambient3d );
}

//-------------------------------------------------------------------------------------------
//  UPDATE
//-------------------------------------------------------------------------------------------

function render3d() {
    if (renderer3d) {
        var speed = 0.08;
        scene3d.rotation.y += ((TAU/360) * speed);
        building.update();
        renderer3d.render( scene3d, camera3d );
    }
}


//-------------------------------------------------------------------------------------------
//  DRAW
//-------------------------------------------------------------------------------------------

// draw the webgl rendering to the canvas

function draw3d(ctx) {
    if (renderer3d) {
        ctx.drawImage(renderer3d.domElement,0,0,fullX,fullY);
    }
}