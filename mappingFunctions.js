"use strict";

// make map using symmetries ...
function totalMap(){
  	if (!map.isValid){
		map.make(mappingFunction);                    // recalculates only if necessary
		//map.bottomToTop();
	}


}



// mapping functions and how to prepare them


function basicOddQuasiperiodic(inputImagePosition,colorPosition,spacePosition,canvasPosition){

sum.positionTimesUnitVectors(spacePosition.x,spacePosition.y);


inputImagePosition.x=sum.cosines1(k);
inputImagePosition.y=sum.sines1(k);
}


function testQuasi(inputImagePosition,colorPosition,spacePosition,canvasPosition){

//spacePosition.circleInversion(0,0,10);
spacePosition.upperLeftToLowerRightAt(0,-2);

sum.positionTimesUnitVectors(spacePosition.x,spacePosition.y);


inputImagePosition.x=sum.sines1(k);
inputImagePosition.y=sum.cosines1(k);
//colorPosition.x=sum.colorSum1X(k);
//colorPosition.y=sum.colorSum1Y(k);
//sum.colorSum1Y(1);
}

