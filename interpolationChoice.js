"use strict";

//  sampling quality: choose interpolation method
var NEXT=0;
var LINEAR=1;
var CUBIC=2;
var quality=NEXT;            // LINEAR,CUBIC

function setInterpolation(string){
	if (string==="nearest") quality=NEXT;
	if (string==="linear") quality=LINEAR;
	if (string==="cubic") quality=CUBIC;
	drawing();
}
