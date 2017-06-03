"use strict";
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


    console.log("start "+transSmoothing);
