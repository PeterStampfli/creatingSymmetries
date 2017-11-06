"use strict";

// make map using symmetries ...
function totalMap(){
  	if (!map.isValid){

  	//	map.transform.shiftY=0;

		map.make(mappingFunction);                    // recalculates only if necessary
	//	map.makeRegion(mappingFunction,0,0,40,250);                    // recalculates only if necessary
		//map.bottomToTop();
	}


}

//var p1=new Polygon(0,0,2,-1,4,5);


// mapping functions and how to prepare them


function basicOddQuasiperiodic(inputImagePosition,colorPosition,spacePosition,canvasPosition){

imageSum.positionTimesUnitVectors(spacePosition.x,spacePosition.y);



inputImagePosition.x=imageSum.minimumCosines1(k);
inputImagePosition.y=imageSum.minimumSines1(k);

//inputImagePosition.x=sum.cosines1(k);
//inputImagePosition.y=sum.sines1(k);
}



function testQuasi(inputImagePosition,colorPosition,spacePosition,canvasPosition){

//spacePosition.circleInversion(0,0,10);
//spacePosition.upperLeftToLowerRightAt(0,-2);
/*
if (spacePosition.isInsidePolygon(0,0,2,-1,4,5)){
	spacePosition.x=0;
	spacePosition.y=0;
}

if (spacePosition.isInsidePolygon([11,-5,15,0,11,8])){
	spacePosition.x=0;
	spacePosition.y=0;
}
*/
imageSum.positionTimesUnitVectors(spacePosition.x,spacePosition.y);

imageSum.combination=imageCombination;


inputImagePosition.x=imageSum.sines1(k);
inputImagePosition.y=imageSum.cosines1(k);
//colorPosition.x=sum.colorSum1X(k);
//colorPosition.y=sum.colorSum1Y(k);
//sum.colorSum1Y(1);

//inputImagePosition.x=sum.minimumCosines1(k);
//inputImagePosition.y=sum.minimumSines1(k);

}

var nSymmPoincarePlane=4;
var radiusPoincarePlane=0.5/Math.cos(Math.PI/nSymmPoincarePlane);


function poincarePlane(inputImagePosition,colorPosition,spacePosition,canvasPosition){
	var isFinished=false;
	var iter=0;
	var iterMax=10;
	inputImagePosition.set(spacePosition);
	while (!isFinished){
		inputImagePosition.periodXUnit();
		inputImagePosition.leftToRightAt(0.5);
		iter++;
		if (iter>iterMax){
			isFinished=true;
			inputImagePosition.y=1000000;
		}
		else if (!inputImagePosition.circleInversion(0.0,0,radiusPoincarePlane)){
			isFinished=true;
		}
	}
	inputImagePosition.x=0.5*imageFastFunction.periodicMapping(inputImagePosition.x);
}

var nCorners=8;
var radiusPoincarePolygon=0.5*Math.tan(3.14159/nCorners);

function poincarePolygon(inputImagePosition,colorPosition,spacePosition,canvasPosition){

	var isFinished=false;
	var iter=0;
	var iterMax=10;
				
	inputImagePosition.set(spacePosition);

	while (!isFinished){

	inputImagePosition.reduceAngle(nCorners);
	iter++;
		if (iter>iterMax){
			isFinished=true;
			inputImagePosition.y=1000000;
		}

	else if (!inputImagePosition.circleInversion(0.5,0,radiusPoincarePolygon)){
		isFinished=true;
	}

}

	if (inputImagePosition.x>0.5){
		inputImagePosition.x=100000;
	}
	else {
		inputImagePosition.reduceAngleSmooth(nCorners);
	}
}

function otherPoincarePolygon(inputImagePosition,colorPosition,spacePosition,canvasPosition){

	var isFinished=false;
	var iter=0;
	var iterMax=10;
				
	inputImagePosition.set(spacePosition);

	while (!isFinished){

	inputImagePosition.reduceAngle(nCorners);
	iter++;
		if (iter>iterMax){
			isFinished=true;
			inputImagePosition.y=1000000;
		}

	else if (!inputImagePosition.circleInversion(0.5,radiusPoincarePolygon,2*radiusPoincarePolygon)){
		isFinished=true;
	}

}

	if (inputImagePosition.x>0.5){
		inputImagePosition.x=100000;
	}
	else {
		inputImagePosition.reduceAngleSmooth(nCorners);
	}
}