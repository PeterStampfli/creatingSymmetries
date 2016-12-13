"use strict";

// we need this for simple patching

// the colors, directly for speed
var outputRed;
var outputBlue;
var outputGreen;


	
	
// using nearest neighbor in the unit cell
// clamp coordinates at boundary

function getOutputColorsNext(x,y){
	x=Math.max(0,Math.min(periodWidth-1,Math.round(x)));
	
	y=Math.max(0,Math.min(periodHeight-1,Math.round(y)));
	
	
}
