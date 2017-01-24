"use strict";


//================================================================================
// on the output canvas, the coordinates range is x,y=-2 ... +2
//  for easy work with inversion
//  then a mapping is done, resulting in xImage and yImage
// then a pixel address is put in the table
// a unit length corresponds
// ========================================================================

var logR=0;
var phi=0;



// other symmetry dependent parts
//=============================================================================

// initial mapping scale
//  (x,y) coordinates to pixels
scaleOutputToInput = 200

// the replacement color for outside pixels
var outsideRed = 100;
var outsideGreen = 100;
var outsideBlue = 100;


//get the color of a pixel, trivial case, no color symmetry
function makePixelColor(x,y){
    if (true){
        sampleInput(x,y);
    }
    else {
        sampleInput(-x,y);
        pixelRed=255-pixelRed;
        pixelGreen=255-pixelGreen;
        pixelBlue=255-pixelBlue;    
    }
}//  create the distorted symmetric image



function imageZero(x,y){
    logR=0.5*Math.log(y*y+x*x);
    phi=Math.atan2(y,x);
    xImage=0;
    yImage=0;
}



// the real parts
function imageAdd(a,b,c,d,rPower,phiPower){
    var rk=fExp(rPower*logR);
    var rkSinPhi=phiPower*phi;
    var rkCosPhi=rk*fCos(rkSinPhi);
    rkSinPhi=rk*fSin(rkSinPhi);
    xImage+=a*rkCosPhi+b*rkSinPhi;
    yImage+=c*rkCosPhi+d*rkSinPhi;
}


function realMapping(x,y){
    imageZero(x,y);
    imageAdd(1,0,0,0,2,4);
    imageAdd(0.2,0,0.5,0,-0.5,12);
}


function mappingUnity(){
    var r=fExp(logR);
    xImage=r*fCos(phi);
    yImage=r*fSin(phi);
}


var mapping;
mapping=realMapping;
