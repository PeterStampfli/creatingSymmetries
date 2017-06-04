"use strict";
// color inversion
// simplest type of color change, overwrite if you want something better
function simpleColorInversion(colorSector){
    if (colorSector==1){
        pixelRed=255-pixelRed;
        pixelGreen=255-pixelGreen;
        pixelBlue=255-pixelBlue; 
    } 
}

// color inversion: subtler method

function improvedColorInversion(colorSector){
    if (colorSector==1){
        var pixMaxMin=Math.max(pixelRed,pixelGreen,pixelBlue)+Math.min(pixelRed,pixelGreen,pixelBlue);
        pixelRed=pixMaxMin-pixelRed;
        pixelGreen=pixMaxMin-pixelGreen;
        pixelBlue=pixMaxMin-pixelBlue;   
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

//  modification of colors for 2-color symmetry
function modify2Colors(colorSector){
    switch (nColorMod){
        case 1: simpleColorInversion(colorSector);
            break;
        case 2: improvedColorInversion(colorSector);
            break;
    }
}

modifyColors=modify2Colors;

makeColorSymmetry=make3ColorSymmetry;


// the replacement background color for outside pixels
var outsideRed = 40;
var outsideGreen = 40;
var outsideBlue = 40;

// width for background color between color sectors
transWidth=0.1;
// width of smoothing between background and image
transSmoothing=0.1;

makeColorSymmetry=make2ColorSymmetry;
