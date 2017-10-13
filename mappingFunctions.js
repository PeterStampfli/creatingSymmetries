"use strict";


// fast functions with elementary sin function
var elementaryFastFunction=new FastFunction();
elementaryFastFunction.makeSinTable();
elementaryFastFunction.makeExpLogAtanTables();


// mapping functions and how to prepare them

var sum=new SumWaves(5,elementaryFastFunction);
sum.oddRotationalSymmetry();

var k=1;

function basicOddQuasiperiodic(inputImagePosition,colorPosition,spacePosition,canvasPosition){

sum.positionTimesUnitVectors(spacePosition.x,spacePosition.y);


inputImagePosition.x=sum.cosines1(k);
inputImagePosition.y=sum.sines1(k);
}