
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
    wImage=0;
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

function wImageAdd(a,b){
    wImage+=a*rkCosPhi+b*rkSinPhi;
}


function imageAdd(a,b,c,d,rPower,phiPower){
    var rk=fExp(rPower*logR);
    var rkCosPhi=rk*fCos(phiPower*phi);
    var rkSinPhi=rk*fSin(phiPower*phi);
    xImage+=a*rkCosPhi+b*rkSinPhi;
    yImage+=c*rkCosPhi+d*rkSinPhi;
}

function mapping(x,y){
     imageZero(x,y);
    imagePowers(3,6);
    xImageAdd(1,0);
    yImageAdd(0,1);
    imagePowers(3,3);
    wImageAdd(1,0);
}


