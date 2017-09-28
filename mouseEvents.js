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
	this.lastX=x;
	this.lastY=y;
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
MouseEvents.prototype.addEvent=function(eventName,action){
	var mouseEvents=this;
	this.element.addEventListener(eventName,function(event){
		mouseEvents.stopEventPropagationAndDefaultAction(event);
		action(event,mouseEvents);
		return false;
	},true);
}

/*
on mouse down set pressed =true and update position
*/
MouseEvents.prototype.basicMouseDownAction=function(event,mouseEvents){
	mouseEvents.pressed=true;
	mouseEvents.updateMousePosition(event);
}

/*
on mouse up set pressed =false
same for mouseout
*/
MouseEvents.prototype.basicMouseUpAction=function(event,mouseEvents){
	mouseEvents.pressed=false;
}


/*
on mouse move do something with position
*/
MouseEvents.prototype.basicMouseMoveAction=function(event,mouseEvents){
	mouseEvents.updateMousePosition(event);
	console.log(mouseEvents.dx,mouseEvents.dy);
}


/*
on (mouse) wheel do something depending on direction
*/
MouseEvents.prototype.basicMouseWheelAction=function(event,mouseEvents){
	console.log(event.deltaY);
}