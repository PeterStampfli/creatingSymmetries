"use strict";
//  the startup function
//==============================================================================

var initialOutputSize=8;

window.onload = function () {
    connectNewInputImage();
    setupReferenceCanvas();
    setupOutputCanvas();
    setupOrientationCanvas(200);
    makeInteractions();

    mapScale=2.0/Math.sqrt(initialOutputSize*initialOutputSize+initialOutputSize*initialOutputSize);

    initialOutputDimensions(initialOutputSize, initialOutputSize);



};