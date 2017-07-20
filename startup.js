"use strict";
//  the startup function
//==============================================================================

var initialOutputWidth=512;
var initialOutputHeight=512;
var initialXRange=10;

window.onload = function () {
    connectNewInputImage();
    setupReferenceCanvas();
    setupOutputCanvas();
    setupOrientationCanvas(200);
    makeInteractions();

    mapScale=initialXRange/initialOutputWidth;

    initialOutputDimensions(initialOutputWidth, initialOutputHeight);



}