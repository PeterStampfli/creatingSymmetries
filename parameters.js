"use strict";


// standard parameters


// the output canvas size
var initialOutputWidth=500;
var initialOutputHeight=500

// the map transform makes that the x-coordinate on the outputCanvas
// goes initially from - initialMapRange to + initialMapRange
// same for y-coordinate of sqaure canvas
var initialMapRange=10; 




var orientationCanvasSize=200;

// the referenceCanvas
var referenceCanvasBaseSize=300;

// for the input number of pixels per geometric unit
var initialInputScale=100;           


// background color, for hitting outside
var backgroundColor=new Color;
backgroundColor.setRgb(100,100,100);



// parameters and other small things defining a particular image


var p=5;
var nColorSymmetry=2;

var sum=new SumWaves(p,nColorSymmetry,elementaryFastFunction);

// the color symmetry
var colorSymmetry=new ColorSymmetry(nColorSymmetry);


sum.oddRotationalSymmetry();

var k=1;

// mapping default for test
var mappingFunction=testQuasi;

