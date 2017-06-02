// color inversion
// simplest type of color change, overwrite if you want something better
function simpleColorInversion(colorSector,colorAmplitude){
    if (u<-transWidth){
        pixelRed=255-pixelRed;
        pixelGreen=255-pixelGreen;
        pixelBlue=255-pixelBlue;  
    }  
    else if(u<transWidth){
        var x=0.5*(1-u/transWidth);
        pixelRed=x*(255-pixelRed)+(1-x)*pixelRed;
        pixelGreen=x*(255-pixelGreen)+(1-x)*pixelGreen;
        pixelBlue=x*(255-pixelBlue)+(1-x)*pixelBlue;
    }
}

// color inversion: subtler method

function improvedColorInversion(u,v){
    var pixMaxMin=Math.max(pixelRed,pixelGreen,pixelBlue)+Math.min(pixelRed,pixelGreen,pixelBlue);
    if (u<-transWidth){
        pixelRed=pixMaxMin-pixelRed;
        pixelGreen=pixMaxMin-pixelGreen;
        pixelBlue=pixMaxMin-pixelBlue;   
    } 
        else if(u<transWidth){
        var x=0.5*(1-u/transWidth);
        pixelRed=x*(pixMaxMin-pixelRed)+(1-x)*pixelRed;
        pixelGreen=x*(pixMaxMin-pixelGreen)+(1-x)*pixelGreen;
        pixelBlue=x*(pixMaxMin-pixelBlue)+(1-x)*pixelBlue;
    }
}

// four color rotation
// return 0... 3 for sector numbers, -1 if in transition region

function fourSectors(u,v){
    if (u>transWidth){
        if (v>transWidth){
            return 0;
        }
        else if (v<-transWidth){
            return 3;
        }
        else {
            return -1;
        }
    }
    else if (u<-transWidth){
        if (v>transWidth){
            return 1;
        }
        else if (v<-transWidth){
            return 2;
        }
        else {
            return -1;
        }
    }
    else {
        return -1;
    }
}

// three color rotation
// sectors 0...2, -1 in transition region

function threeSectors(u,v){
    var r=transWidth/0.866;
    if (u>r*0.5){
        if (v>transWidth){
            return 0;
        }
        else if (v<-transWidth){
            return 2;
        }
        else {
            return -1;
        }
    }
    else if (v>0){
        if (v>transWidth+1.732*(0.5*r-u)){
            return 0;
        }
        else if (v>-1.732*(r+u)){
            return -1;
        }
        else {
            return 1;
        }
    }
    else {
       if (v<-transWidth-1.732*(0.5*r-u)){
            return 2;
        }
        else if (v<1.732*(r+u)){
            return -1;
        }
        else {
            return 1;
        }
    }
}

// the replacement background color for outside pixels
var outsideRed = 40;
var outsideGreen = 40;
var outsideBlue = 40;

// width for background color between color sectors
transWidth=0.1;
// width of smoothing between background and image
transSmoothing=0.02;

makeColorSymmetry=make2ColorSymmetry;


// modifyColors= ....
modifyColors=test4;

function test3(u,v){
    var n=threeSectors(u,v);
    pixelRed=0;
    pixelGreen=0;
    pixelBlue=0;
    if (n==0) pixelRed=255;
    if (n==1) pixelGreen=255;
    if (n==2) pixelBlue=255;
}

function test4(u,v){
    var n=fourSectors(u,v);
    pixelRed=0;
    pixelGreen=0;
    pixelBlue=0;
    if (n==0) pixelRed=255;
    if (n==1) pixelGreen=255;
    if (n==2) pixelBlue=255;
    if (n==3){
        pixelRed=255;
        pixelGreen=255;
    }
}


function threeColorRotation(u,v){
    switch (threeSectors(u,v)){
        case -1: 
            pixelRed=outsideRed;
            pixelGreen=outsideGreen;
            pixelBlue=outsideBlue;
            break;
        case 1:
            var h=pixelRed;
            pixelRed=pixelGreen;
            pixelGreen=pixelBlue;
            pixelBlue=h;
            break;
        case 2:
            var h=pixelRed;
            pixelRed=pixelBlue;
            pixelBlue=pixelGreen;
            pixelGreen=h;
            break;
    };
}


function colorModChoice(colorSector,colorAmplitude){

    switch (nColorMod){
        case 1: simpleColorInversion(colorSector,colorAmplitude);
            break;
  //      case 2: test4(u,v);
   //         break;
    }

}

modifyColors=colorModChoice;