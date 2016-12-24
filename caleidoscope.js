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
    makeInteractions();
    setSymmetries();
    connectNewInputImage();
    getCanvases();
    referenceCanvasAddEventListeners();
    outputCanvasAddEventListeners();
    setupOrientationCanvas(200);
    orientationCanvasAddEventListeners();
    activateDownloadButtons();
    updateOutputDimensions(512, 512);
    updatePeriod(400, 400);
    drawing();
};


// collection of small functions used in different places
//=================================================================

// return a (smaller) integer multiple of four of any number
function makeMultipleOf4(i) {
    i = Math.floor(i);
    return i - i % 4;
}

// accelerated trigonometric functions for the mapping functions:
// tables for the sine and cosine functions
var sinXTab = [];
var sinYTab = [];

// making the tables, depending on the period lengths of the unit cell
// we need a full period to make lookup as simple as possible for higher frequencies
function setupSinTable(sinTab, length) {
    var factor = 2 * Math.PI / length;
    var length4 = length / 4;
    var length2 = length / 2;
    var i;
    var sinus;
    sinTab.length = length;
    sinTab[0] = 0;
    sinTab[length2] = 0;
    for (i = 1; i <= length4; i++) {
        sinus = Math.sin(factor * i);
        sinTab[i] = sinus;
        sinTab[length2 - i] = sinus;
        sinTab[length2 + i] = -sinus;
        sinTab[length - i] = -sinus;
    }
}
// the sin and cos functions, periodic on the unit lattice dimensions,
//  for any integer multiple of the side length of a pixel
//====================================================
//  horizontal
function sinX(i) {
    return sinXTab[i % periodWidth];
}

function cosX(i) {
    return sinXTab[(i + periodWidth4) % periodWidth];
}

// vertical
function sinY(i) {
    return sinYTab[i % periodHeight];
}

function cosY(i) {
    return sinYTab[(i + periodHeight4) % periodHeight];
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
    setupReference();
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

// dimensions of the periodic unit cell
var periodWidth;
var periodHeight;
//  their quarters
var periodWidth4;
var periodHeight4;

// the table for the mapping function 
var mapXTab = [];
var mapYTab = [];
//  with dimensions (part of the periodic unit cell)
var mapWidth;
var mapHeight;

// the choosers
var outputWidthChooser;
var outputHeightChooser;
var periodWidthChooser;
var periodHeightChooser;

// set a new period width and height, limited to output dimensions
// force multiple of 4, fix ratio between width and height for special symmetries
// get output pixels of the periodic unit cell
function updatePeriod(newWidth, newHeight) {
    if ((newWidth != periodWidth) || (newHeight != periodHeight) || (newWidth > outputWidth) || (newHeight > outputHeight)) {
        // fix ratio between width and height for special symmetries
        if (periodWidth != newWidth) { // the width has changed, adjust the height?
            periodWidth = newWidth;
            if (squareSymmetry) {
                periodHeight = newWidth;
            } else if (hexagonSymmetry) {
                periodHeight = 0.5774 * newWidth;
            } else {
                periodHeight = newHeight;
            }
        } else { // the height has changed, adjust the width?
            periodHeight = newHeight;
            if (squareSymmetry) {
                periodWidth = newHeight;
            } else if (hexagonSymmetry) {
                periodWidth = 1.732 * newHeight;
            } else {
                periodWidth = newWidth;
            }
        }
        //limit the periodWidth, keeping width/height ratio
        if (periodWidth > outputWidth) {
            periodHeight = periodHeight * outputWidth / periodWidth;
            periodWidth = outputWidth;
        }
        //limit the periodHeight, keeping width/height ratio
        if (periodHeight > outputHeight) {
            periodWidth = periodWidth * outputHeight / periodHeight;
            periodHeight = outputHeight;
        }
        // make integer multiples of 4
        periodWidth = makeMultipleOf4(periodWidth);
        periodHeight = makeMultipleOf4(periodHeight);
        periodWidthChooser.value = periodWidth.toString();
        periodHeightChooser.value = periodHeight.toString();
        periodWidth4 = periodWidth / 4;
        periodHeight4 = periodHeight / 4;
        setupSinTable(sinXTab, periodWidth);
        setupSinTable(sinYTab, periodHeight);
        setMapDimensions();
        mapXTab.length = mapWidth * mapHeight;
        mapYTab.length = mapWidth * mapHeight;
        setupMapTables();
        // output canvas, get data of unit cell	
        outputData = outputImage.getImageData(0, 0, periodWidth, periodHeight);
        outputPixels = outputData.data;
    }
}
// set a new output width and height, forces it to be a multiple of 4
// makes a blue screen as output image
// does NOT limit the period dimensions (avoid tangle, responsability of callers)
function updateOutputDimensions(newWidth, newHeight) {
    newWidth = makeMultipleOf4(Math.round(newWidth));
    newHeight = makeMultipleOf4(Math.round(newHeight));
    if ((newWidth != outputWidth) || (newHeight != outputHeight)) {
        outputWidthChooser.value = newWidth.toString();
        outputHeightChooser.value = newHeight.toString();
        outputWidth = newWidth;
        outputHeight = newHeight;
        outputCanvas.width = outputWidth;
        outputCanvas.height = outputHeight;
        // make the canvas opaque, blue screen of nothing if there is no input image
        outputImage.fillStyle = "Blue";
        outputImage.fillRect(0, 0, outputWidth, outputHeight);
    }
}

//  the download buttons
//=========================================================================
var imageFilename = 'theImage.jpg';

function activateDownloadButtons() {
    function addDownload(buttonName, downloadname, filename) {
        	var theButton=document.getElementById(buttonName);
        	theButton.addEventListener('click', function () {
            	theButton.href = filename;
            	theButton.download = downloadname;
        }, false);
    }
    var downloadImageButton = document.getElementById('downloadImageButton');
    //  for image downloading, using jpeg image format, default quality=0.92
    downloadImageButton.addEventListener('click', function () {
        //  use correct data format and filename
        downloadImageButton.href = outputCanvas.toDataURL("image/jpeg"); // the data URL is made at the time of the click
        downloadImageButton.download = imageFilename;
    }, false);
 }

var imageInput;

function startLoadImage() {
    imageReader.readAsDataURL(imageInput.files[0]);
}


//  choose output image width and height, limit periods
function setWidth() {
    updateOutputDimensions(parseInt(outputWidthChooser.value,10), outputHeight);
    updatePeriod(periodWidth, periodHeight); // limit the period
    drawing();
}

function setHeight() {
    updateOutputDimensions(outputWidth, parseInt(outputHeightChooser.value,10));
    updatePeriod(periodWidth, periodHeight); // limit the period
    drawing();
}

// choose width and height of periodic unit cell
function setPeriodWidth(data) {
    updatePeriod(parseInt(periodWidthChooser.value,10), periodHeight);
    drawing();
}

function setPeriodHeight(data) {
    updatePeriod(periodWidth, parseInt(periodHeightChooser.value,10));
    drawing();
}
// make up interactions with html elements
function makeInteractions(){
    imageInput = document.getElementById('imageInput')
    imageInput.addEventListener('change',startLoadImage,false);
    outputWidthChooser = document.getElementById('outputWidthChooser');
    outputWidthChooser.addEventListener('change',setWidth,false);
    outputHeightChooser = document.getElementById('outputHeightChooser');
    outputHeightChooser.addEventListener('change',setHeight,false);
    periodWidthChooser = document.getElementById('periodWidthChooser');
    periodWidthChooser.addEventListener('change',setPeriodWidth,false);
    periodHeightChooser = document.getElementById('periodHeightChooser');
    periodHeightChooser.addEventListener('change',setPeriodHeight,false);
    var interpolationChoosers;
    interpolationChoosers=document.getElementsByClassName('interpolation');
    interpolationChoosers[0].addEventListener('click',function(){pixelInterpolation = pixelInterpolationNearest;
                                                                 drawing();},false);
    interpolationChoosers[1].addEventListener('click',function(){pixelInterpolation = pixelInterpolationLinear;
                                                                 drawing();},false);
    interpolationChoosers[2].addEventListener('click',function(){pixelInterpolation = pixelInterpolationCubic;
                                                                 drawing();},false);

}

//  the canvases and their interaction
//============================================================================
var outputCanvas;
var outputImage;
var referenceCanvas;
var referenceImage;
var orientationCanvas;
var orientationImage;

// image and pixel data of output canvas, using only one periodic unit cell
var outputData;
var outputPixels;
// image and pixel data of the reference canvas
var referenceData;
var referencePixels;

function getCanvases() {
    referenceCanvas = document.getElementById("referenceCanvas");
    referenceImage = referenceCanvas.getContext("2d");
    outputCanvas = document.getElementById("outputCanvas");
    outputImage = outputCanvas.getContext("2d");
    orientationCanvas = document.getElementById("orientationCanvas");
    orientationImage = orientationCanvas.getContext("2d");
}

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

// control the offset of the output
var outputOffsetX = 0;
var outputOffsetY = 0;

// and change its size
var changeSize = 1.1;

// limit offset the upper left corner of the first fully visible unit cell
function limitOffset() {
    if (outputOffsetX < 0) {
        outputOffsetX += periodWidth;
    }
    if (outputOffsetX >= periodWidth) {
        outputOffsetX -= periodWidth;
    }
    if (outputOffsetY < 0) {
        outputOffsetY += periodHeight;
    }
    if (outputOffsetY >= periodHeight) {
        outputOffsetY -= periodHeight;
    }
}

function outputMouseDownHandler(event) {
    mouseDownHandler(event, outputCanvas);
    return false;
}

function outputMouseMoveHandler(event) {
    stopEventPropagationAndDefaultAction(event);
    if (mousePressed) {
        setMousePosition(event, outputCanvas);
        outputOffsetX += mouseX - lastMouseX;
        outputOffsetY += mouseY - lastMouseY;
        limitOffset();
        setLastMousePosition();
        // we don't need a full redraw
        putPixelsPeriodicallyOnCanvas();
        // hint for debugging
        showHintPatch();
    }
    return false;
}

function outputMouseWheelHandler(event) {
    stopEventPropagationAndDefaultAction(event);
    var factor = event.deltaY > 0 ? changeSize : 1 / changeSize;
    updateOutputDimensions(factor * outputWidth, factor * outputHeight);
    updatePeriod(factor * periodWidth, factor * periodHeight);
    outputOffsetX *= factor;
    outputOffsetY *= factor;
    scaleOutputToInput /= factor;
    limitOffset();
    drawing();
    return false;
}

// listeners for useCapture, acting in bottom down capturing phase
//  they should return false to stop event propagation ...
function outputCanvasAddEventListeners() {
    outputCanvas.addEventListener("mousedown", outputMouseDownHandler, true);
    outputCanvas.addEventListener("mouseup", mouseUpHandler, true);
    outputCanvas.addEventListener("mousemove", outputMouseMoveHandler, true);
    outputCanvas.addEventListener("mouseout", mouseUpHandler, true);
    outputCanvas.addEventListener("wheel", outputMouseWheelHandler, true);
}

// the reference canvas interactions
//==========================================================================
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

function setupReference() {
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

function referenceCanvasAddEventListeners() {
    referenceCanvas.addEventListener("mousedown", referenceMouseDownHandler, true);
    referenceCanvas.addEventListener("mouseup", mouseUpHandler, true);
    referenceCanvas.addEventListener("mousemove", referenceMouseMoveHandler, true);
    referenceCanvas.addEventListener("mouseout", mouseUpHandler, true);
    referenceCanvas.addEventListener("wheel", referenceMouseWheelHandler, true);
}

// orientation canvas and its interactions
//=========================================================
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

// setup the orientation canvas dimensions and transformation matrix
//  zero is at center und unit is radius (half the size)
function setupOrientationCanvas(size) {
    orientationSize = size;
    orientationCanvas.width = size;
    orientationCanvas.height = size;
    orientationImage.scale(orientationSize / 2 - 1, orientationSize / 2 - 1);
    orientationImage.translate(1, 1);
    setAngle(0);
    drawOrientation();
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

function orientationCanvasAddEventListeners() {
    orientationCanvas.addEventListener("mousedown", orientationMouseDownHandler, true);
    orientationCanvas.addEventListener("mouseup", mouseUpHandler, true);
    orientationCanvas.addEventListener("mousemove", orientationMouseMoveHandler, true);
    orientationCanvas.addEventListener("mouseout", mouseUpHandler, true);
    orientationCanvas.addEventListener("wheel", orientationMouseWheelHandler, true);
}

/*   ppp    iii    x    x   
     p  p    i      x  x
     p  p    i       xx
     ppp     i       xx
     p       i      x  x
     p      iii    x    x
 */  
//  put the pixels of the ImageData object outputData periodically on the output canvas
//  outputData contains exactly one periodic cell
//  the images are offset by outputOffsetX and outputOffsetY
//  note that putImageData has different API than drawImage

function putPixelsPeriodicallyOnCanvas() {
    var copyWidth;
    var copyHeight;
    var targetX;
    var targetY;
    var sourceX;
    var sourceY;
    for (var cornerY = outputOffsetY - periodHeight; cornerY < outputHeight; cornerY += periodHeight) {
        if (cornerY < 0) {
            sourceY = -cornerY;
            targetY = cornerY; // strange, actually difference between source corner and intended
            copyHeight = outputOffsetY;
        } else {
            sourceY = 0;
            targetY = cornerY;
            copyHeight = Math.min(outputHeight - cornerY, periodHeight);
        }
        for (var cornerX = outputOffsetX - periodWidth; cornerX < outputWidth; cornerX += periodWidth) {
            if (cornerX < 0) {
                sourceX = -cornerX;
                targetX = cornerX;
                copyWidth = outputOffsetX;
            } else {
                sourceX = 0;
                targetX = cornerX;
                copyWidth = Math.min(outputWidth - cornerX, periodWidth);
            }
            outputImage.putImageData(outputData,
                targetX, targetY, sourceX, sourceY, copyWidth, copyHeight);
        }
    }
}

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

// nearest neighbor
function pixelInterpolationNearest(x, y, inData) {
    // local variables for fast access
    var inPixels = inData.data;
    var inWidth = inData.width;
    var inHeight = inData.height;
    //  catch the case that the point is outside, we use there a solid color
    // with a small safety margin
    if ((x < -1) || (y < -1) || (x > inWidth) || (y > inHeight)) {
        pixelRed = outsideRed;
        pixelGreen = outsideGreen;
        pixelBlue = outsideBlue;
        return;
    }
    //  rounded coordinates
    h = Math.round(x);
    k = Math.round(y);
    var h = Math.max(0, Math.min(inWidth - 1, h));
    var k = Math.max(0, Math.min(inHeight - 1, k));
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
    //  catch the case that the point is outside, we use there a solid color
    // with a small safety margin
    if ((x < -1) || (y < -1) || (x > inWidth) || (y > inHeight)) {
        pixelRed = outsideRed;
        pixelGreen = outsideGreen;
        pixelBlue = outsideBlue;
        return;
    }
    //  coordinates of base pixel
    var h = Math.floor(x);
    var k = Math.floor(y);
    var dx = x - h;
    var dy = y - k;
    var h0, h1, k0, k1;
    var i00, i01, i10, i11;
    var f00, f01, f10, f11;
    if (k < 0) { // out of the bottom
        k0 = 0;
        k1 = 0;
    } else if (k >= inHeight - 1) { // out of top
        k0 = 4 * inWidth * (inHeight - 1);
        k1 = k0;
    } else {
        k0 = 4 * inWidth * k;
        k1 = k0 + 4 * inWidth;
    }
    if (h < 0) { // out left
        h0 = 0;
        h1 = 0;
    } else if (h >= inWidth - 1) { // out right
        h0 = 4 * (inWidth - 1);
        h1 = h0;
    } else {
        h0 = 4 * h;
        h1 = h0 + 4;
    }
    i00 = h0 + k0;
    i01 = h0 + k1;
    i10 = h1 + k0;
    i11 = h1 + k1;
    // now all index points are inside
    // same calculation for all cases
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
    //  catch the case that the point is outside, we use there a solid color
    // with a small safety margin
    if ((x < -1) || (y < -1) || (x > inWidth) || (y > inHeight)) {
        pixelRed = outsideRed;
        pixelGreen = outsideGreen;
        pixelBlue = outsideBlue;
        return;
    }
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
        jm = 0;
        j0 = 0;
        j1 = Math.max(0, j1);
        j2 = Math.max(0, j2);
    } else if (j2 >= inHeight) { // to high
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
        im = 0;
        i0 = 0;
        i1 = Math.max(0, i1);
        i2 = Math.max(0, i2);
    } else if (i2 >= inWidth) { // too high
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

// copy lines of pixels on the output image data object, only the RGB part
// target goes right or left on a horizontal line from (targetI,targetJ) to (targetEndI,targetJ)
// the source pixels may be on horizontal or vertical lines, or on inclined (skewed) lines
//===================================================================================================

// get a simple pixel index from indices (i,j) to pixels in the unit cell, using the width of the unit cell
//  this is the index to the red component of the pixel, green,blue and alpha follow
function index(i, j) {
    return 4 * (Math.round(i) + periodWidth * Math.round(j));
}

//  going from left to right along a horizontal line
//  line starts from (targetI,targetJ) (with integer coordinates) and goes to=(targetEndI,targetJ),
//  where targetEndI>targetI may be float
//  takes pixel from a horizontal or vertical line, starting at (sourceI,sourceJ), 
//  making steps (sourceStepI,sourceStepJ) with components -1,0,1
//===================================================================================

function copyPixels(targetI, targetEndI, targetJ, sourceI, sourceJ, sourceStepI, sourceStepJ) {
    var target = index(targetI, targetJ);
    var targetEnd = index(targetEndI, targetJ);
    var source = index(sourceI, sourceJ);
    var sourceStep = index(sourceStepI, sourceStepJ) - 2; // combined step, with compensation for pixel subcomponents 
    while (target <= targetEnd) { // do complete pixels ...
        outputPixels[target++] = outputPixels[source++];
        outputPixels[target++] = outputPixels[source++];
        outputPixels[target] = outputPixels[source];
        target += 2; // ... skip blu,alpha, go to next pixel at right
        source += sourceStep; // walk through the source
    }
}

// same as copyPixels(), but now targetEndI<targetI, decreasing x-values
// and thus going from the right to the left
function copyPixelsRightToLeft(targetI, targetEndI, targetJ, sourceI, sourceJ, sourceStepI, sourceStepJ) {
    var target = index(targetI, targetJ);
    var targetEnd = index(targetEndI, targetJ);
    var source = index(sourceI, sourceJ);
    var sourceStep = index(sourceStepI, sourceStepJ) - 2; // combined step, with compensation for pixel subcomponents 
    while (target >= targetEnd) { // do complete pixels ...
        outputPixels[target++] = outputPixels[source++];
        outputPixels[target++] = outputPixels[source++];
        outputPixels[target] = outputPixels[source];
        target -= 6; // ... skip red,green, go to next pixel at left
        source += sourceStep; // walk through the source
    }
}

// same as copyPixels(), drawing a horizontal line of pixels
// but now (sourceStepI,sourceStepJ) has to be a unit vector of any direction
// we use interpolation to get the color of the source pixel with float coordinates

function copyPixelSkewed(targetI, targetEndI, targetJ, sourceI, sourceJ, sourceStepI, sourceStepJ) {
    var target = index(targetI, targetJ);
    var targetEnd = index(targetEndI, targetJ);
    while (target <= targetEnd) {
        pixelInterpolationLinear(sourceI, sourceJ, outputData);
        outputPixels[target++]=pixelRed;
        outputPixels[target++]=pixelGreen;
        outputPixels[target]=pixelBlue;
        target += 2;
        sourceI += sourceStepI;
        sourceJ += sourceStepJ;
    }
}

// same as copyPixelsSkewed(), but now targetEndI<targetI, decreasing x-values
// and thus going from the right to the left
function copyPixelSkewedRightToLeft(targetI, targetEndI, targetJ, sourceI, sourceJ, sourceStepI, sourceStepJ) {
    var target = index(targetI, targetJ);
    var targetEnd = index(targetEndI, targetJ); // all pixel components
    while (target >= targetEnd) {
        pixelInterpolationLinear(sourceI, sourceJ, outputData);
        outputPixels[target++]=pixelRed;
        outputPixels[target++]=pixelGreen;
        outputPixels[target]=pixelBlue;
        target -= 6;
        sourceI += sourceStepI;
        sourceJ += sourceStepJ;
    }
}

// and now the special symmetries, that can be done with integer pixel coordinates
// going horizontally or vertically
//==========================================================================
// NOTE THAT THE Y_AXIS GOES FROM TOP TO BOTTOM AND THAT THIS "INVERSES THINGS"
//============================================================================

//  copy a rectangular piece, same orientation, to another place inside the unit cell
//  target rectangle should not overlap the source rectangle

function copyRectangle(targetI, targetJ, sourceI, sourceJ, width, height) {
    var targetEndJ = targetJ + height;
    var targetEndI = targetI + width - 1;
    while (targetJ < targetEndJ) {
        copyPixels(targetI, targetEndI, targetJ, sourceI, sourceJ, 1, 0);
        targetJ++;
        sourceJ++;
    }
}

// copying the two quarters of the left half of the unit cell crosswise to the right
//  as needed for rhombic or hexagonal symmetry
function rhombicCopy() {
    copyRectangle(periodWidth / 2, 0, 0, periodHeight / 2, periodWidth / 2, periodHeight / 2);
    copyRectangle(periodWidth / 2, periodHeight / 2, 0, 0, periodWidth / 2, periodHeight / 2);
}


// mirrorsymmetry at the horizontal axis at periodicHeight/2 
// copies the lower half onto the upper half with variable length (number of pixels)
//  reasonable values are periodicLength or periodicLength/2
function horizontalMirror(length) {
    for (var fromJ = 0; fromJ < periodHeight / 2; fromJ++) {
        copyPixels(0, length - 1, periodHeight - fromJ - 1, 0, fromJ, 1, 0);
    }
}

// mirror symmetry in the unit cell at a vertical axis lying at periodicWidth/2
//  copies the left half onto the right half, with variable length (number of pixels)
//  reasonable values are periodicLength and periodicLength/2
function verticalMirror(length) {
    var periodWidth2 = periodWidth / 2;
    for (var fromJ = 0; fromJ < length; fromJ++) {
        copyPixels(periodWidth2, periodWidth - 1, fromJ, periodWidth2 - 1, fromJ, -1, 0);
    }
}

// quarter turn rotational symmetry around center of unit cell (periodWidth/2,periodHeight/2)
// turns (numericall) lower left quarter 90 degrees clockwise to the upper left quarter, which is overwritten
function quarterTurn() {
    var period2 = Math.min(periodWidth, periodHeight) / 2;
    for (var j = 0; j < period2; j++) {
        copyPixels(0, period2 - 1, j + period2, period2 - 1 - j, 0, 0, 1);
    }
}

// half turn rotational symmetry around center of unit cell (periodWidth/2,periodHeight/2)
// turns left half 180 degrees to the right half, which is overwritten
function halfTurn() {
    var periodWidth2 = periodWidth / 2;
    for (var j = 0; j < periodHeight; j++) {
        copyPixels(periodWidth2, periodWidth - 1, j, periodWidth2 - 1, periodWidth - 1 - j, -1, 0);
    }
}

//  mirrorsymmetry at the upwards going diagonal x=y
//  takes the lower sector (j<i) and overwrites the upper (j>i)
//  reasonable values are length=period/2 typically (length=period ???)
function upDiagonalMirror(length) {
    for (var j = 0; j < length; j++) {
        copyPixels(0, j - 1, j, j, 0, 0, 1);
    }
}

// mirrorsymmetry at the down going diagonal x+y=length-1
// takes the lower sector x+y<length-1 and overwrites x+y>length-1 (x<length,y<length)
// reasonable value length=perioWidth/2
function downDiagonalMirror(length) {
    for (var j = 0; j < length; j++) {
        copyPixels(length - 1 - j, length - 1, j, length - 1 - j, j, 0, -1);
    }
}

// six- and threefold rotational symmetry require "skewed" copies
//=======================================================================================

// sixFold rotational symmetry
// using the image in the triangle with corners (0,0), (periodWidth/3,0) and (periodWidth/6,periodHeight/2)
// to cover the entire unit cell with rotated images (multiples of 60 degrees)

function sixFoldRotational() {
    var j;
    // the upper half triangle at the left border
    for (j = 0; j < periodHeight / 2; j++) {
        copyPixelSkewed(0, 0.3333 * periodWidth * (0.5 - j / periodHeight), periodHeight / 2 + j,
            0.5 * periodWidth * (0.5 - j / periodHeight), 0.5 * (periodHeight / 2 - 1 - j), -0.5, 1.5 * periodHeight / periodWidth);
    }
    // the lower half-triangle at the left border
    for (j = 0; j < periodHeight / 2; j++) {
        copyPixelSkewed(0, 0.3333 * periodWidth * j / periodHeight, j,
            0.5 * j * periodWidth / periodHeight, 0.5 * j, 0.5, -1.5 * periodHeight / periodWidth);
    }
    // the right half of the upper equilateral triangle 
    //  
    for (j = 0; j < periodHeight / 2; j++) {
        copyPixelSkewed(0.16666 * periodWidth, 0.3333 * periodWidth * (0.5 + j / periodHeight), periodHeight / 2 + j,
            periodWidth * (0.3333 - 0.5 * j / periodHeight), 0.5 * j, 0.5, 1.5 * periodHeight / periodWidth);
    }
    // the left half of the upper equilateral triangle 
    //  
    for (j = 0; j < periodHeight / 2; j++) {
        copyPixelSkewedRightToLeft(0.16666 * periodWidth, 0.3333 * periodWidth * (0.5 - j / periodHeight), periodHeight / 2 + j,
            periodWidth * (0.3333 - 0.5 * j / periodHeight), 0.5 * j, -0.5, -1.5 * periodHeight / periodWidth);
    }
    // local inversion symmetry at (periodWidth/4,periodHeight/4), left to right
    for (j = 0; j < periodHeight / 2; j++) {
        copyPixelsRightToLeft(periodWidth / 2 - 1, 0.3333 * periodWidth * (1 - j / periodHeight), j,
            0, periodHeight / 2 - 1 - j, 1, 0);
    }
    // local inversion symmetry at (periodWidth/4,periodHeight*3/4), left to right
    for (j = 0; j < periodHeight / 2; j++) {
        copyPixelsRightToLeft(periodWidth / 2 - 1, 0.3333 * periodWidth * (0.5 + j / periodHeight), periodHeight / 2 + j,
            0, periodHeight - 1 - j, 1, 0);
    }
    rhombicCopy();
}

// threeFold rotational symmetry
// using the image in the rhomb with corners (periodWidth/2,periodHeight/2), (periodWidth/3,periodHeight-1),
//   (periodWidth/6,periodHeight/2) and (periodWidth/3,0)
// covers the entire unit cell with rotated copies (multiples of 120 degrees)

function threeFoldRotational() {
    var j;
    //lower left trapeze
    for (j = 0; j < periodHeight / 2; j++) {
        copyPixelSkewed(0, 0.3333 * periodWidth * (1 - j / periodHeight), j,
            0.5 * periodWidth - 0.5 * j / periodHeight * periodWidth, 0.5 * periodHeight - 0.5 * j, -0.5, 1.5 * periodHeight / periodWidth);
    }
    // upper left trapeze
    for (j = 0; j < periodHeight / 2; j++) {
        copyPixelSkewed(0, 0.3333 * periodWidth * (0.5 + j / periodHeight), periodHeight / 2 + j,
            0.25 * periodWidth + 0.5 * j / periodHeight * periodWidth, 0.75 * periodHeight - 0.5 * j, -0.5, -1.5 * periodHeight / periodWidth);
    }
    // lower right triangle
    for (j = 0; j < periodHeight / 2; j++) {
        copyPixelSkewedRightToLeft(periodWidth / 2 - 1, 0.3333 * periodWidth * (1 + j / periodHeight), j,
            0.5 * periodWidth * (0.5 + j / periodHeight), 0.75 * periodHeight - 0.5 * j, 0.5, 1.5 * periodHeight / periodWidth);

    }
    // upper right triangle
    for (j = 0; j < periodHeight / 2; j++) {
        copyPixelSkewedRightToLeft(periodWidth / 2 - 1, periodWidth / 2 - 1 - 0.3333 * j * periodWidth / periodHeight, periodHeight / 2 + j,
            0.5 * periodWidth - 0.5 * j / periodHeight * periodWidth, 0.5 * periodHeight - 0.5 * j, 0.5, -1.5 * periodHeight / periodWidth);

    }
    rhombicCopy();
}

// making the symmetric image, using the general method of F. Farris
// a mapping table defines the map between output image coordinates and sampled input image pixels
// together with an interactively defined additional translation, rotation and scaling
//================================================================================================

// drawing a line of pixels on the output image using sampled input image pixels
//================================================================================
// the line starts at (fromI,j) and goes upwards to (toI,j)  (all INTEGERS)
// addressing pixels in the periodic unit cell AND points in the (mapXTab[...],mapYTab[...])

function drawPixelLine(fromI, toI, j) {
    //  reference image, local variables
    var locReferencePixels = referencePixels;
    var locReferenceWidth = referenceWidth;
    var locReferenceHeight = referenceHeight;
    var locScaleInputToReference = scaleInputToReference;
    // local reference to the mapping table
    var locMapXTab = mapXTab;
    var locMapYTab = mapYTab;
    // translation: center of sampling as defined by the mouse on the reference image
    var centerX = referenceCenterX / scaleInputToReference;
    var centerY = referenceCenterY / scaleInputToReference;
    //  scaling and rotation: transformation matrix elements
    var scaleCos = scaleOutputToInput * cosAngle;
    var scaleSin = scaleOutputToInput * sinAngle;
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
        // translation, rotation and scaling
        newX = scaleCos * x - scaleSin * y + centerX;
        y = scaleSin * x + scaleCos * y + centerY;
        x = newX;
        //  get the interpolated input pixel color components, write on output pixels
        pixelInterpolation(x, y, inputData);
        outputPixels[outputIndex++]=pixelRed;
        outputPixels[outputIndex++]=pixelGreen;
        outputPixels[outputIndex]=pixelBlue;
        outputIndex += 2;
        // mark the reference image pixel, make it fully opaque
        h = Math.round(locScaleInputToReference * x);
        k = Math.round(locScaleInputToReference * y);
        // but check if we are on the reference canvas
        if ((h >= 0) && (h < locReferenceWidth) && (k >= 0) && (k < locReferenceHeight)) {
            locReferencePixels[4 * (locReferenceWidth * k + h) + 3] = 255;
        }
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
	makeSymmetriesFarris();
	// put the symmetric image on the output canvas
	putPixelsPeriodicallyOnCanvas();
	// put the reference image
	putPixelsOnReferenceCanvas();
	// hint for debugging
	showHintPatch();
}

// symmetry dependent
//=============================================================================
// setting symmetry dependent map dimensions as function of period dimensions
// =====================================================================
function setMapDimensions() {
    mapWidth = periodWidth / 2;
    mapHeight = periodHeight / 2;
    mapWidth = periodWidth;
    mapHeight = periodHeight;
}

//for debugging: show the basic map on output as red lines
//================================================================
function showHintPatch() {
    if (hintPatch && inputLoaded) {
        outputImage.strokeStyle = "Red";
        outputImage.strokeRect(outputOffsetX, outputOffsetY, mapWidth, mapHeight);
    }
}

//  trivial map for simple maping
// ========================================================================
function trivialMapTables() {
    var locmapWidth = mapWidth;
    var locmapHeight = mapHeight;
    var locmapWidth2 = mapWidth / 2;
    var locmapHeight2 = mapHeight / 2;
    var index = 0;
    var i, j;
    for (j = 0; j < locmapHeight; j++) {
        for (i = 0; i < locmapWidth; i++) {
            mapXTab[index] = i - locmapWidth2;
            mapYTab[index++] = j - locmapHeight2;
        }
    }
}

function setupMapTables() {
    trivialMapTables();
}

// initial mapping scale
scaleOutputToInput = 1

// the replacement color for outside pixels
var outsideRed = 0;
var outsideGreen = 0;
var outsideBlue = 200;

// presetting special symmetries, fixing the height to width ratio of the unit cell
function setSymmetries() {
    squareSymmetry = false;
    hexagonSymmetry = true;
}

// draw the unit cell on output image
// the shape of the basic map and symmetries in unit cell depend on symmetry of the image
//=================================================================================
function makeSymmetriesFarris() {
    // draw the basic map, using the mapping in the map tables 
    for (var j = 0; j < mapHeight; j++) {
        drawPixelLine(0, mapWidth - 1, j);
    }
    // the symmetries inside the unit cell
    //verticalMirror(periodHeight/2);
    //horizontalMirror(periodWidth);
    //threeFoldRotational();
    sixFoldRotational();

}