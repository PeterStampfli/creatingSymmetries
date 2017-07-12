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

// color inversion: keep the grey part, invert only the hue
function improvedColorInversion(colorSector){
    if (colorSector==1){
        var pixMaxMin=Math.max(pixelRed,pixelGreen,pixelBlue)+Math.min(pixelRed,pixelGreen,pixelBlue);
        pixelRed=pixMaxMin-pixelRed;
        pixelGreen=pixMaxMin-pixelGreen;
        pixelBlue=pixMaxMin-pixelBlue;   
    } 
}

// cyclic color rotation of rgb components
function threeColorRotation(colorSector){
    if (colorSector==1){
        var h=pixelRed;
        pixelRed=pixelBlue;
        pixelBlue=pixelGreen;
        pixelGreen=h;
    }
    else if (colorSector==2){
        var h=pixelRed;
        pixelRed=pixelGreen;
        pixelGreen=pixelBlue;
        pixelBlue=h;
    }
}

// analyzing and composing color using grey part, hue and color intensity 
var hue,colorIntensity,grey;

// analyze color
// get grey, colorIntensity and hue from standard rgb
// hue =0 for red, 2 for green and 4 for blue
function higFromRgb(){
    // get and subtract grey 
    // integer grey between 0 and 255
    grey=Math.min(pixelRed,pixelGreen,pixelBlue);
    pixelRed-=grey;
    pixelGreen-=grey;
    pixelBlue-=grey;
    // analyze color part, integer pixels!
    // integer color intensity between 0 and 255
    // float hue between 0 and 6
    // javascript always makes float division
    if ((pixelRed>=pixelGreen)&&(pixelRed>=pixelBlue)){   // going from magenta to red to yellow
        if (pixelRed>0){
            colorIntensity=pixelRed;
            hue=(pixelGreen>pixelBlue)?pixelGreen/pixelRed:6-pixelBlue/pixelRed;
        }
        else {
            colorIntensity=0;
            hue=0;
        }
    }
    else if((pixelGreen>=pixelRed)&&(pixelGreen>=pixelBlue)){    // going from yellow to green to cyan
        colorIntensity=pixelGreen;
        hue=(pixelBlue>pixelRed)?2+pixelBlue/pixelGreen:2 -pixelRed/pixelGreen;
    }
    else {                                                   // going from cyan to blue to magenta
        colorIntensity=pixelBlue;
        hue=(pixelRed>pixelGreen)?4+pixelRed/pixelBlue:4-pixelGreen/pixelBlue;
    }
}

// compose color
// standard rgb color from hig, hue goes from 0 to 6
function rgbFromHig(){
    hue=hue-6*Math.floor(hue/6);   //reduce to range 0..6
    var intHue=Math.floor(hue);
    hue-=intHue;
    switch(intHue){
        case 0: // red to yellow
            pixelRed=colorIntensity;
            pixelGreen=colorIntensity*hue;
            pixelBlue=0;
            break;
        case 1: // yellow to green
            pixelRed=colorIntensity*(1-hue);
            pixelGreen=colorIntensity;
            pixelBlue=0;
            break;
        case 2: // green to cyan
            pixelRed=0;
            pixelGreen=colorIntensity;
            pixelBlue=colorIntensity*hue;
            break;
        case 3: // cyan to blue
            pixelRed=0;
            pixelGreen=colorIntensity*(1-hue);
            pixelBlue=colorIntensity;
            break;
        case 4: // blue to magenta
            pixelRed=colorIntensity*hue;
            pixelGreen=0;
            pixelBlue=colorIntensity;
            break;
        case 5: // magenta to red
            pixelRed=colorIntensity;
            pixelGreen=0;
            pixelBlue=colorIntensity*(1-hue);
            break;
   }
    pixelRed+=grey;
    pixelGreen+=grey;
    pixelBlue+=grey;
}

// color rotation by hue shift
function shiftRgbHue(shift){
    higFromRgb();
    hue+=shift;
    rgbFromHig();
}


// transform hue without changing colors
// hue from rgb with range 0...6 to hue of rygb with range 0...8
function rygbFromRgb(){
    hue=hue-6*Math.floor(hue/6);   //reduce to range 0..6
    if (hue>2){
        hue+=2;
    }
    else {
        hue*=2;
    }
}


// compose color, red, yellow, green and blue as basic colors
//  rygb color from hig, hue goes from 0 to 8
function rygbFromHig(){
    hue=hue-8*Math.floor(hue/8);   //reduce to range 0..8
    var intHue=Math.floor(hue);
    hue-=intHue;
    intHue=intHue%8;
    if (intHue<0) {
        intHue+=8;
    }
    switch(intHue){
        case 0:                          // red to orange                    
            pixelRed=colorIntensity;
            pixelGreen=colorIntensity*hue*0.5;
            pixelBlue=0;
            break;
        case 1:                          // orange to yellow
            pixelRed=colorIntensity;
            pixelGreen=colorIntensity*(hue+1)*0.5;
            pixelBlue=0;
            break;
        case 2:                          // yellow to yellowish green
            pixelRed=colorIntensity*(2-hue)*0.5;
            pixelGreen=colorIntensity;
            pixelBlue=0;
            break;
        case 3:                          // yellowisch green to green
            pixelRed=colorIntensity*(1-hue)*0.5;
            pixelGreen=colorIntensity;
            pixelBlue=0;
            break;
        case 4:                          // green to cyan
            pixelRed=0;
            pixelGreen=colorIntensity;
            pixelBlue=colorIntensity*hue;
            break;
        case 5:                          // cyan to blue
            pixelRed=0;
            pixelGreen=colorIntensity*(1-hue);
            pixelBlue=colorIntensity;
            break;
        case 6:                          // blue to magenta
            pixelRed=colorIntensity*hue;
            pixelGreen=0;
            pixelBlue=colorIntensity;
            break;
        case 7:                          // magenta to red
            pixelRed=colorIntensity;
            pixelGreen=0;
            pixelBlue=colorIntensity*(1-hue);
            break;
   }
    pixelRed+=grey;
    pixelGreen+=grey;
    pixelBlue+=grey;
}


// color rotation by hue shift, four basic colors red, yellow, green and blue
function shiftRygbHue(shift){
    higFromRgb();
    //console.log("rgb "+hue);
    rygbFromRgb();
     // console.log("rygb "+hue);
   hue+=shift;
   //console.log(hue);
    rygbFromHig();
}


//  modification of colors for 2-color symmetry
function modify2ColorSymmetry(colorSector){
    switch (nColorMod){
        case 1: simpleColorInversion(colorSector);
            break;
        case 2: improvedColorInversion(colorSector);
            break;
    }
}

//  modification of colors for 3-color symmetry
function modify3ColorSymmetry(colorSector){
  switch (nColorMod){
        case 1: threeColorRotation(colorSector);
            break;
        case 2: if (colorSector!=0) shiftRgbHue(colorSector*2);
            break;
    }
}

//  modification of colors for 3-color symmetry
function modify4ColorSymmetry(colorSector){
    pixelRed=255;
    pixelGreen=0;
    pixelBlue=0;
    switch (nColorMod){
        case 1: shiftRgbHue(2*colorSector);
            break;
        case 2: shiftRygbHue(colorSector);
            break;
    }
}

//  modification of colors for 2-color symmetry
function test2ColorSymmetry(colorSector){
    pixelRed=255;
    pixelGreen=0;
    pixelBlue=0;
    if (colorSector==1){
        simpleColorInversion(1);
    }
}

function chooseColorSymmetry(){
    if (nColors==2){
        modifyColors=modify2ColorSymmetry;
        makeColorSymmetry=make2ColorSymmetry;
    }

    if (nColors==3){
        modifyColors=modify3ColorSymmetry;
        makeColorSymmetry=make3ColorSymmetry;
    }

    if (nColors==4){
        modifyColors=modify4ColorSymmetry;
        makeColorSymmetry=make4ColorSymmetry;
    }
}

// the replacement background color for outside pixels
var outsideRed = 40;
var outsideGreen = 40;
var outsideBlue = 40;

// width for background color between color sectors
transWidth=0.0001;
// width of smoothing between background and image
transSmoothing=0.00002;