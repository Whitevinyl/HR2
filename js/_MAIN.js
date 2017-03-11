

// INIT //
var canvas = [];
var ctx = [];
var TWEEN;
var fonts;
var stats;

// METRICS //
var halfX = 0;
var halfY = 0;
var fullX = 0;
var fullY = 0;
var units = 0;
var dx = halfX;
var dy = halfY;
var headerType = 0;
var midType = 0;
var dataType = 0;
var bodyType = 0;
var subType = 0;
var device = "desktop";

var TAU = 2 * Math.PI;


// INTERACTION //
var mouseX = 0;
var mouseY = 0;
var touchTakeover = false;
var touch;
var mouseIsDown = false;




// COLORS //
//var bgCols = [new RGBA(5,5,5,1),new RGBA(255,236,88,1),new RGBA(210,210,200,1),new RGBA(230,220,190,1)];

var bgCols = [new RGBA(235,240,224,1),new RGBA(51,44,52,1),new RGBA(240,240,240,1),new RGBA(255,170,175,1),new RGBA(5,5,5,1)];
var concreteCols = [new RGBA(201,201,190,1),new RGBA(180,180,170,1),new RGBA(210,210,200,1),new RGBA(170,170,160,1)];
var brickCols = [new RGBA(206,192,174,1),new RGBA(196,174,164,1),new RGBA(188,159,156,1),new RGBA(168,136,140,1),new RGBA(190,185,180,1)];
var windowCols = [new RGBA(127,99,107,1),new RGBA(185,147,152,1),new RGBA(153,119,134,1)];
var plantCols = [new RGBA(98,173,72,1),new RGBA(244,243,231,1),new RGBA(153,119,134,1)];
var headerCols = [new RGBA(206,192,174,1),new RGBA(214,201,190,1),new RGBA(222,213,198,1),new RGBA(127,99,107,1),new RGBA(213,210,194,1),new RGBA(215,223,214,1)];
var footerCols = [new RGBA(188,159,156,1),new RGBA(222,213,198,1),new RGBA(153,119,134,1),new RGBA(127,99,107,1)];
var baseCols = [new RGBA(153,119,134,1),new RGBA(127,99,107,1),new RGBA(188,159,156,1),new RGBA(185,147,152,1)];
var balconyCols = [new RGBA(127,99,107,1),new RGBA(222,213,198,1),new RGBA(209,229,218,1),new RGBA(233,230,213,1)];
var quadCols = [new RGBA(127,99,107,1),new RGBA(222,213,198,1),new RGBA(214,201,190,1),new RGBA(233,230,213,1)];

var textCol = new RGBA(255,255,255,1);

//color.master = new RGBA(5,5,10,1);
color.master = new RGBA(2,2,-5,1);
//color.master = new RGBA(10,5,-12,1);

//-------------------------------------------------------------------------------------------
//  INITIALISE
//-------------------------------------------------------------------------------------------


function init() {

    // SETUP CANVAS //
    var cnvs = document.getElementById("main");
    var cntx = cnvs.getContext("2d");
    cntx.mozImageSmoothingEnabled = false;
    cntx.imageSmoothingEnabled = false;

    canvas.push(cnvs);
    ctx.push(cntx);


    /*StartAudioContext(Tone.context, '#main').then(function(){
        //started
    });*/

    // SET CANVAS & DRAWING POSITIONS //
    metrics();

    // INITIALISE THINGS //
    setupInteraction(canvas[0]);
    setupStats();
    setup3d();
    //setupAudio();




    // DONE //
    fonts = new Fonts(['Bodoni:n4,o4'],2,function(){
        setupDrawing();
        draw();
    });
    fonts.setup();
}

function setupStats() {
    stats = new Stats();
    stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild( stats.dom );
}


//-------------------------------------------------------------------------------------------
//  MAIN LOOP
//-------------------------------------------------------------------------------------------


function draw() {
    if (stats) {
        stats.begin();
    }

    update();
    drawBG();
    drawScene();

    if (stats) {
        stats.end();
    }

    requestAnimationFrame(draw);
}


//-------------------------------------------------------------------------------------------
//  UPDATE
//-------------------------------------------------------------------------------------------


function update() {
    if (TWEEN) {
        TWEEN.update();
    }

    render3d();
}









