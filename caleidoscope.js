"use strict";

// collection of small functions used in different places
//=================================================================

// override default mouse actions, especially important for the mouse wheel
function stopEventPropagationAndDefaultAction(event) {
	event.stopPropagation();
	event.preventDefault();   
}

// accelerated trigonometric functions for the mapping functions:
// tables for the sine and cosine functions
var sinXTab=[];
var sinYTab=[];

// making the tables, depending on the period lengths of the unit cell
// we need a full period to make lookup as simple as possible for higher frequencies
function setupSinTable(sinTab,length){
	var factor=2*Math.PI/length;
	var length4=length/4;
	var length2=length/2;
	var i;
	var sinus;
	sinTab.length=length;
	sinTab[0]=0;
	sinTab[length2]=0;
	for (i=1;i<=length4;i++){
		sinus=Math.sin(factor*i);
		sinTab[i]=sinus;
		sinTab[length2-i]=sinus;
		sinTab[length2+i]=-sinus;
		sinTab[length-i]=-sinus;	
	}	
}

// the sin and cos functions, periodic on the unit lattice dimensions,
//  for any integer multiple of the side length of a pixel
//====================================================
//  horizontal
function sinX(i){
	return sinXTab[i%periodWidth];
}

function cosX(i){
	return sinXTab[(i+periodWidth4)%periodWidth];
}

// vertical
function sinY(i){
	return sinYTab[i%periodHeight];
}

function cosY(i){
	return sinYTab[(i+periodHeight4)%periodHeight];
}

