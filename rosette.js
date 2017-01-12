"use strict";

//  the startup function
//==============================================================================

//  switching on and off the hint for the patch
var hintPatch = false;

// using special symmetries
var squareSymmetry;
var hexagonSymmetry;

window.onload = function () {
    hintPatch = true;
    connectNewInputImage();
    setupReferenceCanvas();
    setupOutputCanvas();
    setupOrientationCanvas(200);
    makeInteractions();
    updateOutputDimensions(512, 512);
    drawing();
};


// collection of small functions used in different places
//=================================================================

// return a (smaller) integer multiple of four of any number
function makeMultipleOf4(i) {
    i = Math.floor(i);
    return i - i % 4;
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
// User interaction, in sequence of the html code
//====================================================

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

// choosing output image sizes and lengths of the periodic unit cell
//===============================================================

// size for generated image
var outputWidth;
var outputHeight;

// the table for the mapping function 
var mapXTab = [];
var mapYTab = [];
//  with dimensions (part of the periodic unit cell)
var mapWidth;
var mapHeight;

// the choosers
var outputWidthChooser;

// set a new output width and height, forces it to be a multiple of 4
// makes a blue screen as output image
// does NOT limit the period dimensions (avoid tangle, responsability of callers)
function updateOutputDimensions(newWidth) {
    newWidth = makeMultipleOf4(Math.round(newWidth));
    if (newWidth != outputWidth) {
        outputWidthChooser.value = newWidth.toString();
        outputWidth = newWidth;
        outputHeight = newWidth;
        outputCanvas.width = outputWidth;
        outputCanvas.height = outputHeight;
        // make the canvas opaque, blue screen of nothing if there is no input image
        outputImage.fillStyle = "Blue";
        outputImage.fillRect(0, 0, outputWidth, outputHeight);
        mapWidth = outputWidth;
        mapHeight = outputWidth;
        mapXTab.length = mapWidth * mapHeight;
        mapYTab.length = mapWidth * mapHeight;
        rosetteMapTables();
        // output canvas, get data of unit cell 
        outputData = outputImage.getImageData(0, 0, outputWidth, outputWidth);
        outputPixels = outputData.data;
    }
}

// make up interactions with html elements
function makeInteractions(){
    var imageInputButton = document.getElementById('imageInput')
    imageInputButton.addEventListener('change',function(){
            imageReader.readAsDataURL(imageInputButton.files[0]);
        },false);
    // we need the choosers to write back the corrected data
    outputWidthChooser = document.getElementById('outputWidthChooser');
    outputWidthChooser.addEventListener('change',function(){
            updateOutputDimensions(parseInt(outputWidthChooser.value,10));
            updatePeriod(); // limit the period
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
var outputCanvas;
var outputImage;

// image and pixel data of output canvas, using only one periodic unit cell
var outputData;
var outputPixels;

// control the offset of the output
var outputOffsetX = 0;
var outputOffsetY = 0;

// and change its size
var changeSize = 1.1;

function outputMouseWheelHandler(event) {
    stopEventPropagationAndDefaultAction(event);
    var factor = event.deltaY > 0 ? changeSize : 1 / changeSize;
    updateOutputDimensions(factor * outputWidth, factor * outputHeight);
    outputOffsetX *= factor;
    outputOffsetY *= factor;
   // scaleOutputToInput /= factor;
    drawing();
    return false;
}

// listeners for useCapture, acting in bottom down capturing phase
//  they should return false to stop event propagation ...
function setupOutputCanvas() {
    outputCanvas = document.getElementById("outputCanvas");
    outputImage = outputCanvas.getContext("2d");
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
var scaleOutputToInput;
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

// put pixels on reference canvas
function putPixelsOnReferenceCanvas() {
    referenceImage.putImageData(referenceData, 0, 0);
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
    if ((h<0)||(h>=inWidth)||(k<0)||(k>=inHeight)){
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
    if ((h<0)||(h+1>=inWidth)||(k<0)||(k+1>=inHeight)){
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
    var dx = x - h;
    var dy = y - k;
    //  the various vertical positions, getting the correct row numbers of pixels
    var j0 = k;
    var jm = j0 - 1;
    var j1 = j0 + 1;
    var j2 = j0 + 2;
    // too low
    if (jm < 0) {
        if (k<-1){
            defaultColor();
            return;
        }
        jm = 0;
        j0 = 0;
        j1 = Math.max(0, j1);
        j2 = Math.max(0, j2);
    } else if (j2 >= inHeight) { // to high
        if (k>=inHeight){
            defaultColor();
            return;
        }
        j2 = inHeight - 1;
        j1 = inHeight - 1;
        j0 = Math.min(j1, inHeight - 1);
        jm = Math.min(j1, inHeight - 1);
    }
    //  transforming pixelrow numbers to indices of the input image data
    jm *= 4 * inWidth;
    j0 *= 4 * inWidth;
    j1 *= 4 * inWidth;
    j2 *= 4 * inWidth;
    // the various horizontal positions (column numbers of pixels)
    var i0 = h;
    var im = i0 - 1;
    var i1 = i0 + 1;
    var i2 = i0 + 2;
    // too low
    if (im < 0) {
        if (h<-1){
            defaultColor();
            return;
        }
        im = 0;
        i0 = 0;
        i1 = Math.max(0, i1);
        i2 = Math.max(0, i2);
    } else if (i2 >= inWidth) { // too high
            if (h>=inWidth){
                defaultColor();
                return;
            }
        i2 = inWidth - 1;
        i1 = inWidth - 1;
        i0 = Math.min(i0, inWidth - 1);
        im = Math.min(im, inWidth - 1);
    }
    //  transforming column numbers to indices to input image data
    im *= 4;
    i0 *= 4;
    i1 *= 4;
    i2 *= 4;
    // combined indices, for different heights at same x-position
    var indexM, index0, index1, index2;
    // the factorized weight function
    var kernel = mitchellNetrovalli;
    // y (vertical position) dependent values
    var kym = kernel(1 + dy);
    var ky0 = kernel(dy);
    var ky1 = kernel(1 - dy);
    var ky2 = kernel(2 - dy);
    // x (horizontal position) dependent values, sweeping in x-direction
    var kx;
    // color summation in parts
    var red, green, blue;
    // the first column
    indexM = jm + im;
    index0 = j0 + im;
    index1 = j1 + im;
    index2 = j2 + im;
    kx = kernel(1 + dx);
    red = kx * (kym * inPixels[indexM++] + ky0 * inPixels[index0++] + ky1 * inPixels[index1++] + ky2 * inPixels[index2++]);
    green = kx * (kym * inPixels[indexM++] + ky0 * inPixels[index0++] + ky1 * inPixels[index1++] + ky2 * inPixels[index2++]);
    blue = kx * (kym * inPixels[indexM] + ky0 * inPixels[index0] + ky1 * inPixels[index1] + ky2 * inPixels[index2]);
    // the second column, just at the left of (x,y)
    indexM = jm + i0;
    index0 = j0 + i0;
    index1 = j1 + i0;
    index2 = j2 + i0;
    kx = kernel(dx);
    red += kx * (kym * inPixels[indexM++] + ky0 * inPixels[index0++] + ky1 * inPixels[index1++] + ky2 * inPixels[index2++]);
    green += kx * (kym * inPixels[indexM++] + ky0 * inPixels[index0++] + ky1 * inPixels[index1++] + ky2 * inPixels[index2++]);
    blue += kx * (kym * inPixels[indexM] + ky0 * inPixels[index0] + ky1 * inPixels[index1] + ky2 * inPixels[index2]);
    //  the third column, just at the right of (x,y)
    indexM = jm + i1;
    index0 = j0 + i1;
    index1 = j1 + i1;
    index2 = j2 + i1;
    kx = kernel(1 - dx);
    red += kx * (kym * inPixels[indexM++] + ky0 * inPixels[index0++] + ky1 * inPixels[index1++] + ky2 * inPixels[index2++]);
    green += kx * (kym * inPixels[indexM++] + ky0 * inPixels[index0++] + ky1 * inPixels[index1++] + ky2 * inPixels[index2++]);
    blue += kx * (kym * inPixels[indexM] + ky0 * inPixels[index0] + ky1 * inPixels[index1] + ky2 * inPixels[index2]);
    // the forth column
    indexM = jm + i2;
    index0 = j0 + i2;
    index1 = j1 + i2;
    index2 = j2 + i2;
    kx = kernel(2 - dx);
    red += kx * (kym * inPixels[indexM++] + ky0 * inPixels[index0++] + ky1 * inPixels[index1++] + ky2 * inPixels[index2++]);
    green += kx * (kym * inPixels[indexM++] + ky0 * inPixels[index0++] + ky1 * inPixels[index1++] + ky2 * inPixels[index2++]);
    blue += kx * (kym * inPixels[indexM] + ky0 * inPixels[index0] + ky1 * inPixels[index1] + ky2 * inPixels[index2]);
    // beware of negative values
    pixelRed = Math.max(0, Math.round(red));
    pixelGreen = Math.max(0, Math.round(green));
    pixelBlue = Math.max(0, Math.round(blue));
}


// get a simple pixel index from indices (i,j) to pixels in the unit cell, using the width of the unit cell
//  this is the index to the red component of the pixel, green,blue and alpha follow
function index(i, j) {
    return 4 * (Math.round(i) + outputWidth * Math.round(j));
}

// making the symmetric image, using the general method of F. Farris
// a mapping table defines the map between output image coordinates and sampled input image pixels
// together with an interactively defined additional translation, rotation and scaling
//================================================================================================

// drawing a line of pixels on the output image using sampled input image pixels
//================================================================================
// the line starts at (fromI,j) and goes upwards to (toI,j)  (all INTEGERS)
// addressing pixels in the periodic unit cell AND points in the (mapXTab[...],mapYTab[...])

// sampling transformation
var centerX;
var centerY;
var scaleSin;
var scaleCos;

// sample input image at transformed coordinates
// result in pixelRed, pixelGreen, pixelBlue
function sampleInput(x,y){
    // translation, rotation and scaling
    var newX = scaleCos * x - scaleSin * y + centerX;
    y = scaleSin * x + scaleCos * y + centerY;
    x = newX;
    //  get the interpolated input pixel color components, write on output pixels
    pixelInterpolation(x, y, inputData);
    // mark the reference image pixel, make it fully opaque
    var h = Math.round(scaleInputToReference * x);
    var k = Math.round(scaleInputToReference * y);
    // but check if we are on the reference canvas
    if ((h >= 0) && (h < referenceWidth) && (k >= 0) && (k < referenceHeight)) {
        referencePixels[4 * (referenceWidth * k + h) + 3] = 255;
    }
}


function drawPixelLine(fromI, toI, j) {
    // local reference to the mapping table
    var locMapXTab = mapXTab;
    var locMapYTab = mapYTab;
    //  sampling coordinates (input image)
    var x, y, newX;
    //  integer coordinates in the reference image
    var h, k;
    //  index to the output image pixel, start
    var outputIndex = index(fromI, j);
    //  the end value
    var outputEnd = index(toI, j);
    //  index to the mapping function table
    var mapIndex = fromI + mapWidth * j;
    while (outputIndex <= outputEnd) {
        // some mapping from (i,j) to (x,y) stored in a map table !!!
        x = locMapXTab[mapIndex];
        y = locMapYTab[mapIndex];
        mapIndex++;
        //  color symmetry
        makePixelColor(x,y);
        //
        outputPixels[outputIndex++]=pixelRed;
        outputPixels[outputIndex++]=pixelGreen;
        outputPixels[outputIndex]=pixelBlue;
        outputIndex += 2;
    }
}

//  make the symmetries, draw the full output image and reference image
//==========================================================
function drawing(){
	if (!inputLoaded){						// no input means nothing to do
		return;
	}
	// white out: make the reference image semitransparent
	setAlphaReferenceImagePixels(128);
	// make the symmetries on the output image
    // translation: center of sampling as defined by the mouse on the reference image
    centerX = referenceCenterX / scaleInputToReference;
    centerY = referenceCenterY / scaleInputToReference;
    //  scaling and rotation: transformation matrix elements
    scaleCos = scaleOutputToInput * cosAngle;
    scaleSin = scaleOutputToInput * sinAngle;
   // draw the basic map, using the mapping in the map tables
    for (var j = 0; j < mapHeight; j++) {
        drawPixelLine(0, mapWidth - 1, j);
    }
	// put the symmetric image on the output canvas
    outputImage.putImageData(outputData,0, 0, 0, 0, outputWidth, outputWidth);
	// put the reference image
	putPixelsOnReferenceCanvas();
}

