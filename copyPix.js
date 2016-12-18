"use strict";

/* functions for copying pixels from inputData to outputData image data object
 *==============================================================================
 * 
 * inputData and outputData are ImageData objects
 * where ImageData.data is a byte array of pixel-components, ImageData.width and ImageData.height the length
 * 
 * outIndex is the integer index of the red component of the pixel 
 *          we have to write in outPixels image data
 * 
 * x,y      are the float coordinates of the pixel to read from inPixels image data
 *          if these coordinates lie outside we read the nearest pixel of the border
 */ 
 
// quality dependent pixel interpolation
var copyInterpolation=copyPixNearest;

function setInterpolation(string){
	switch (string){
		case "nearest": copyInterpolation=copyPixNearest;
				   break;
		case "linear": copyInterpolation=copyPixLinear;
				   break;
		case "cubic": copyInterpolation=copyPixCubic;
				   break;		
	}	
	drawing();
}

// nearest neighbor
function copyPixNearest(x,y,outputData,outIndex,inputData){
	// local variables for fast access
	var outPixels=outputData.data;
	var inPixels=inputData.data;
	var inWidth=inputData.width;
	var inHeight=inputData.height;
	//  rounded coordinates
	var h=Math.max(0,Math.min(inWidth-1,Math.round(x)));
	var k=Math.max(0,Math.min(inHeight-1,Math.round(y)));
	var inIndex=4*(inWidth*k+h);
	outPixels[outIndex++]=inPixels[inIndex++];   //red
	outPixels[outIndex++]=inPixels[inIndex++];   // green
	outPixels[outIndex]=inPixels[inIndex];       // blue, no alpha
}

//  linear interpolation
function copyPixLinear(x,y,outputData,outIndex,inputData){
	// local variables for fast access
	var outPixels=outputData.data;
	var inPixels=inputData.data;
	var inWidth=inputData.width;
	var inHeight=inputData.height;
	//  coordinates of base pixel
	var h=Math.floor(x);
	var dx=x-h;
	var k=Math.floor(y);
	var dy=y-k;
	var h0,h1,k0,k1;
	var i00,i01,i10,i11;
	var f00,f01,f10,f11;	
	if (k<0){   // out of the bottom
		k0=0;
		k1=0;
	}
	else if (k>=inHeight-1){   // out of top
		k0=4*inWidth*(inHeight-1);
		k1=k0;
	}
	else {
		k0=4*inWidth*k;
		k1=k0+4*inWidth;
	}
	if (h<0){	// out left
		h0=0;
		h1=0;
	}
	else if (h>=inWidth-1){    // out right
		h0=4*(inWidth-1);
		h1=h0;
	}
	else {
		h0=4*h;
		h1=h0+4;
	}
	i00=h0+k0;
	i01=h0+k1;
	i10=h1+k0;
	i11=h1+k1;
	// now all index points are inside
	// same calculation for all cases
	f00=(1-dx)*(1-dy);
	f01=(1-dx)*dy;
	f10=dx*(1-dy);
	f11=dy*dx;
	outPixels[outIndex++]=Math.round(f00*inPixels[i00++]+f10*inPixels[i10++]+f01*inPixels[i01++]+f11*inPixels[i11++]);
	outPixels[outIndex++]=Math.round(f00*inPixels[i00++]+f10*inPixels[i10++]+f01*inPixels[i01++]+f11*inPixels[i11++]);
	outPixels[outIndex]=Math.round(f00*inPixels[i00]+f10*inPixels[i10]+f01*inPixels[i01]+f11*inPixels[i11]);		
}

//  the kernel function for cubic interpolation
function mitchellNetrovalli(x){   // Mitchell-Netrovali, B=C=0.333333, 0<x<2
	if (x<1){
		return (1.16666*x-2)*x*x+0.888888;
	}
	return ((2-0.388888*x)*x-3.33333)*x+1.777777;				
}

//  cubic interpolation
function copyPixCubic(x,y,outputData,outIndex,inputData){	
	// local variables for fast access
	var outPixels=outputData.data;
	var inPixels=inputData.data;
	var inWidth=inputData.width;
	var inHeight=inputData.height;
	//  coordinates of base pixel
	var h=Math.floor(x);
	var dx=x-h;
	var k=Math.floor(y);
	var dy=y-k;	
	//  the various vertical positions, getting the correct row numbers of pixels
	var j0=k;
	var jm=j0-1;
	var j1=j0+1;
	var j2=j0+2;
	// too low
	if (jm<0){
		jm=0;
		j0=0;
		j1=Math.max(0,j1);
		j2=Math.max(0,j2);
	}
	else if (j2>=inHeight){   // to high
		j2=inHeight-1;
		j1=inHeight-1;
		j0=Math.min(j1,inHeight-1);
		jm=Math.min(j1,inHeight-1);
	}
	//  transforming pixelrow numbers to indices of the input image data
	jm*=4*inWidth;
	j0*=4*inWidth;
	j1*=4*inWidth;
	j2*=4*inWidth;
	// the various horizontal positions (column numbers of pixels)
	var i0=h;
	var im=i0-1;
	var i1=i0+1;
	var i2=i0+2;
	// too low
	if (im<0){
		im=0;
		i0=0;
		i1=Math.max(0,i1);
		i2=Math.max(0,i2);
	}
	else if (i2>=inWidth) {    // too high
		i2=inWidth-1;
		i1=inWidth-1;
		i0=Math.min(i0,inWidth-1);
		im=Math.min(im,inWidth-1);
	}
	//  transforming column numbers to indices to input image data
	im*=4;
	i0*=4;
	i1*=4;
	i2*=4;
	// combined indices, for different heights at same x-position
	var indexM,index0,index1,index2;
	// the factorized weight function
	var kernel=mitchellNetrovalli;
	// y (vertical position) dependent values
	var kym=kernel(1+dy);
	var ky0=kernel(dy);
	var ky1=kernel(1-dy);
	var ky2=kernel(2-dy);
	// x (horizontal position) dependent values, sweeping in x-direction
	var kx;
	// color summation in parts
	var red,green,blue;
	// the first column
	indexM=jm+im;
	index0=j0+im;
	index1=j1+im;
	index2=j2+im;
	kx=kernel(1+dx);
	red=kx*(kym*inPixels[indexM++]+ky0*inPixels[index0++]+ky1*inPixels[index1++]+ky2*inPixels[index2++]);
	green=kx*(kym*inPixels[indexM++]+ky0*inPixels[index0++]+ky1*inPixels[index1++]+ky2*inPixels[index2++]);
	blue=kx*(kym*inPixels[indexM]+ky0*inPixels[index0]+ky1*inPixels[index1]+ky2*inPixels[index2]);
	// the second column, just at the left of (x,y)
	indexM=jm+i0;
	index0=j0+i0;
	index1=j1+i0;
	index2=j2+i0;
	kx=kernel(dx);
	red+=kx*(kym*inPixels[indexM++]+ky0*inPixels[index0++]+ky1*inPixels[index1++]+ky2*inPixels[index2++]);
	green+=kx*(kym*inPixels[indexM++]+ky0*inPixels[index0++]+ky1*inPixels[index1++]+ky2*inPixels[index2++]);
	blue+=kx*(kym*inPixels[indexM]+ky0*inPixels[index0]+ky1*inPixels[index1]+ky2*inPixels[index2]);
	//  the third column, just at the right of (x,y)
	indexM=jm+i1;
	index0=j0+i1;
	index1=j1+i1;
	index2=j2+i1;
	kx=kernel(1-dx);
	red+=kx*(kym*inPixels[indexM++]+ky0*inPixels[index0++]+ky1*inPixels[index1++]+ky2*inPixels[index2++]);
	green+=kx*(kym*inPixels[indexM++]+ky0*inPixels[index0++]+ky1*inPixels[index1++]+ky2*inPixels[index2++]);
	blue+=kx*(kym*inPixels[indexM]+ky0*inPixels[index0]+ky1*inPixels[index1]+ky2*inPixels[index2]);
	// the forth column
	indexM=jm+i2;
	index0=j0+i2;
	index1=j1+i2;
	index2=j2+i2;
	kx=kernel(2-dx);
	red+=kx*(kym*inPixels[indexM++]+ky0*inPixels[index0++]+ky1*inPixels[index1++]+ky2*inPixels[index2++]);
	green+=kx*(kym*inPixels[indexM++]+ky0*inPixels[index0++]+ky1*inPixels[index1++]+ky2*inPixels[index2++]);
	blue+=kx*(kym*inPixels[indexM]+ky0*inPixels[index0]+ky1*inPixels[index1]+ky2*inPixels[index2]);
	// beware of negative values
	outPixels[outIndex++]=Math.max(0,Math.round(red));
	outPixels[outIndex++]=Math.max(0,Math.round(green));
	outPixels[outIndex]=Math.max(0,Math.round(blue));
}
