// current mouse data, with respect to referenceCanvas
var mousePressed=false;
var mouseX=0;
var mouseY=0;

//  set the mouse coordinates from current event
function setMousePosition(event){
	mouseX=event.pageX-referenceCanvas.offsetLeft;
	mouseY=event.pageY-referenceCanvas.offsetTop;
}
// the wheel changes the scale: map to input image pixels
//  a larger scale zooms out
var scale=2;
var changeScaleFactor=1.1;

// override default actions on the reference canvas
// especially important for the mouse wheel
function stopEventPropagationAndDefaultAction(event) {
   if (event.stopPropagation) {        // W3C standard variant
	   event.stopPropagation();
		event.preventDefault();   
	} 
	else {            //IE variant ???????????????????'
      event.cancelBubble = true;
		event.returnValue = false; 
	}
	return false;
}


function mouseDownHandler(event){
	stopEventPropagationAndDefaultAction(event)
	mousePressed=true;
	setMousePosition(event);
	drawing();
	return false;
}

function mouseMoveHandler(event){
	stopEventPropagationAndDefaultAction(event)
	if (mousePressed){
		setMousePosition(event);
		drawing();
	}
	return false;
}

function mouseUpHandler(event){
	stopEventPropagationAndDefaultAction(event)
	mousePressed=false;
	
		drawing();

	return false;
}


function mouseOutHandler(event){
	stopEventPropagationAndDefaultAction(event)
	mousePressed=false;
	
		drawing();

	return false;
}

//  change the scaling with the mouse wheel
function mouseWheelHandler(event){
	stopEventPropagationAndDefaultAction(event);
	if (event.deltaY>0){
		scale*=changeScaleFactor;
	}
	else {
		scale/=changeScaleFactor;
	}
	//  (re)drawing what???
	drawing();
	return false;
}

// listeners for useCapture, acting in bottom down capturing phase
//  they should return false to stop event propagation ...
function referenceCanvasAddEventListeners(){
		referenceCanvas.addEventListener("mousedown",mouseDownHandler,true);
		referenceCanvas.addEventListener("mousemove",mouseMoveHandler,true);
		referenceCanvas.addEventListener("mouseup",mouseUpHandler,true);
		referenceCanvas.addEventListener("mouseout",mouseOutHandler,true);
		referenceCanvas.addEventListener("wheel",mouseWheelHandler,true);

	
}

