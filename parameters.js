"use strict";


// standard parameters


// the output canvas size
var initialOutputWidth=500;
var initialOutputHeight=500;

// the map transform makes that the x-coordinate on the outputCanvas
// has an intervall length of initialMapRange
// same for y-coordinate of square canvas
var initialMapRange=20; 

// the initial relative origin
var initialRelativeOriginX=0.0;
var initialRelativeOriginY=0.5;


var orientationCanvasSize=200;

// the referenceCanvas
var referenceCanvasBaseSize=300;

// for the input number of pixels per geometric unit
var initialInputScale=100;           


// background color, for hitting outside
var backgroundColor=new Color;
backgroundColor.setRgb(100,100,100);



// parameters and other small things defining a particular image

// repetitions: use entire number to get center of tile at center of image
//  use slighly smaller than integer to get seams at center
var verticalRepetitions=2;
var horizontalRepetitions=2;

var initialHarmonics=1;


elementaryFastFunction.makeTriangleExpansionTable(initialHarmonics);

var p=5;
var nColorSymmetry=1;

var imageSum=new SumWaves(imageFastFunction);
imageSum.set(p,nColorSymmetry);
imageSum.oddRotationalSymmetry();

// the color symmetry
var colorSymmetry=new ColorSymmetry(nColorSymmetry);
colorSymmetry.transWidth=-0.2;
colorSymmetry.transSmoothing=0.05;



var k=1;

// mapping default for test
var mappingFunction=testQuasi;
