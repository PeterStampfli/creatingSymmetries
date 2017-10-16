"use strict";


// mapping functions and how to prepare them


function basicOddQuasiperiodic(inputImagePosition,colorPosition,spacePosition,canvasPosition){

sum.positionTimesUnitVectors(spacePosition.x,spacePosition.y);


inputImagePosition.x=sum.cosines1(k);
inputImagePosition.y=sum.sines1(k);
}


function testQuasi(inputImagePosition,colorPosition,spacePosition,canvasPosition){

sum.positionTimesUnitVectors(spacePosition.x,spacePosition.y);


inputImagePosition.x=sum.cosines1(k);
inputImagePosition.y=sum.cosines2(k,k);
colorPosition.x=sum.sines1(1);
sum.colorSum1X(1);
sum.colorSum1Y(1);
}

