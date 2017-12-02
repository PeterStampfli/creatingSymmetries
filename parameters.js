"use strict";


// standard parameters

var inputImagePeriodic=true;


// the output canvas size
var initialOutputWidth=500;
var initialOutputHeight=500;

// the map transform makes that the x-coordinate on the outputCanvas
// has an intervall length of initialMapRange
// same for y-coordinate of square canvas
var initialMapRange=1; 

// the initial relative origin
var initialRelativeOriginX=0.5;
var initialRelativeOriginY=0.5;


var orientationCanvasSize=200;

// the referenceCanvas
var referenceCanvasBaseSize=300;

// for the input number of pixels per geometric unit
var initialInputScale=100;           


// background color, for hitting outside
var backgroundColor=new Color;
backgroundColor.setRgb(70,70,100);



// parameters and other small things defining a particular image

// repetitions: use entire number to get center of tile at center of image
//  use slighly smaller than integer to get seams at center
var verticalRepetitions=1;
var horizontalRepetitions=0;

var initialHarmonics=1;


elementaryFastFunction.makeTriangleExpansionTable(initialHarmonics);

var p=5;
var nColorSymmetry=2;

var imageSum=new SumWaves(imageFastFunction);
imageSum.set(p,nColorSymmetry);
imageSum.oddRotationalSymmetry();

// the color symmetry
var colorSymmetry=new ColorSymmetry(nColorSymmetry);
colorSymmetry.transWidth=-0.2;
colorSymmetry.transSmoothing=0.05;



var k=1;

var iterMaximum=100;

rosettePowerR=2;
basicRosette=rosettePeriodicMirrorPhi;

// mapping default for test
var mappingFunction=elliptic;

//mappingFunction=Map.prototype.identity;

