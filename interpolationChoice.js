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

function mitchellNetrovalli(x){   // Mitchell-Netrovali, B=C=0.333333, 0<x<2
	if (x<1){
		return (1.16666*x-2)*x*x+0.888888;
	}
	return ((2-0.388888*x)*x-3.33333)*x+1.777777;				
}
