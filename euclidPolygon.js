"use strict";

var euclidPolygon={};
// parameters
euclidPolygon.scale=20;


euclidPolygon.baseLength=0.2

euclidPolygon.setup=function(center,left,right){
	euclidPolygon.nCenter=center;

	// rotational symmetry at left corner
	euclidPolygon.nLeft=left;


	euclidPolygon.alpha=Math.PI/euclidPolygon.nLeft;
	
	console.log("euclidpolygonsetup");
	
	euclidPolygon.theGamma=Math.PI/euclidPolygon.nCenter;

}

// standard kaleidoscope
euclidPolygon.map=function (inputImagePosition,colorPosition,spacePosition,canvasPosition){
	var isFinished=false;
	var iter=0;
	var iterMax=10;	
	var angle,distance;  
	var normalX,normalY;                                          // distance to plane, normal pointing inside triangle	
	inputImagePosition.set(spacePosition);
	colorPosition.x=0;                                        // as parity for 2 colors
	while (!isFinished){

		iter++;
		if (iter>iterMax){
			return false;
		}
		else {

			// find the center angle of the point
			angle=Math.floor(elementaryFastFunction.atan2(inputImagePosition.y,inputImagePosition.x)*0.5/euclidPolygon.theGamma);
			angle=euclidPolygon.theGamma*(2*angle+1);
			normalX=elementaryFastFunction.cos(angle);
			normalY=elementaryFastFunction.sin(angle);


			distance=normalX*(inputImagePosition.x-euclidPolygon.baseLength*normalX)+normalY*(inputImagePosition.y-euclidPolygon.baseLength*normalY);
			if (distance<=0.00001){
				isFinished=true;
			}
			else {
				inputImagePosition.x-=2*distance*normalX;
				inputImagePosition.y-=2*distance*normalY;
				colorPosition.x++;
			}
		}
	}

	inputImagePosition.scale(euclidPolygon.scale);
	return true;
}
