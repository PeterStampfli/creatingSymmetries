"use strict";


// the output canvas
var initialOutputWidth=500;
var initialOutputHeight=500
var outputCanvas=new PixelCanvas('outputCanvas');
outputCanvas.setSize(initialOutputWidth,initialOutputHeight);

// the orientation canvas
var orientationCanvas=new PixelCanvas('orientationCanvas');
var orientationCanvasSize=200;
orientationCanvas.setSize(orientationCanvasSize,orientationCanvasSize);
// with axis ranges -1 ... 1
orientationCanvas.canvasImage.scale(orientationCanvasSize/2,orientationCanvasSize/2);
orientationCanvas.canvasImage.translate(1,1);
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

// mouse control to change angle
var orientationMouseEvents=new MouseEvents('orientationCanvas');

// adapt standard events to disc shape
orientationMouseEvents.addDownAction(function(event,mouseEvents){
	mouseEvents.updateMousePosition(event);
	if (orientationCanvas.isOnDisc(mouseEvents.x,mouseEvents.y)){
		mouseEvents.pressed=true;
	}
});
orientationMouseEvents.addUpAction(orientationMouseEvents.basicUpAction);
orientationMouseEvents.addOutAction(orientationMouseEvents.basicUpAction);

// changing the angle
orientationMouseEvents.angle=0;
orientationMouseEvents.deltaAngle=0.05;

// set the angle, draw the orientation canvas and redraw the image
orientationMouseEvents.setAngle=function(angle){
	this.angle=angle;
	orientationCanvas.drawOrientation(angle);
	// set inputImage Transform angle
	// make drawing
}

orientationMouseEvents.setAngle(0);

orientationMouseEvents.addWheelAction(function(event,mouseEvents){
	mouseEvents.updateMousePosition(event);
	if (orientationCanvas.isOnDisc(mouseEvents.x,mouseEvents.y)){
		console.log(event.deltaY);
		if (event.deltaY > 0) {
            mouseEvents.setAngle(mouseEvents.angle + mouseEvents.deltaAngle);
        } else {
            mouseEvents.setAngle(mouseEvents.angle - mouseEvents.deltaAngle);
        }
	}
});

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


// make the input image object, set initial interpolation method
var inputImage=new InputImage();
var interpolation="nearest";
inputImage.interpolation=inputImage.getNearest;


// setting up the buttons

// the input image
var imageInputButton = new Button('imageInput');
imageInputButton.onChange(function(){
    inputImage.read(imageInputButton.button.files[0],function(){
    	console.log("adjust reference");
    	createImage();
    });
});

// choosing the output width
var outputWidthChooser=new Button('outputWidthChooser');
var outputHeightChooser=new Button('outputHeightChooser');

// set the start values
outputWidthChooser.setValue(initialOutputWidth);
outputHeightChooser.setValue(initialOutputHeight);

// the smoothing variants

var smoothing=false;
var smoothingChoosers=new Chooser('smoothing');
smoothingChoosers.add(function(){
    smoothing=false;
    console.log("smoothing "+smoothing);
});
smoothingChoosers.add(function(){
    smoothing=true;
    console.log("smoothing "+smoothing);
});

// the interpolation method

var interpolationChoosers=new Chooser('interpolation');
interpolationChoosers.add(function(){
	inputImage.interpolation=inputImage.getNearest;
    interpolation="nearest";
    console.log("interpolation "+interpolation);
});
interpolationChoosers.add(function(){
	inputImage.interpolation=inputImage.getLinear;
    interpolation="linear";
    console.log("interpolation "+interpolation);
});
interpolationChoosers.add(function(){
	inputImage.interpolation=inputImage.getCubic;
    interpolation="cubic";
    console.log("interpolation "+interpolation);
});

// the color modification (inversion)
	
var nColorMod=0;
var colorMod="none";
var inversionChoosers=new Chooser('inversion');
inversionChoosers.add(function(){
    nColorMod = 0;
    colorMod="none";
    createImage();
});
inversionChoosers.add(function(){
    nColorMod = 1;
    colorMod="first";
    createImage();
});
inversionChoosers.add(function(){
    nColorMod = 2;
    colorMod="second";
    createImage();
});

// the message
var progress=document.getElementById("progress");
progress.innerHTML="Waiting for input image.";

function progressMessage(){
	progress.innerHTML="Width "+outputWidthChooser.getValue()+", height "+outputHeightChooser.getValue()+
    ". No smoothing. Interpolation "+interpolation+". Color modification "+colorMod+".";
}

var updateButton=new Button("update");
updateButton.onClick(function(){
    createImage();
});

var saveImageButton=new Button("blob");
saveImageButton.onClick(function(){
    outputCanvas.canvas.toBlob(function(blob){
        saveAs(blob,"someImage.jpg");
    },'image/jpeg',0.92);
});


