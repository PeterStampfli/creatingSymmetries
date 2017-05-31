//===============================================================================
//===============================================================================
//
//   rosette images
//
//=============================================================================
//===============================================================================

// initial mapping scale
//  (x,y) coordinates to pixels
scaleOutputToInput = 200

//  make the mapping that defines the symmetry
var logR=0;
var phi=0;
var rkCosPhi;
var rkSinPhi;

// initialization
function imageZero(x,y){
    logR=0.5*Math.log(y*y+x*x);
    phi=Math.atan2(y,x);
    xImage=0;
    yImage=0;
    uImage=0;
    vImage=0;
}

// precompute powers (exponents) for r and sine and cosine for phi
function imagePowers(rPower,phiPower){
    var rk=fExp(rPower*logR);
    rkCosPhi=rk*fCos(phiPower*phi);
    rkSinPhi=rk*fSin(phiPower*phi);
}

function xImageAdd(a,b){
    xImage+=a*rkCosPhi+b*rkSinPhi;
}

function yImageAdd(a,b){
    yImage+=a*rkCosPhi+b*rkSinPhi;
}

function uImageAdd(a,b){
    uImage+=a*rkCosPhi+b*rkSinPhi;
}

function vImageAdd(a,b){
    vImage+=a*rkCosPhi+b*rkSinPhi;
}

function mapping(x,y){
    imageZero(x,y);
    imagePowers(3,6);
    xImageAdd(1,0);
    yImageAdd(0,1);
    imagePowers(1,1);
    uImageAdd(1,0);
    vImageAdd(0,1);
}