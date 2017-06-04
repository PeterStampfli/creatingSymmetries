"use strict";

/* functions for getting interpolated pixels from an image data object (inData)
 *==============================================================================
 * 
 * inData is the ImageData object for the input image
 * 
 * outIndex is the integer index of the red component of the pixel 
 *          we have to write in outPixels image data
 * 
 * x,y      are the float coordinates of the pixel to read from inPixels image data
 *          if these coordinates lie outside, then the red component is set to -1
 */ 
 
// define quality dependent pixel interpolation
var pixelInterpolation = pixelInterpolationNearest;

// the colors of the pixel, for fast manipulation, and for color symmetries
// integer values between 0 and 255
// pixelRed=-1 for a point lying outside the input image
var pixelRed;    
var pixelGreen;
var pixelBlue;

// nearest neighbor
function pixelInterpolationNearest(x, y, inData) {
    // local variables for fast access
    var inPixels = inData.data;
    var inWidth = inData.width;
    var inHeight = inData.height;
    //  rounded coordinates
    //  catch the case that the point is outside, we use there a solid color
    // with a small safety margin
    var h = Math.round(x);
    var k = Math.round(y);
    if ((h<1)||(h+2>=inWidth)||(k<1)||(k+2>=inHeight)){
    	pixelRed = -1;
        return;
    }
    var inIndex = 4 * (inWidth * k + h);
    pixelRed = inPixels[inIndex++]; //red
    pixelGreen = inPixels[inIndex++]; // green
    pixelBlue = inPixels[inIndex]; // blue, no alpha
}

//  linear interpolation
function pixelInterpolationLinear(x, y, inData) {
    // local variables for fast access
    var inPixels = inData.data;
    var inWidth = inData.width;
    var inHeight = inData.height;
    //  coordinates of base pixel
    var h = Math.floor(x);
    var k = Math.floor(y);
     //  catch the case that the point is outside, we use there a solid color
    if ((h<1)||(h+2>=inWidth)||(k<1)||(k+2>=inHeight)){
    	pixelRed = -1;
        return;
    }
    var dx = x - h;
    var dy = y - k;
    var i00, i01, i10, i11;
    var f00, f01, f10, f11;
    // the indices to pixel data
    i00 = 4*(h+inWidth*k);
    i01 = i00+4*inWidth;
    i10 = i00+4;
    i11 = i01+4;
    //  the weights
    f00 = (1 - dx) * (1 - dy);
    f01 = (1 - dx) * dy;
    f10 = dx * (1 - dy);
    f11 = dy * dx;
    pixelRed = Math.round(f00 * inPixels[i00++] + f10 * inPixels[i10++] + f01 * inPixels[i01++] + f11 * inPixels[i11++]);
    pixelGreen = Math.round(f00 * inPixels[i00++] + f10 * inPixels[i10++] + f01 * inPixels[i01++] + f11 * inPixels[i11++]);
    pixelBlue = Math.round(f00 * inPixels[i00] + f10 * inPixels[i10] + f01 * inPixels[i01] + f11 * inPixels[i11]);
}

//  the kernel function for cubic interpolation
function mitchellNetrovalli(x) { // Mitchell-Netrovali, B=C=0.333333, 0<x<2
    if (x < 1) {
        return (1.16666 * x - 2) * x * x + 0.888888;
    }
    return ((2 - 0.388888 * x) * x - 3.33333) * x + 1.777777;
}

//  cubic interpolation
function pixelInterpolationCubic(x, y, inData) {
    // local variables for fast access
    var inPixels = inData.data;
    var inWidth = inData.width;
    var inHeight = inData.height;
    //  coordinates of base pixel
    var h = Math.floor(x);
    var k = Math.floor(y);
    if ((h<1)||(h+2>=inWidth)||(k<1)||(k+2>=inHeight)){
    	pixelRed = -1;
        return;
    }
    var dx = x - h;
    var dy = y - k;
    // the factorized weight function
    var kernel = mitchellNetrovalli;
    // y (vertical position) dependent values
    var kym = kernel(1 + dy);
    var ky0 = kernel(dy);
    var ky1 = kernel(1 - dy);
    var ky2 = kernel(2 - dy);
    // x (horizontal position) dependent values, sweeping in x-direction
    var kx;
    // combined indices, for different heights at same x-position
    var indexM, index0, index1, index2;
    var inWidth4=inWidth*4;
    // the first column
    index0 = inWidth4 * k +4*(h-1);
    indexM = index0-inWidth4;
    index1 = index0+inWidth4;
    index2 = index1+inWidth4;
    kx = kernel(1 + dx);
    var red = kx * (kym * inPixels[indexM++] + ky0 * inPixels[index0++] + ky1 * inPixels[index1++] + ky2 * inPixels[index2++]);
    var green = kx * (kym * inPixels[indexM++] + ky0 * inPixels[index0++] + ky1 * inPixels[index1++] + ky2 * inPixels[index2++]);
    var blue = kx * (kym * inPixels[indexM] + ky0 * inPixels[index0] + ky1 * inPixels[index1] + ky2 * inPixels[index2]);
    // the second column, just at the left of (x,y), skipping alpha
    indexM +=2;
    index0 +=2;
    index1 +=2;
    index2 +=2;
    kx = kernel(dx);
    red += kx * (kym * inPixels[indexM++] + ky0 * inPixels[index0++] + ky1 * inPixels[index1++] + ky2 * inPixels[index2++]);
    green += kx * (kym * inPixels[indexM++] + ky0 * inPixels[index0++] + ky1 * inPixels[index1++] + ky2 * inPixels[index2++]);
    blue += kx * (kym * inPixels[indexM] + ky0 * inPixels[index0] + ky1 * inPixels[index1] + ky2 * inPixels[index2]);
    //  the third column, just at the right of (x,y)
    indexM +=2;
    index0 +=2;
    index1 +=2;
    index2 +=2;
    kx = kernel(1 - dx);
    red += kx * (kym * inPixels[indexM++] + ky0 * inPixels[index0++] + ky1 * inPixels[index1++] + ky2 * inPixels[index2++]);
    green += kx * (kym * inPixels[indexM++] + ky0 * inPixels[index0++] + ky1 * inPixels[index1++] + ky2 * inPixels[index2++]);
    blue += kx * (kym * inPixels[indexM] + ky0 * inPixels[index0] + ky1 * inPixels[index1] + ky2 * inPixels[index2]);
    // the forth column
    indexM +=2;
    index0 +=2;
    index1 +=2;
    index2 +=2;
    kx = kernel(2 - dx);
    red += kx * (kym * inPixels[indexM++] + ky0 * inPixels[index0++] + ky1 * inPixels[index1++] + ky2 * inPixels[index2++]);
    green += kx * (kym * inPixels[indexM++] + ky0 * inPixels[index0++] + ky1 * inPixels[index1++] + ky2 * inPixels[index2++]);
    blue += kx * (kym * inPixels[indexM] + ky0 * inPixels[index0] + ky1 * inPixels[index1] + ky2 * inPixels[index2]);
    // beware of negative values
    pixelRed = Math.max(0, Math.round(red));
    pixelGreen = Math.max(0, Math.round(green));
    pixelBlue = Math.max(0, Math.round(blue));
}
