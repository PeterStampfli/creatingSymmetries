"use strict"

//  create the distorted symmetric image
//==========================================================


// For each pixel (i,j) of the output image we define a point (x,y) in space by
// applying an offset and a scaling to i and j .
// The offset and the scaling are changed by dragging the mouse on the ouput image 
// and by turning the mouse wheel.
// Then a function mapping(x,y) gives image point coordinates (xImage,yImage).
// The coordinates are put in the mapX and mapY arrays.
// The mapping (x,y)->(xImage,yImage) defines the symmetries of the image
// an addional function wImage(x,y) modifies the color (two-color symmetry)

var xImage=0;
var yImage=0;
var uImage=0;
var vImage=0;
var colorSector=0;
var colorAmplitude=0;
var transWidth=0;
var transSmoothing=0;

// the different color symmetries,choose ..

// colorAmplitude: d<0 - background, d>1 imagecolor (transformed), 0<d<1 - interpolation between background color and pixel color
// full amplitude everywhere for transWidth<0
function makeColorAmplitude(d){
    if (transWidth<0){
        colorAmplitude=1;
    }
    else {
        colorAmplitude=Math.max(0,(Math.abs(d)-transWidth)/transSmoothing);
    }
}

// two color symmetry, depending only on u
function make2ColorSymmetry(){
    if (uImage>0){
        colorSector=0;
    }
    else {
        colorSector=1;
    }
    makeColorAmplitude(uImage);
}

// three color symmetry, transitions at angles 0,120 and 240 degrees
function make3ColorSymmetry(){
    if (uImage>0){
        if (vImage>0){
            colorSector=0;
            if (uImage>2*(transWidth+transSmoothing)) {
                makeColorAmplitude(vImage);
            }
            else {
                makeColorAmplitude(Math.min(vImage,RT3HALF*uImage+0.5*vImage));
            }
        }
        else {
            colorSector=2;
            if (uImage>2*(transWidth+transSmoothing)) {
                makeColorAmplitude(-vImage);
            }
            else {
                makeColorAmplitude(Math.min(-vImage,RT3HALF*uImage-0.5*vImage));
            }        
        }
    }
    else {
        var d;
        if (vImage>0){
            d=RT3HALF*uImage+0.5*vImage;
            if (d>0){
                colorSector=0;
            }
            else {
                colorSector=1;
            }
        }
        else {
            d=RT3HALF*uImage-0.5*vImage;
            if (d>0){
                colorSector=2;
            }
            else {
                colorSector=1;
            }           
        }
        makeColorAmplitude(d);
    }
}

// 4 color symmetry, transitions near the x- ynd y- axis, whatever is closer
function make4ColorSymmetry(){
    if (uImage>0){
        if (vImage>0){
            colorSector=0;
            makeColorAmplitude(Math.min(uImage,vImage));
        }
        else {
            colorSector=3;
            makeColorAmplitude(Math.min(uImage,-vImage));
        }
    }
    else {
        if (vImage>0){
            colorSector=1;
            makeColorAmplitude(Math.min(-uImage,vImage));
        }
        else {
            colorSector=2;
            makeColorAmplitude(Math.min(-uImage,-vImage));
        }
    }
}

// default
var makeColorSymmetry=make2ColorSymmetry;

function makeMapTables() {
    // local variables and references to speed up access
    var locMapOffsetI=Math.floor(mapOffsetI)+0.5;
    var locMapOffsetJ=Math.floor(mapOffsetJ)+0.5;
    var locMapScale=mapScale;
    var locMapX=mapX;
    var locMapY=mapY;
    var locMapU=mapU;
    var locMapV=mapV;
     //  this mapping function has to be defined depending on the desired image
    var locMapping=mapping;
    // do each pixel and store result of mapping
    startMapping();
    var i,j;
    var x=0;
    var y=0;
    var index=0;
    for (j=0;j<mapHeight;j++){
        y=(j-locMapOffsetJ)*locMapScale;
        for (i=0;i<mapWidth;i++){
            x=(i-locMapOffsetI)*locMapScale;
            locMapping(x,y);
            locMapX[index] = xImage;
            locMapY[index] = yImage; 
            locMapU[index]=uImage; 
            locMapV[index++]=vImage; 
        }
    }
}


// The image point coordinates (xImage,yImage) are not directly addresses for the pixels of the input image.

// For each output pixel we look up (xImage,yImage).
// Color inversion symmetry depends on these coordinates. It may change their values.
// Then the coordinates are rotated, scaled and translated. This can be adjusted by dragging the mouse on the 
// two lower control panels and rotating the mouse wheel.
// With the transformed coordinates and pixel interpolation we get a color from the input image.
// For color inversion symmetry this color can be changed.
// Finally, we use the color for the output pixel.

// choice of color modification, default simple color symmetry
var nColorMod=0;
var modifyColors;
var inputScaleCos,inputScaleSin,inputCenterX,inputCenterY;

function doOnePixel(xMap,yMap,uMap,vMap){
    var x = inputScaleCos * xMap - inputScaleSin * yMap + inputCenterX;
    var y = inputScaleSin * xMap + inputScaleCos * yMap + inputCenterY;
    //  get the interpolated input pixel color components, write on output pixels
    // if colorAmplitude<0: background color 
    pixelInterpolation(x, y, inputData);
       // modify color if not outside input image
        if (pixelRed>=0){
            uImage=uMap;
            vImage=vMap;
            makeColorSymmetry();


            modifyColors(colorSector);

            if ((nColorMod>0)&&(colorAmplitude<1)){
                pixelRed=(1-colorAmplitude)*outsideRed+colorAmplitude*pixelRed;
                pixelGreen=(1-colorAmplitude)*outsideGreen+colorAmplitude*pixelGreen;
                pixelBlue=(1-colorAmplitude)*outsideBlue+colorAmplitude*pixelBlue;
            }
        }
        else {
            pixelRed=outsideRed;
            pixelGreen=outsideGreen;
            pixelBlue=outsideBlue;
        }

    // mark the reference image pixel, make it fully opaque
    x = Math.round(scaleInputToReference * x);
    y = Math.round(scaleInputToReference * y);
    // but check if we are on the reference canvas
    if ((x >= 0) && (x < referenceWidth) && (y >= 0) && (y < referenceHeight)) {
        referencePixels[4 * (referenceWidth * y + x) + 3] = 255;
    }
}


function basicDrawing(){
	if (!inputLoaded){	
		return;
	}

	// make the reference image semitransparent
	setAlphaReferenceImagePixels(128);
	// make the symmetries on the output image
    // setting up the parameters for the transformation of the image coordinates
    inputCenterX = referenceCenterX / scaleInputToReference;
    inputCenterY = referenceCenterY / scaleInputToReference;
    //  scaling and rotation: transformation matrix elements
    inputScaleCos = scaleOutputToInput * cosAngle;
    inputScaleSin = scaleOutputToInput * sinAngle;
    // make local references to speed up things
    // local reference to the mapping table
    var locMapX = mapX;
    var locMapY = mapY;
    var locMapU=mapU;
    var locMapV=mapV;
     var locOutputPixels=outputPixels;
    // get the colors for each output pixel
    var outputIndex=0;
    var mapIndex=0;
    var mapSize=mapX.length;
    var xMap,yMap,x,y;
    var colorAmplitude;
    for (mapIndex=0;mapIndex<mapSize;mapIndex++){
        // translation, rotation and scaling
        doOnePixel(locMapX[mapIndex],locMapY[mapIndex],locMapU[mapIndex],locMapV[mapIndex]);

        locOutputPixels[outputIndex++]=pixelRed;
        locOutputPixels[outputIndex++]=pixelGreen;
        locOutputPixels[outputIndex]=pixelBlue;
        outputIndex += 2;
    }
	// put the image on the output canvas
    outputImage.putImageData(outputData,0, 0);
	// put the reference image
    referenceImage.putImageData(referenceData, 0, 0);
    progressDiv.innerHTML="Done. No smoothing. Interpolation "+interpolation+". Color modification "+colorMod+".";

}


function smoothedDrawing(){
    if (!inputLoaded){  
        return;
    }

    var h=progressDiv.height;

    // make the reference image semitransparent
    setAlphaReferenceImagePixels(128);
    // make the symmetries on the output image
    // setting up the parameters for the transformation of the image coordinates
    inputCenterX = referenceCenterX / scaleInputToReference;
    inputCenterY = referenceCenterY / scaleInputToReference;
    //  scaling and rotation: transformation matrix elements
    inputScaleCos = scaleOutputToInput * cosAngle;
    inputScaleSin = scaleOutputToInput * sinAngle;
    // make local references to speed up things
    // local reference to the mapping table
    var locMapX = mapX;
    var locMapY = mapY;
    var locMapU=mapU;
    var locMapV=mapV;
    var locOutputPixels=outputPixels;
    // get the colors for each output pixel
    var outputIndex=0;
    var mapIndex=0;
    var mapSize=mapX.length;
    var xMap,yMap,x,y;
    var colorAmplitude;
 

    var i,j;
    var x=0;
    var y=0;
    var index=0;
    var pixSumRed,pixSumGreen,pixSumBlue;
    var mapIndexPlusX,mapIndexPlusY,mapIndexPlusXY;
    var x0,y0,u0,v0;
    for (j=0;j<mapHeight;j++){
        for (i=0;i<mapWidth;i++){
            mapIndexPlusX=mapIndex;
            mapIndexPlusY=mapIndex;
            mapIndexPlusXY=mapIndex;
            if (i<mapWidth-1){
                mapIndexPlusX++;
                mapIndexPlusXY++;
            }    
            if (j<mapHeight-1){
                mapIndexPlusY+=mapWidth;
                mapIndexPlusXY+=mapWidth;
            }
            
            x0=locMapX[mapIndex];
            y0=locMapY[mapIndex];
            u0=locMapU[mapIndex];
            v0=locMapV[mapIndex];

            doOnePixel(x0,y0,u0,v0);
            pixSumRed=pixelRed;
            pixSumGreen=pixelGreen;
            pixSumBlue=pixelBlue;

            doOnePixel(0.5*(x0+locMapX[mapIndexPlusX]),
                        0.5*(y0+locMapY[mapIndexPlusX]),
                        0.5*(u0+locMapU[mapIndexPlusX]),
                        0.5*(v0+locMapV[mapIndexPlusX]));

            pixSumRed+=pixelRed;
            pixSumGreen+=pixelGreen;
            pixSumBlue+=pixelBlue;


 
            doOnePixel(0.5*(x0+locMapX[mapIndexPlusY]),
                        0.5*(y0+locMapY[mapIndexPlusY]),
                        0.5*(u0+locMapU[mapIndexPlusY]),
                        0.5*(v0+locMapV[mapIndexPlusY]));


            pixSumRed+=pixelRed;
            pixSumGreen+=pixelGreen;
            pixSumBlue+=pixelBlue;


 
            doOnePixel(0.5*(x0+locMapX[mapIndexPlusXY]),
                        0.5*(y0+locMapY[mapIndexPlusXY]),
                        0.5*(u0+locMapU[mapIndexPlusXY]),
                        0.5*(v0+locMapV[mapIndexPlusXY]));



            pixSumRed+=pixelRed;
            pixSumGreen+=pixelGreen;
            pixSumBlue+=pixelBlue;


            pixelRed=Math.round(0.25*pixSumRed);
            pixelGreen=Math.round(0.25*pixSumGreen);
            pixelBlue=Math.round(0.25*pixSumBlue);


            locOutputPixels[outputIndex++]=pixelRed;
            locOutputPixels[outputIndex++]=pixelGreen;
            locOutputPixels[outputIndex]=pixelBlue;
            outputIndex += 2;
            mapIndex++;
        }
    }
    // put the image on the output canvas
    outputImage.putImageData(outputData,0, 0);
    // put the reference image
    referenceImage.putImageData(referenceData, 0, 0);
    progressDiv.innerHTML="Done. 2 x 2 smoothing. Interpolation "+interpolation+". Color modification "+colorMod+".";
}

var drawing=basicDrawing;

