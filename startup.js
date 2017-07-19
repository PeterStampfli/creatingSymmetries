"use strict";
//  the startup function
//==============================================================================

var initialOutputWidth=700;
var initialOutputHeight=512;
var initialXRange=3;

window.onload = function () {
    connectNewInputImage();
    setupReferenceCanvas();
    setupOutputCanvas();
    setupOrientationCanvas(200);
    makeInteractions();

    mapScale=initialXRange/initialOutputWidth;

    initialOutputDimensions(initialOutputWidth, initialOutputHeight);



}