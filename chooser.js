"use strict";

/*
object to simplify radio-button chooser
*/

/*
className String, name of class in html document
*/
function Chooser(className){
	this.index=0;
	this.buttons=document.getElementsByClassName(className);
}

/*
action function(), what to do at click event
*/
Chooser.prototype.add=function(action){
	this.buttons[this.index++].addEventListener('click',action,false);
}


/*
 a function to set up a button

 idName String, name of id in html document
 eventName String, name of event 'click' or 'change'
 action function(), what to do at click event

 returns the button element
*/

function makeButton(idName,eventName,action){
	var button=document.getElementById(idName);
	button.addEventListener(eventName,action,false);
	return button;
}

function makeClickButton(idName,action){
	return makeButton(idName,'click',action);
}