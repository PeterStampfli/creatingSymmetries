"use strict";

//=================================================================================================
// fast approximations of functions
//=====================================================================================
// returns a table of values of theFunction(x)
// length is the number of values or length of the table
// start is the starting value for x
// delta is the distance between data points
function makeFunctionTable(length,start,delta,theFunction){
    var table=new Array(length);
    for (var i = 0;i<length;i++){
        table[i]=theFunction(start+i*delta);
    }
    return table;
}
//  the sine and cosine function
//-------------------------------------------------------------------------------------------
var PIHALF=Math.PI*0.5;

var sinTab=[];
var sinTabLengthM1=0;
var sinTabFactor=1;
var sinTabHigherCorrection=0;

// set up the table, its length is a power of 2
function setupSinCosTable(p) {
    var sinTabLength=Math.round(Math.pow(2,p));
    sinTabLengthM1=sinTabLength-1;
    sinTabFactor = 0.5*sinTabLength/Math.PI;
    sinTabHigherCorrection=0.25/sinTabFactor/sinTabFactor;
    sinTab=makeFunctionTable(sinTabLength+1,0,1.0/sinTabFactor,Math.sin);
}

setupSinCosTable(12);

//  using linear interpolation
function fSin(x){
    x*=sinTabFactor;
    var index=Math.floor(x);
    x-=index;
    index=index&sinTabLengthM1;
    return sinTab[index]*(1-x)+sinTab[index+1]*x;
}

//  using linear interpolation
function fCos(x){
    x=sinTabFactor*(x+PIHALF);
    var index=Math.floor(x);
    var dx=x-index;
    index=index&sinTabLengthM1;
    return sinTab[index]*(1-dx)+sinTab[index+1]*dx;
}

//  the exponential function
//-----------------------------------------------------------------------

//  possible range of argument (integer part)
var expMaxArgument=Math.floor(Math.log(Number.MAX_VALUE))+1;
var expMinArgument=Math.floor(Math.log(Number.MIN_VALUE));

// tables for integer and fractional part
var expTabIntPart=[];
var expTabIntPartMaxIndex=0;
var expTabFractPart=[];
var expTabFactor=0;
var expTabHigherCorrection=0;

function setupExpTables(n){
    expTabIntPartMaxIndex=expMaxArgument-expMinArgument;
    expTabIntPart=makeFunctionTable(expTabIntPartMaxIndex+1,expMinArgument,1,Math.exp);
    expTabFactor=n;
    expTabHigherCorrection=0.25/expTabFactor/expTabFactor;
    expTabFractPart=makeFunctionTable(n+1,0,1.0/expTabFactor,Math.exp);
}

setupExpTables(1000);

function fExp(x){
    var indexToIntPart=Math.floor(x);
    var dx=expTabFactor*(x-indexToIntPart);
    var indexToFractPart=Math.floor(dx);
    dx-=indexToFractPart;
    return expTabIntPart[Math.max(0,Math.min(expTabIntPartMaxIndex,indexToIntPart-expMinArgument))]*
           (expTabFractPart[indexToFractPart]*(1-dx)+expTabFractPart[indexToFractPart+1]*dx);
}

/*
  u   u    sss     eeee   rrrr        iii     aaa
  u   u   s   s    e      r   r        i     a   a
  u   u   s        e      r   r        i     a   a
  u   u    sss     eee    rrrr         i     aaaaa
  u   u       s    e      r  r         i     a   a
  u   u       s    e      r   r        i     a   a
   uuu    ssss     eeee   r   r       iii    a   a
*/
// User interaction
//======================

//  the startup function
//==============================================================================

var initialOutputSize=512;

window.onload = function () {
    connectNewInputImage();
    setupReferenceCanvas();
    setupOutputCanvas();
    setupOrientationCanvas(200);
    makeInteractions();
    initialOutputDimensions(initialOutputSize, initialOutputSize);
    drawing();
};

//  choose and load the input image file
//=================================================
var inputLoaded = false;
var inputWidth;
var inputHeight;
var inputImage;

// get pixel data of input image
var inputData;
var inputPixels;

// first load the image data file in a file reader
var imageReader = new FileReader();

// connect the inputImage to the file reader and to subsequent processing
function connectNewInputImage() {
    inputImage = new Image();
    // load the new image from the file reader data
    imageReader.onload = function (imageReaderResult) {
        inputImage.src = imageReader.result;
    };
    // then use the image
    inputImage.onload = useNewInputImage;
}

// read the input image with an offscreen canvas
//  the offscreen canvas is local and will be disposed after quitting this function
function useNewInputImage() {
    var offScreenCanvas;
    var offScreenCanvasImage;
    // data of the loaded image
    inputLoaded = true;
    inputWidth = inputImage.width;
    inputHeight = inputImage.height;
    // we use an off-screen canvas to get the data of the input image
    offScreenCanvas = document.createElement("canvas");
    offScreenCanvas.width = inputWidth;
    offScreenCanvas.height = inputHeight;
    offScreenCanvasImage = offScreenCanvas.getContext("2d");
    offScreenCanvasImage.drawImage(inputImage, 0, 0);
    // set the dimensions of the reference canvas and draw image on it
    adjustReference();
    // reference image: draw the entire input image and get the pixels
    referenceImage.drawImage(inputImage, 0, 0, inputWidth, inputHeight,
        0, 0, referenceWidth, referenceHeight);
    // free image for garbage collection
    connectNewInputImage();
    referenceData = referenceImage.getImageData(0, 0, referenceWidth, referenceHeight);
    referencePixels = referenceData.data;
    inputData = offScreenCanvasImage.getImageData(0, 0, inputWidth, inputHeight);
    inputPixels = inputData.data;
    drawing();
}

// choosing output image sizes
//=============================
var outputCanvas;
var outputImage;

// image and pixel data of output canvas
var outputData;
var outputPixels;

// size for generated image
var outputWidth;
var outputHeight;

// the choosers
var outputWidthChooser;
var outputHeightChooser;

// the table for the mapping function (same size as output canvas)
var mapX = [];
var mapY = [];
//  with dimensions (part of the periodic unit cell)
var mapWidth=0;
var mapHeight=0;

var mapScale=0;
var mapOffsetI=0;
var mapOffsetJ=0;

// set a new output width and height, forces it to be a multiple of 4
// makes a blue screen as output image
// does NOT limit the period dimensions (avoid tangle, responsability of callers)
function setOutputDimensions(newWidth,newHeight){
    outputWidthChooser.value = newWidth.toString();
    outputHeightChooser.value = newHeight.toString();
    outputWidth = newWidth;
    outputHeight = newHeight;
    outputCanvas.width = outputWidth;
    outputCanvas.height = outputHeight;
    // make the canvas opaque, blue screen of nothing if there is no input image
    outputImage.fillStyle = "Blue";
    outputImage.fillRect(0, 0, outputWidth, outputHeight);
    // output canvas, get data of unit cell 
    outputData = outputImage.getImageData(0, 0, outputWidth, outputHeight);
    outputPixels = outputData.data;
}

// set map dimensions and update the table values
function updateMapDimensions(){
    mapWidth = outputWidth;
    mapHeight = outputHeight;
    mapX.length = mapWidth * mapHeight;
    mapY.length = mapWidth * mapHeight;
    makeMapTables();
}

// for initialization: sets initial map properties
//  before transformation, coordinates have values
// (x,y)=(0,0) at center and x=+/-2 at right and left border
//  y=+/-2 at top and bottom border for square image
function initialOutputDimensions(width,height){
    setOutputDimensions(width,height);
    mapOffsetI=width/2;
    mapOffsetJ=height/2;
    mapScale=4.0/Math.sqrt(width*width+height*height);
    updateMapDimensions();
}

//  changing the size of the image: update the map properties to get the same image at higher resolution
function updateOutputDimensions(newWidth,newHeight) {
    newWidth = Math.round(newWidth);
    newHeight = Math.round(newHeight);
    if ((newWidth != outputWidth) || (newHeight != outputHeight)) {
        var oldWidth=outputWidth;
        var oldHeight=outputHeight;
        setOutputDimensions(newWidth,newHeight);
        mapOffsetI*=outputWidth/oldWidth;
        mapOffsetJ*=outputHeight/oldHeight;
        mapScale*=Math.sqrt((oldWidth*oldWidth+oldHeight*oldHeight)/
                            (outputWidth*outputWidth+outputHeight*outputHeight));
        updateMapDimensions();
    }
}

// make up interactions with html elements: adds event listeners
function makeInteractions(){
    var imageInputButton = document.getElementById('imageInput')
    imageInputButton.addEventListener('change',function(){
            imageReader.readAsDataURL(imageInputButton.files[0]);
        },false);
    // we need the choosers to write back the corrected data
    outputWidthChooser = document.getElementById('outputWidthChooser');
    outputWidthChooser.addEventListener('change',function(){
            updateOutputDimensions(parseInt(outputWidthChooser.value,10),outputHeight);
            drawing();
        },false);
    outputHeightChooser = document.getElementById('outputHeightChooser');
    outputHeightChooser.addEventListener('change',function(){
            updateOutputDimensions(outputWidth, parseInt(outputHeightChooser.value,10));
            drawing();
        },false);
    var interpolationChoosers=document.getElementsByClassName('interpolation');
    interpolationChoosers[0].addEventListener('click',function(){
            pixelInterpolation = pixelInterpolationNearest;
            drawing();
        },false);
    interpolationChoosers[1].addEventListener('click',function(){
            pixelInterpolation = pixelInterpolationLinear;
            drawing();
        },false);
    interpolationChoosers[2].addEventListener('click',function(){
            pixelInterpolation = pixelInterpolationCubic;
            drawing();
        },false);
    /*
    var inversionChoosers=document.getElementsByClassName('inversion');
    inversionChoosers[0].addEventListener('click',function(){
             makePixelColor = sampleInput;
            drawing();
        },false);
    inversionChoosers[1].addEventListener('click',function(){
             makePixelColor = colorInversionMirror;
            drawing();
        },false);
    inversionChoosers[2].addEventListener('click',function(){
             makePixelColor = colorInversionRotation;
            drawing();
        },false);
        */
    var downloadImageButton = document.getElementById('downloadImageButton');
    //  for image downloading, using jpeg image format, default quality=0.92
    downloadImageButton.addEventListener('click', function () {
            //  use correct data format and filename
            downloadImageButton.href = outputCanvas.toDataURL("image/jpeg"); // the data URL is made at the time of the click
            downloadImageButton.download = "theImage.jpg";
        }, false);

}

//  the canvases and their interaction
//============================================================================

// override default mouse actions, especially important for the mouse wheel
function stopEventPropagationAndDefaultAction(event) {
    event.stopPropagation();
    event.preventDefault();
}

// the mouse is only on one canvas at a time
// current mouse data, with respect to the current canvas
var mousePressed = false;
var mouseX;
var mouseY;
var lastMouseX;
var lastMouseY;

//  set the mouse position from current event
function setMousePosition(event, theCanvas) {
    mouseX = event.pageX - theCanvas.offsetLeft;
    mouseY = event.pageY - theCanvas.offsetTop;
}

//  set the last mouse position from current mouse position
function setLastMousePosition() {
    lastMouseX = mouseX;
    lastMouseY = mouseY;
}

// for all canvases: mouse down start interaction and sets last mouse position
function mouseDownHandler(event, theCanvas) {
    stopEventPropagationAndDefaultAction(event);
    mousePressed = true;
    setMousePosition(event, theCanvas);
    setLastMousePosition();
}

// for all canvases: mouse up or mouse out stops mouse interaction
function mouseUpHandler(event) {
    stopEventPropagationAndDefaultAction(event);
    mousePressed = false;
    return false;
}

// the output canvas interactions
//=================================================

var changeSize = 1.1;

function outputMouseWheelHandler(event) {
    stopEventPropagationAndDefaultAction(event);
    var factor = event.deltaY > 0 ? changeSize : 1 / changeSize;
    mapScale *= factor;
    mapOffsetI=mapOffsetI/factor+(1-1.0/factor)*0.5*outputWidth;
    mapOffsetJ=mapOffsetJ/factor+(1-1.0/factor)*0.5*outputHeight;
    makeMapTables();
    drawing();
    return false;
}

function outputMouseDownHandler(event) {
    mouseDownHandler(event, outputCanvas);
    return false;
}

function outputMouseMoveHandler(event) {
    stopEventPropagationAndDefaultAction(event);
    if (mousePressed) {
        setMousePosition(event, outputCanvas);
        mapOffsetI += mouseX - lastMouseX;
        mapOffsetJ += mouseY - lastMouseY;
        setLastMousePosition();
        makeMapTables();
        drawing();
    }
    return false;
}

// listeners for useCapture, acting in bottom down capturing phase
//  they should return false to stop event propagation ...
function setupOutputCanvas() {
    outputCanvas = document.getElementById("outputCanvas");
    outputImage = outputCanvas.getContext("2d");
    outputCanvas.addEventListener("mousedown", outputMouseDownHandler, true);
    outputCanvas.addEventListener("mouseup", mouseUpHandler, true);
    outputCanvas.addEventListener("mousemove", outputMouseMoveHandler, true);
    outputCanvas.addEventListener("mouseout", mouseUpHandler, true);
    outputCanvas.addEventListener("wheel", outputMouseWheelHandler, true);
}

// the reference canvas interactions
//==========================================================================
var referenceCanvas;
var referenceImage;
// image and pixel data of the reference canvas
var referenceData;
var referencePixels;
// maximum size of reference image
var referenceSize = 300;
//  derived dimensions for the reference canvas
var referenceWidth;
var referenceHeight;
//  ratio of input image to reference image
var scaleInputToReference;
//  center for sampling on reference canvas
var referenceCenterX;
var referenceCenterY;

// the wheel changes the scale: map to input image pixels, a larger scale zooms out
var scaleOutputToInput=200;
var changeScaleFactor = 1.1;

function adjustReference() {
    // set up dimensions of the reference image
    // the reference canvas has the same width/height ratio as the input image
    //   the larger dimension is equal to the referenceSize
    if (inputWidth > inputHeight) {
        referenceWidth = referenceSize;
        referenceHeight = Math.round(referenceWidth * inputHeight / inputWidth);
    } else {
        referenceHeight = referenceSize;
        referenceWidth = Math.round(referenceHeight * inputWidth / inputHeight);
    }
    referenceCanvas.width = referenceWidth;
    referenceCanvas.height = referenceHeight;
    // put center of readings to image center
    referenceCenterX = referenceWidth / 2;
    referenceCenterY = referenceHeight / 2;
    // get scale of mapping from input image to the reference image
    scaleInputToReference = referenceWidth / inputWidth;
}

// fade-out all pixels by setting alpha
function setAlphaReferenceImagePixels(alpha) {
    var theEnd = referencePixels.length;
    for (var i = 3; i < theEnd; i += 4) {
        referencePixels[i] = alpha;
    }
}

function referenceMouseDownHandler(event) {
    mouseDownHandler(event, referenceCanvas);
    return false;
}

function referenceMouseMoveHandler(event) {
    stopEventPropagationAndDefaultAction(event);
    if (mousePressed) {
        setMousePosition(event, referenceCanvas);
        referenceCenterX += mouseX - lastMouseX;
        referenceCenterX = Math.max(0, Math.min(referenceCenterX, referenceWidth));
        referenceCenterY += mouseY - lastMouseY;
        referenceCenterY = Math.max(0, Math.min(referenceCenterY, referenceHeight));
        setLastMousePosition();
        drawing();
    }
    return false;
}

//  change the scaling with the mouse wheel
function referenceMouseWheelHandler(event) {
    stopEventPropagationAndDefaultAction(event);
    if (event.deltaY > 0) {
        scaleOutputToInput *= changeScaleFactor;
    } else {
        scaleOutputToInput /= changeScaleFactor;
    }
    drawing();
    return false;
}

function setupReferenceCanvas() {
    referenceCanvas = document.getElementById("referenceCanvas");
    referenceImage = referenceCanvas.getContext("2d");
    referenceCanvas.addEventListener("mousedown", referenceMouseDownHandler, true);
    referenceCanvas.addEventListener("mouseup", mouseUpHandler, true);
    referenceCanvas.addEventListener("mousemove", referenceMouseMoveHandler, true);
    referenceCanvas.addEventListener("mouseout", mouseUpHandler, true);
    referenceCanvas.addEventListener("wheel", referenceMouseWheelHandler, true);
}

// orientation canvas and its interactions
//=========================================================
var orientationCanvas;
var orientationImage;
//  orientation canvas is square and gives the orientation angle of sampling
var orientationSize;
var angle;
var cosAngle;
var sinAngle;

var changeAngle = 0.05;
var mouseAngle = 0;
var lastMouseAngle = 0;

function setAngle(newAngle) {
    angle = newAngle;
    cosAngle = Math.cos(angle);
    sinAngle = Math.sin(angle);
}

// we use transformed coordinates
function drawOrientation() {
    var arrowWidth = 0.2;
    orientationImage.fillStyle = "White";
    orientationImage.beginPath();
    orientationImage.arc(0, 0, 1, 0, 2 * Math.PI, 1);
    orientationImage.fill();
    orientationImage.fillStyle = "Brown";
    orientationImage.beginPath();
    orientationImage.moveTo(cosAngle, sinAngle);
    orientationImage.lineTo(arrowWidth * sinAngle, -arrowWidth * cosAngle);
    orientationImage.lineTo(-arrowWidth * cosAngle, -arrowWidth * sinAngle);
    orientationImage.lineTo(-arrowWidth * sinAngle, arrowWidth * cosAngle);
    orientationImage.fill();
}

function isMouseOnDisc() {
    var radius = orientationSize / 2 - 1;
    return ((mouseX - radius) * (mouseX - radius) + (mouseY - radius) * (mouseY - radius)) < radius * radius;
}

function orientationMouseDownHandler(event) {
    //stopEventPropagationAndDefaultAction(event);
    setMousePosition(event, orientationCanvas);
    if (isMouseOnDisc()) {
        mousePressed = true;
        lastMouseAngle = Math.atan2(mouseY - orientationSize / 2, mouseX - orientationSize / 2);
    }
    return false;
}

function orientationMouseMoveHandler(event) {
    //stopEventPropagationAndDefaultAction(event);
    setMousePosition(event, orientationCanvas);
    if (mousePressed) {
        if (isMouseOnDisc()) {
            mouseAngle = Math.atan2(mouseY - orientationSize / 2, mouseX - orientationSize / 2);
            setAngle(angle + mouseAngle - lastMouseAngle);
            lastMouseAngle = mouseAngle;
            drawOrientation();
            drawing();
        } else { // out of disc
            mousePressed = false;
        }
    }
    return false;
}

function orientationMouseWheelHandler(event) {
    setMousePosition(event, orientationCanvas);
    if (isMouseOnDisc()) {
        stopEventPropagationAndDefaultAction(event);
        if (event.deltaY > 0) {
            setAngle(angle + changeAngle);
        } else {
            setAngle(angle - changeAngle);
        }
        drawOrientation();
        drawing();
    }
    return false;
}

// setup the orientation canvas dimensions and transformation matrix
//  zero is at center und unit is radius (half the size)
function setupOrientationCanvas(size) {
    orientationCanvas = document.getElementById("orientationCanvas");
    orientationImage = orientationCanvas.getContext("2d");
    orientationCanvas.addEventListener("mousedown", orientationMouseDownHandler, true);
    orientationCanvas.addEventListener("mouseup", mouseUpHandler, true);
    orientationCanvas.addEventListener("mousemove", orientationMouseMoveHandler, true);
    orientationCanvas.addEventListener("mouseout", mouseUpHandler, true);
    orientationCanvas.addEventListener("wheel", orientationMouseWheelHandler, true);
    orientationSize = size;
    orientationCanvas.width = size;
    orientationCanvas.height = size;
    orientationImage.scale(orientationSize / 2 - 1, orientationSize / 2 - 1);
    orientationImage.translate(1, 1);
    setAngle(0);
    drawOrientation();
}

/*   ppp    iii    x    x   
     p  p    i      x  x
     p  p    i       xx
     ppp     i       xx
     p       i      x  x
     p      iii    x    x
 */  


/* functions for getting interpolated pixels from an image data object (inData)
 *==============================================================================
 * 
 * inData and outData are ImageData objects
 * where ImageData.data is a byte array of pixel-components, ImageData.width and ImageData.height the length
 * 
 * outIndex is the integer index of the red component of the pixel 
 *          we have to write in outPixels image data
 * 
 * x,y      are the float coordinates of the pixel to read from inPixels image data
 *          if these coordinates lie outside we read the nearest pixel of the border
 *          or we get a pixel of fixed color
 */ 
 
// quality dependent pixel interpolation
var pixelInterpolation = pixelInterpolationNearest;
// the colors of the pixel, for fast manipulation, and for color symmetries
var pixelRed;
var pixelGreen;
var pixelBlue;


// the replacement color for outside pixels
var outsideRed = 128;
var outsideGreen = 128;
var outsideBlue = 128;

// default color for outside
function defaultColor(){
    pixelRed = outsideRed;
    pixelGreen = outsideGreen;
    pixelBlue = outsideBlue;
    return;
}

// nearest neighbor
function pixelInterpolationNearest(x, y, inData) {
    // local variables for fast access
    var inPixels = inData.data;
    var inWidth = inData.width;
    var inHeight = inData.height;
    //  rounded coordinates
    //  catch the case that the point is outside, we use there a solid color
    // with a small safety margin
    var h = Math.round(x);
    var k = Math.round(y);
    if ((h<1)||(h+2>=inWidth)||(k<1)||(k+2>=inHeight)){
        defaultColor();
        return;
    }
    var inIndex = 4 * (inWidth * k + h);
    pixelRed = inPixels[inIndex++]; //red
    pixelGreen = inPixels[inIndex++]; // green
    pixelBlue = inPixels[inIndex]; // blue, no alpha
}

//  linear interpolation
function pixelInterpolationLinear(x, y, inData) {
    // local variables for fast access
    var inPixels = inData.data;
    var inWidth = inData.width;
    var inHeight = inData.height;
    //  coordinates of base pixel
    var h = Math.floor(x);
    var k = Math.floor(y);
     //  catch the case that the point is outside, we use there a solid color
    if ((h<1)||(h+2>=inWidth)||(k<1)||(k+2>=inHeight)){
        defaultColor();
        return;
    }
    var dx = x - h;
    var dy = y - k;
    var i00, i01, i10, i11;
    var f00, f01, f10, f11;
    // the indices to pixel data
    i00 = 4*(h+inWidth*k);
    i01 = i00+4*inWidth;
    i10 = i00+4;
    i11 = i01+4;
    //  the weights
    f00 = (1 - dx) * (1 - dy);
    f01 = (1 - dx) * dy;
    f10 = dx * (1 - dy);
    f11 = dy * dx;
    pixelRed = Math.round(f00 * inPixels[i00++] + f10 * inPixels[i10++] + f01 * inPixels[i01++] + f11 * inPixels[i11++]);
    pixelGreen = Math.round(f00 * inPixels[i00++] + f10 * inPixels[i10++] + f01 * inPixels[i01++] + f11 * inPixels[i11++]);
    pixelBlue = Math.round(f00 * inPixels[i00] + f10 * inPixels[i10] + f01 * inPixels[i01] + f11 * inPixels[i11]);
}

//  the kernel function for cubic interpolation
function mitchellNetrovalli(x) { // Mitchell-Netrovali, B=C=0.333333, 0<x<2
    if (x < 1) {
        return (1.16666 * x - 2) * x * x + 0.888888;
    }
    return ((2 - 0.388888 * x) * x - 3.33333) * x + 1.777777;
}

//  cubic interpolation
function pixelInterpolationCubic(x, y, inData) {
    // local variables for fast access
    var inPixels = inData.data;
    var inWidth = inData.width;
    var inHeight = inData.height;
    //  coordinates of base pixel
    var h = Math.floor(x);
    var k = Math.floor(y);
    if ((h<1)||(h+2>=inWidth)||(k<1)||(k+2>=inHeight)){
        defaultColor();
        return;
    }
    var dx = x - h;
    var dy = y - k;
    // the factorized weight function
    var kernel = mitchellNetrovalli;
    // y (vertical position) dependent values
    var kym = kernel(1 + dy);
    var ky0 = kernel(dy);
    var ky1 = kernel(1 - dy);
    var ky2 = kernel(2 - dy);
    // x (horizontal position) dependent values, sweeping in x-direction
    var kx;
    // combined indices, for different heights at same x-position
    var indexM, index0, index1, index2;
    var inWidth4=inWidth*4;
    // the first column
    index0 = inWidth4 * k +4*(h-1);
    indexM = index0-inWidth4;
    index1 = index0+inWidth4;
    index2 = index1+inWidth4;
    kx = kernel(1 + dx);
    var red = kx * (kym * inPixels[indexM++] + ky0 * inPixels[index0++] + ky1 * inPixels[index1++] + ky2 * inPixels[index2++]);
    var green = kx * (kym * inPixels[indexM++] + ky0 * inPixels[index0++] + ky1 * inPixels[index1++] + ky2 * inPixels[index2++]);
    var blue = kx * (kym * inPixels[indexM] + ky0 * inPixels[index0] + ky1 * inPixels[index1] + ky2 * inPixels[index2]);
    // the second column, just at the left of (x,y), skipping alpha
    indexM +=2;
    index0 +=2;
    index1 +=2;
    index2 +=2;
    kx = kernel(dx);
    red += kx * (kym * inPixels[indexM++] + ky0 * inPixels[index0++] + ky1 * inPixels[index1++] + ky2 * inPixels[index2++]);
    green += kx * (kym * inPixels[indexM++] + ky0 * inPixels[index0++] + ky1 * inPixels[index1++] + ky2 * inPixels[index2++]);
    blue += kx * (kym * inPixels[indexM] + ky0 * inPixels[index0] + ky1 * inPixels[index1] + ky2 * inPixels[index2]);
    //  the third column, just at the right of (x,y)
    indexM +=2;
    index0 +=2;
    index1 +=2;
    index2 +=2;
    kx = kernel(1 - dx);
    red += kx * (kym * inPixels[indexM++] + ky0 * inPixels[index0++] + ky1 * inPixels[index1++] + ky2 * inPixels[index2++]);
    green += kx * (kym * inPixels[indexM++] + ky0 * inPixels[index0++] + ky1 * inPixels[index1++] + ky2 * inPixels[index2++]);
    blue += kx * (kym * inPixels[indexM] + ky0 * inPixels[index0] + ky1 * inPixels[index1] + ky2 * inPixels[index2]);
    // the forth column
    indexM +=2;
    index0 +=2;
    index1 +=2;
    index2 +=2;
    kx = kernel(2 - dx);
    red += kx * (kym * inPixels[indexM++] + ky0 * inPixels[index0++] + ky1 * inPixels[index1++] + ky2 * inPixels[index2++]);
    green += kx * (kym * inPixels[indexM++] + ky0 * inPixels[index0++] + ky1 * inPixels[index1++] + ky2 * inPixels[index2++]);
    blue += kx * (kym * inPixels[indexM] + ky0 * inPixels[index0] + ky1 * inPixels[index1] + ky2 * inPixels[index2]);
    // beware of negative values
    pixelRed = Math.max(0, Math.round(red));
    pixelGreen = Math.max(0, Math.round(green));
    pixelBlue = Math.max(0, Math.round(blue));
}


//    I     m     m     aaa        ggg      eeeee
//    I     mm   mm    a   a      g         e
//    I     m m m m    aaaaa      g gg      eeeee
//    I     m  m  m    a   a      g  g      e
//    I     m     m    a   a       ggg      eeeee

//  create the distorted symmetric image
//==========================================================

// I am using purely procedural programming. Object oriented programming would be nicer, but
// object creation and garbage collection would take up time and slow down the program.
// Tell me, if you can speed up things, EMail: pestampf@gmail.com!

// For each pixel (i,j) of the output image we define a point (x,y) in space by
// applying an offset and a scaling to i and j .
// The offset and the scaling are changed by dragging the mouse on the ouput image 
// and by turning the mouse wheel.
// Then a function mapping(x,y) gives image point coordinates (xImage,yImage).
// The coordinates are put in the mapX and mapY arrays.
// The mapping(x,y) defines the symmetries of the image

var xImage=0;
var yImage=0;

function makeMapTables() {
    // local variables and references to speed up access
    var locMapOffsetI=Math.floor(mapOffsetI)+0.5;
    var locMapOffsetJ=Math.floor(mapOffsetJ)+0.5;
    var locMapScale=mapScale;
    var locMapX=mapX;
    var locMapY=mapY;
    //  this mapping function has to be defined depending on the desired image
    var locMapping=mapping;
    // do each pixel and store result of mapping
    var i,j;
    var x=0;
    var y=0;
    var index=0;
    for (j=0;j<mapHeight;j++){
        y=(j-locMapOffsetJ)*locMapScale;
        for (i=0;i<mapWidth;i++){
            x=(i-locMapOffsetI)*locMapScale;
            locMapping(x,y);
            locMapX[index] = xImage;
            locMapY[index++] = yImage;          
        }
    }
}

// The image point coordinates (xImage,yImage) are not directly addresses for the pixels of the input image.

// For each output pixel we look up (xImage,yImage).
// Color inversion symmetry depends on these coordinates. It may change their values.
// Then the coordinates are rotated, scaled and translated. This can be adjusted by dragging the mouse on the 
// two lower control panels and rotating the mouse wheel.
// With the transformed coordinates and pixel interpolation we get a color from the input image.
// For color inversion symmetry this color can be changed.
// Finally, we use the color for the output pixel.

// parameters for the transformation
var inputCenterX;
var inputCenterY;
var inputScaleSin;
var inputScaleCos;

// sample input image at transformed coordinates
// result in pixelRed, pixelGreen, pixelBlue
function sampleInput(x,y){
    // translation, rotation and scaling
    var newX = inputScaleCos * x - inputScaleSin * y + inputCenterX;
    y = inputScaleSin * x + inputScaleCos * y + inputCenterY;
    x = newX;
    //  get the interpolated input pixel color components, write on output pixels
    //
    pixelInterpolation(x, y, inputData);
    // mark the reference image pixel, make it fully opaque
    var h = Math.round(scaleInputToReference * x);
    var k = Math.round(scaleInputToReference * y);
    // but check if we are on the reference canvas
    if ((h >= 0) && (h < referenceWidth) && (k >= 0) && (k < referenceHeight)) {
        referencePixels[4 * (referenceWidth * k + h) + 3] = 255;
    }
}

// default, no color inversion
var makePixelColor=sampleInput;

// color inversion
// simplest type of color change, overwrite if you want something better
function invertPixel(){
    pixelRed=255-pixelRed;
    pixelGreen=255-pixelGreen;
    pixelBlue=255-pixelBlue;    
}

// color inversion with mirroring at the y-axis
function colorInversionMirror(x,y){
    if (x<0){
        sampleInput(x,y);
    }
    else {
        sampleInput(-x,y);
        invertPixel();
    }
}

// color inversion with a rotataion by 180 degrees
function colorInversionRotation(x,y){
    if (x<0){
        sampleInput(x,y);
    }
    else {
        sampleInput(-x,-y);
        invertPixel();
    }
}

function drawing(){
	if (!inputLoaded){	
		return;
	}
	// make the reference image semitransparent
	setAlphaReferenceImagePixels(128);
	// make the symmetries on the output image
    // setting up the parameters for the transformation of the image coordinates
    inputCenterX = referenceCenterX / scaleInputToReference;
    inputCenterY = referenceCenterY / scaleInputToReference;
    //  scaling and rotation: transformation matrix elements
    inputScaleCos = scaleOutputToInput * cosAngle;
    inputScaleSin = scaleOutputToInput * sinAngle;
    // make local references to speed up things
    // local reference to the mapping table
    var locMapX = mapX;
    var locMapY = mapY;
    var locOutputPixels=outputPixels;
    // function for making the color
    var locMakePixelColor=makePixelColor;
    // get the colors for each output pixel
    var outputIndex=0;
    var mapIndex=0;
    var mapSize=mapX.length;
    for (mapIndex=0;mapIndex<mapSize;mapIndex++){
        //sampleInput(locMapX[mapIndex],locMapY[mapIndex]);
        locMakePixelColor(locMapX[mapIndex],locMapY[mapIndex]);
        outputPixels[outputIndex++]=pixelRed;
        outputPixels[outputIndex++]=pixelGreen;
        outputPixels[outputIndex]=pixelBlue;
        outputIndex += 2;
    }
	// put the image on the output canvas
    outputImage.putImageData(outputData,0, 0);
	// put the reference image
    referenceImage.putImageData(referenceData, 0, 0);
}


//===============================================================================
//===============================================================================
//
//   rosette images
//
//=============================================================================
//===============================================================================

// initial mapping scale
//  (x,y) coordinates to pixels
scaleOutputToInput = 200

// the replacement color for outside pixels
outsideRed = 100;
outsideGreen = 100;
outsideBlue = 100;

// color inversion: subtler method

function invertPixel(){
    var pixMaxMin=Math.max(pixelRed,pixelGreen,pixelBlue)+Math.min(pixelRed,pixelGreen,pixelBlue);
    pixelRed=pixMaxMin-pixelRed;
    pixelGreen=pixMaxMin-pixelGreen;
    pixelBlue=pixMaxMin-pixelBlue;    
}



//  make the mapping that defines the symmetry
var logR=0;
var phi=0;

// initialization
function imageZero(x,y){
    logR=0.5*Math.log(y*y+x*x);
    phi=Math.atan2(y,x);
    xImage=0;
    yImage=0;
}

// single parts
function imageAdd(a,b,c,d,rPower,phiPower){
    var rk=fExp(rPower*logR);
    var rkCosPhi=rk*fCos(phiPower*phi);
    var rkSinPhi=rk*fSin(phiPower*phi);
    xImage+=a*rkCosPhi+b*rkSinPhi;
    yImage+=c*rkCosPhi+d*rkSinPhi;
}

function mapping(x,y){
    imageZero(x,y);
    imageAdd(0.7,0,0,0,3,4);
    imageAdd(0.7,0,0,0,-3,4);
   imageAdd(0,0,0.5,0,4,8);
   imageAdd(0,0,0.5,0,-4,8);

}
