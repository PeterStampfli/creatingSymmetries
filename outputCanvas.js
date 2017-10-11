"use strict";


// fast functions with elementary sin function
var elementaryFastFunction=new FastFunction();
elementaryFastFunction.makeSinTable();

console.log(elementaryFastFunction.cosLike(0)+" ***")

// the output canvas and the map
var initialOutputWidth=500;
var initialOutputHeight=500
var outputCanvas=new PixelCanvas('outputCanvas');
var map=new Map(elementaryFastFunction);
// default for test
var mappingFunction=map.identity;

// mouse control to change map position and scale
var outputMouseEvents=new MouseEvents('outputCanvas');
outputMouseEvents.addBasicDownUpOutActions();

// wheel action for changing the scale
outputMouseEvents.addWheelAction(function(event, mouseEvents){
	var factor=1.1;
	var transform=map.transform;
	if (event.deltaY<0){
		factor=1/factor;
	}
	map.transform.scale*=factor;
	map.transform.scaleShift(1/factor);
  	map.make(mappingFunction);
  	createImage();
});

// mouse move shifts the image
outputMouseEvents.addMoveAction(function(event, mouseEvents){
	map.transform.addShift(-mouseEvents.dx,-mouseEvents.dy);
  	map.make(mappingFunction);
  	createImage();
});



