"use strict";

// the output canvas, the map, and mouse events for changing the map
var outputCanvas=new PixelCanvas('outputCanvas');
var map=new Map(elementaryFastFunction);


// mouse control to change map position and scale
var outputMouseEvents=new MouseEvents('outputCanvas');
outputMouseEvents.addBasicDownUpOutActions();

// wheel action for changing the scale
outputMouseEvents.addWheelAction(function(event, mouseEvents){
	var factor=1.05;
	var transform=map.transform;
	if (event.deltaY<0){
		factor=1/factor;
	}
	map.transform.scale*=factor;
	map.transform.changeShift(1/factor);
	map.transform.addShift(map.width*0.5*(1/factor-1),map.height*0.5*(1/factor-1));
  	map.isValid=false;
  	createImage();
});

// mouse move shifts the image
outputMouseEvents.addMoveAction(function(event, mouseEvents){
	map.transform.addShift(-mouseEvents.dx,-mouseEvents.dy);
  	map.isValid=false;
  	createImage();
});



outputCanvas.setSize(initialOutputWidth,initialOutputHeight);
outputCanvas.blueScreen();
outputCanvas.createPixels();
map.setSize(initialOutputWidth,initialOutputHeight);
map.setRelativeOrigin(initialRelativeOriginX,initialRelativeOriginY);
map.setRange(initialMapRange);

var imageCombination=makeSum;

totalMap();

