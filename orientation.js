"use strict";

// orientation canvas with its mouse events, changing the inputTransform

// the orientation canvas
var orientationCanvas=new PixelCanvas('orientationCanvas');

// mouse control to change angle
var orientationMouseEvents=new MouseEvents('orientationCanvas');
orientationMouseEvents.angle=0;

// drawing the orientation arrow
orientationCanvas.drawOrientation=function(angle){
    var arrowWidth = 0.2;
    var cosAngle = Math.cos(angle);
    var sinAngle = Math.sin(angle);
    this.canvasImage.clearRect(-1,-1,2,2);
    this.canvasImage.fillStyle = "White";
    this.canvasImage.beginPath();
    this.canvasImage.arc(0, 0, 1, 0, 2 * Math.PI, 1);
    this.canvasImage.fill();
    this.canvasImage.fillStyle = "Brown";
    this.canvasImage.beginPath();
    this.canvasImage.moveTo(cosAngle, sinAngle);
    this.canvasImage.lineTo(arrowWidth * sinAngle, -arrowWidth * cosAngle);
    this.canvasImage.lineTo(-arrowWidth * cosAngle, -arrowWidth * sinAngle);
    this.canvasImage.lineTo(-arrowWidth * sinAngle, arrowWidth * cosAngle);
    this.canvasImage.fill();
};
// check if a point (x,y) relative to upper left center is on the inner disc
orientationCanvas.isOnDisc=function(x,y){
	var radius=this.width/2;
	return((x - radius) * (x - radius) + (y - radius) * (y - radius)) < radius * radius;
}

// adapt standard mpouse events to disc shape
orientationMouseEvents.addDownAction(function(event,mouseEvents){
	mouseEvents.updateMousePosition(event);
	if (orientationCanvas.isOnDisc(mouseEvents.x,mouseEvents.y)){
		mouseEvents.pressed=true;
	}
});
orientationMouseEvents.addUpAction(orientationMouseEvents.basicUpAction);
orientationMouseEvents.addOutAction(orientationMouseEvents.basicUpAction);


// set the angle, draw the orientation canvas and redraw the image
orientationMouseEvents.setAngle=function(angle){
	this.angle=angle;
	orientationCanvas.drawOrientation(angle);
	inputTransform.setAngle(angle);
	createImage();
}

orientationMouseEvents.addWheelAction(function(event,mouseEvents){
	var deltaAngle=0.05;
	mouseEvents.updateMousePosition(event);
	if (orientationCanvas.isOnDisc(mouseEvents.x,mouseEvents.y)){
		if (event.deltaY > 0) {
            mouseEvents.setAngle(mouseEvents.angle + deltaAngle);
        } else {
            mouseEvents.setAngle(mouseEvents.angle - deltaAngle);
        }
	}
});

// restrict on the circle shape
orientationMouseEvents.addAction("mousemove",function(event,mouseEvents){
	var radius=orientationCanvas.width/2;
	if (mouseEvents.pressed){
		mouseEvents.updateMousePosition(event);
		if (orientationCanvas.isOnDisc(mouseEvents.x,mouseEvents.y)){
				mouseEvents.setAngle(mouseEvents.angle
					+Math.atan2((mouseEvents.y-radius),(mouseEvents.x-radius))
					-Math.atan2((mouseEvents.lastY-radius),(mouseEvents.lastX-radius)));
		}
		else{
			mouseEvents.basicUpAction(event,mouseEvents);
		}
	}
});

// finish setup

orientationCanvas.setSize(orientationCanvasSize,orientationCanvasSize);
// with axis ranges -1 ... 1
orientationCanvas.canvasImage.scale(orientationCanvasSize/2,orientationCanvasSize/2);
orientationCanvas.canvasImage.translate(1,1);
orientationCanvas.drawOrientation(0);
