"use strict";

// the sine and cosine functions on the lattice taken from tables
var sinXTab=[];
var sinYTab=[];


//making the tables, update needed if periods change
//  we need a full period to make lookup as simple as possible for higher frequencies
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

function setupSinTables(){
	setupSinTable(sinXTab,periodWidth);
	setupSinTable(sinYTab,periodHeight);
}

// getting the functions
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
