"use strict";


// User interaction
//======================



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
// and the color changing : colorSector and colorAmplitude
// colorSector is number for interchanges, 0 changes nothing
// colorAmplitude=0 - outsideColor, colorAmplitude=1 - full image color
var mapColorSector = [];
var mapColorAmplitude = [];

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
    mapColorSector.length = mapWidth * mapHeight;
    mapColorAmplitude.length = mapWidth * mapHeight;
    makeMapTables();
}

// for initialization: sets initial map properties
//  before transformation, coordinates have values
// (x,y)=(0,0) at center and x=+/-2 at right and left border
//  y=+/-2 at top and bottom border for square image
function initialOutputDimensions(width,height){
    setOutputDimensions(width, height);
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
    var inversionChoosers=document.getElementsByClassName('inversion');
    inversionChoosers[0].addEventListener('click',function(){
            nColorMod = 0;
            drawing();
        },false);
    inversionChoosers[1].addEventListener('click',function(){
            nColorMod = 1;
            drawing();
        },false);
    inversionChoosers[2].addEventListener('click',function(){
            nColorMod = 2;
            drawing();
        },false);
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

