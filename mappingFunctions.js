"use strict";

// make map using symmetries ...
function totalMap(){
  	if (!map.isValid){

  		//map.transform.shiftY=0;

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
