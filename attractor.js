"use strict";


//  the startup function
//==============================================================================

var initialOutputSize=512;
 //initialOutputSize=40;

window.onload = function () {
    setupOutputCanvas();
    makeInteractions();
    setOutputDimensions(initialOutputSize, initialOutputSize);
    
    //iteration=circleIteration;
    iteration=threeIteration;

    drawing();


};



// make up interactions with html elements: adds event listeners
function makeInteractions(){
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
    var downloadImageButton = document.getElementById('downloadImageButton');
    //  for image downloading, using jpeg image format, default quality=0.92
    downloadImageButton.addEventListener('click', function () {
            //  use correct data format and filename
            downloadImageButton.href = outputCanvas.toDataURL("image/jpeg"); // the data URL is made at the time of the click
            downloadImageButton.download = "theImage.jpg";
        }, false);
}



//  the canvas and its interaction
//============================================================================


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

// set a new output width and height
// makes a blue screen as output image, sets up outputPixels

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
    // the new length of the dynamics accumultor
    divergingNumbers.length=newWidth*newHeight;
    attractorNumbers.length=newWidth*newHeight;
}

//  changing the size of the image: 
function updateOutputDimensions(newWidth,newHeight) {
    newWidth = Math.round(newWidth);
    newHeight = Math.round(newHeight);
    if ((newWidth != outputWidth) || (newHeight != outputHeight)) {
        var oldWidth=outputWidth;
        var oldHeight=outputHeight;
        setOutputDimensions(newWidth,newHeight);
     }
}

// interaction with the mouse
//-----------------------------------------------------------------

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


var changeSize = 1.1;

function outputMouseWheelHandler(event) {
    stopEventPropagationAndDefaultAction(event);
    var factor = event.deltaY > 0 ? changeSize : 1 / changeSize;
    var center;
    var size;
    center=0.5*(xMax+xMin);
    size=factor*0.5*(xMax-xMin);
    xMax=center+size;
    xMin=center-size;
    center=0.5*(yMax+yMin);
    size=factor*0.5*(yMax-yMin);
    yMax=center+size;
    yMin=center-size;
    drawing();
    return false;
}

function outputMouseDownHandler(event) {
    mouseDownHandler(event, outputCanvas);
    return false;
}

function outputMouseMoveHandler(event) {
    stopEventPropagationAndDefaultAction(event);
    var d;
    if (mousePressed) {
        setMousePosition(event, outputCanvas);
        d=(mouseX - lastMouseX)/outputWidth*(xMax-xMin);
        xMin -= d;
        xMax -= d;
        d=(mouseY - lastMouseY)/outputHeight*(yMax-yMin);
        yMin -= d;
        yMax -= d;
        setLastMousePosition();
        drawing();
    }
    return false;
}


//  the iteration
//========================================================

var iteration;

// parameters for the mapping between (x,y) space and indices (i,j)
//==============================================================

var xMin=-1;
var xMax=1;
var yMin=-1;
var yMax=1;
var xScale;
var yScale;

// the point
var px,py;


// starting

function background(red,green,blue){
    var iter;
    var length4=4*divergingNumbers.length;
    var pixelByteIndex=0;
    while (pixelByteIndex<length4){
        outputPixels[pixelByteIndex++]=red;
        outputPixels[pixelByteIndex++]=green;
        outputPixels[pixelByteIndex++]=blue;
        outputPixels[pixelByteIndex++]=255;
    }
}

//   study the diverging set
//==========================================================
var divergingRadius=8;
var divergingIterationLimit=20;
var divergingNumbers=[];

function makeDivergingNumbers(){
    //  from indices to space
    xScale=(xMax-xMin)/outputWidth;
    yScale=(yMax-yMin)/outputHeight;
    var radius2=divergingRadius*divergingRadius;
    var i,j,iter;
    var jWidth=0;
    var yStart;
    var diverging;
    for (j=0;j<outputHeight;j++){
        jWidth=j*outputWidth;
        yStart=yMin+j*yScale;
        for (i=0;i<outputWidth; i++) {
            px=xMin+xScale*i;
            py=yStart;
            iter=-1;
            diverging=false;
            while((iter<divergingIterationLimit)&&(!diverging)){
                iter++;
                iteration(px,py);
                diverging=(px*px+py*py>radius2);
            }
            if (diverging){
                divergingNumbers[i+jWidth]=iter;
            }
            else {
                divergingNumbers[i+jWidth]=-1;
            }
        } 
    }
}

// the color table
var divergingReds,divergingGreens,divergingBlues;

function setDivergingColors(){
    divergingReds=reds;
    divergingGreens=greens;
    divergingBlues=blues;
}

var divergingColorAmp=1;

function makeDivergingImage(){
    makeImage(divergingNumbers,divergingIterationLimit,divergingColorAmp,divergingReds,divergingGreens,divergingBlues);
}

//  study the attractor
//=========================================
// number of iterations

var attractorInitialIterations=100;
var millions=1000000;
var attractorProductionIterations=millions;
var attractorNumbers=[];


var maxTrials=50;


function startAttractor(){
    px=xMin+Math.random()*(xMax-xMin);
    py=yMin+Math.random()*(yMax-yMin);
    var radius2=divergingRadius*divergingRadius;
    var i=0;
    var diverging=false;
    while ((i<attractorInitialIterations)&&!diverging){
        i++;
        iteration(px,py);
        diverging=(px*px+py*py>radius2);
    }
    console.log(diverging+" "+i);
    return diverging;
}

function runAttractor(){
    var i,j;
    var iter;
    for (iter=0;iter<attractorProductionIterations;iter++){
        iteration(px,py);
        i=Math.round((px-xMin)*xScale);
        if ((i>=0)&&(i<outputWidth)){
            j=Math.round((py-yMin)*yScale);
            if ((j>=0)&&(j<outputHeight)){
                attractorNumbers[i+outputWidth*j]++;
            }
        }
    }
}

function makeAttractorNumbers(){
    var length=attractorNumbers.length;
    for (var i=0;i<length;i++){
        attractorNumbers[i]=-1;
    }
    var trial=0;
    var diverging=true;
    while(diverging&&(trial<maxTrials)){
        trial++;
        diverging=startAttractor();
    }
    if (diverging) return;
    //  from space to indices
    xScale=outputWidth/(xMax-xMin);
    yScale=outputHeight/(yMax-yMin);
    runAttractor();
}

// the color table
var attractorReds,attractorGreens,attractorBlues;

function setAttractorColors(){
    attractorReds=reds;
    attractorGreens=greens;
    attractorBlues=blues;
}

var attractorColorAmp=40;

function makeAttractorImage(){
    makeImage(attractorNumbers,maxNumber(attractorNumbers),attractorColorAmp,attractorReds,attractorGreens,attractorBlues);
  
}

// for any color table
//============================================================

var reds,greens,blues;

function resetColors(red,green,blue){
    reds=[red];
    greens=[green];
    blues=[blue];
}

function addColors(red,green,blue,nSteps){
    var start=reds.length-1;
    reds.length=start+nSteps;
    greens.length=start+nSteps;
    blues.length=start+nSteps;
    var redStart=reds[start];
    var greenStart=greens[start];
    var blueStart=blues[start];
    var redSlope=(red-redStart)/nSteps;
    var greenSlope=(green-greenStart)/nSteps;
    var blueSlope=(blue-blueStart)/nSteps;
    for (var i=1;i<=nSteps;i++){
        reds[i+start]=Math.floor(redStart+i*redSlope);
        greens[i+start]=Math.floor(greenStart+i*greenSlope);
        blues[i+start]=Math.floor(blueStart+i*blueSlope);
    }
}

function greyColors(start,end){
    resetColors(start,start,start);
    addColors(end,end,end,Math.abs(end-start));
}

function redBlueColors(){
    resetColors(0,0,0);
    addColors(128,128,128,128);
    addColors(255,0,0,128);
    addColors(255,0,255,255);
    addColors(0,255,255,255);
    addColors(255,255,0,255);
    addColors(255,255,255,255);
    console.log(reds.length);
}

function maxNumber(numbers){
    var length=numbers.length;
    var maxNumber=0;
    for (var i=0;i<length;i++){
        maxNumber=Math.max(maxNumber,numbers[i]);
    }
    return maxNumber;
}

function makeImage(numbers,maxNumber,colorAmp,reds,greens,blues){
    var length=numbers.length;
    var alpha=colorAmp* (reds.length-0.1)/maxNumber;
    var b=(colorAmp-1)/maxNumber;
    var pixelByteIndex=0;
    var number,colorIndex;
    for (var i=0;i<length;i++){
        number=numbers[i];
        if (number>=0){
            //console.log("number "+number+" c "+colorIndex);
            colorIndex=Math.floor(number*alpha/(1.0+b*number));

            outputPixels[pixelByteIndex++]=reds[colorIndex];
            outputPixels[pixelByteIndex++]=greens[colorIndex];
            outputPixels[pixelByteIndex]=blues[colorIndex];
            pixelByteIndex+=2;
        }
        else {
            pixelByteIndex+=4
        }
    }
}


// the iteration function
//=============================
var lambda=-1.906;
var alpha=3.1506;
var gamma=1.805055;


function threeIteration(x,y){
    var x2=x*x-y*y;
    var y2=2*x*y;
    var x4=x2*x2-y2*y2;
    var y4=2*x2*y2;
    var rsq=x*x+y*y;
    px=(lambda+alpha*rsq)*x+gamma*x4;
    py=(lambda+alpha*rsq)*y+gamma*y4;
}

function drawing(){

    attractorProductionIterations=5*millions;

    greyColors(64,255);
    setDivergingColors();

    background(100,0,0);
    makeDivergingNumbers();

    makeDivergingImage();

    outputImage.putImageData(outputData,0, 0);
    makeAttractorNumbers();

    redBlueColors();
    setAttractorColors();
    makeAttractorImage();

    outputImage.putImageData(outputData,0, 0);

}