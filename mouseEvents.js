"use strict";

/*
object that attaches mouse events and organizes basic data
*/

/*
use mouse events on element with given id name
*/
function MouseEvents(idName){
	this.element=document.getElementById(idName);
	this.x=0;
	this.y=0;
	this.lastX=0;
	this.lastY=0;
	this.dx=0;
	this.dy=0;
	this.pressed=false;
	this.name=idName;

}

// override default mouse actions, especially important for the mouse wheel
MouseEvents.prototype.stopEventPropagationAndDefaultAction=function (event) {
    event.stopPropagation();
    event.preventDefault();
}

/*
read the mouse position relative to element, calculate changes
*/
MouseEvents.prototype.updateMousePosition=function(event){
	this.lastX=this.x;
	this.lastY=this.y;
	this.x = event.pageX - this.element.offsetLeft;
    this.y = event.pageY - this.element.offsetTop;
    this.dx=this.x-this.lastX;
    this.dy=this.y-this.lastY;
}

/*
add an event with given eventName and action(event,mouseEvents)
where action function only cares about the thing to do
*/
// listeners for useCapture, acting in bottom down capturing phase
//  they should return false to stop event propagation ...
MouseEvents.prototype.addAction=function(eventName,action){
	var mouseEvents=this;                                              // hook to this mouseEvents object
	this.element.addEventListener(eventName,function(event){
		mouseEvents.stopEventPropagationAndDefaultAction(event,mouseEvents);
		action(event,mouseEvents);
		return false;
	},true);
}

/*
add action for a mouse down event
*/
MouseEvents.prototype.addDownAction=function(action){
	this.addAction("mousedown",action);
}

/*
add action for a mouse up event
*/
MouseEvents.prototype.addUpAction=function(action){
	this.addAction("mouseup",action);
}

/*
add action for a mouse move event, automaticall checks if pressed and updates position
*/
MouseEvents.prototype.addMoveAction=function(action){
	this.addAction("mousemove",function(event,mouseEvents){
		if (mouseEvents.pressed){
			mouseEvents.updateMousePosition(event);
			action(event,mouseEvents);
		}
	});
}

/*
add action for a mouse out event
*/
MouseEvents.prototype.addOutAction=function(action){
	this.addAction("mouseout",action);
}

/*
add action for a mouse wheel event
*/
MouseEvents.prototype.addWheelAction=function(action){
	this.addAction("mousewheel",action);                // chrome, opera
	this.addAction("wheel",action);                     // firefox
}


/*
on mouse down set pressed =true and update position
*/
MouseEvents.prototype.basicDownAction=function(event,mouseEvents){
	mouseEvents.pressed=true;
	mouseEvents.updateMousePosition(event);
}

/*
on mouse up set pressed =false
same for mouseout
*/
MouseEvents.prototype.basicUpAction=function(event,mouseEvents){
	mouseEvents.pressed=false;
}


/*
on mouse move do something with position, called only if mouse pressed
*/
MouseEvents.prototype.basicMoveAction=function(event,mouseEvents){
	console.log(mouseEvents.dx,mouseEvents.dy);
}


/*
on (mouse) wheel do something depending on direction
*/
MouseEvents.prototype.basicWheelAction=function(event,mouseEvents){
	console.log(event.deltaY);
}

/*
add the basic up, down and out actions
*/
MouseEvents.prototype.addBasicDownUpOutActions=function(){
	//var mouseEvents=this;
	this.addDownAction(this.basicDownAction);
	this.addUpAction(this.basicUpAction);
	this.addOutAction(this.basicUpAction);
}
