"use strict";

//  copy a pixel using nearest neighbor
//  x, y are coordinates of pixel in input image data (pixels)
// outPixels is the output image data (pixels)
// outIndex is the index of red component of the pixel to write
//  inPixels is the input image data (pixels), inWidth,inHeight the dimensions

// out of border coordinates give nearest border pixel
function copyPixNearest(x,y,outPixels,outIndex,inPixels,inWidth,inHeight){
	var h=Math.max(0,Math.min(inWidth,Math.round(x)));
	var k=Math.max(0,Math.min(inHeight,Math.round(y)));
	var inIndex=4*(inWidth*k+h);
	outPixels[outIndex++]=inPixels[inIndex++];   //red
	outPixels[outIndex++]=inPixels[inIndex++];   // green
	outPixels[outIndex]=inPixels[inIndex];       // blue, no alpha
}

//  linear interpolation
function copyPixLinear(x,y,outPixels,outIndex,inPixels,inWidth,inHeight){
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
	outPixels[outIndex++]=f00*inPixels[i00++]+f10*inPixels[i10++]+f01*inPixels[i01++]+f11*inPixels[i11++];
	outPixels[outIndex++]=f00*inPixels[i00++]+f10*inPixels[i10++]+f01*inPixels[i01++]+f11*inPixels[i11++];
	outPixels[outIndex]=f00*inPixels[i00]+f10*inPixels[i10]+f01*inPixels[i01]+f11*inPixels[i11];		
}

//  cubic interpolation
function copyPixCubic(x,y,outPixels,outIndex,inPixels,inWidth,inHeight){
	
	var h=Math.floor(x);
	var dx=x-h;
	var k=Math.floor(y);
	var dy=y-k;
	
	//  the various vertical positions
	var j0=k;
	var jm=j0-1;
	var j1=j0+1;
	var j2=j0+2;
	// too low
	if (jm<0){
		jm=0;
		j0=Math.max(0,j0);
		j1=Math.max(0,j1);
		j2=Math.max(0,j2);
	}
	else if (j2>=inHeight){   // to high
		j2=inHeight-1;
		j1=Math.min(j1,inHeight-1);
		j0=Math.min(j1,inHeight-1);
		jm=Math.min(j1,inHeight-1);
	}
	jm*=4*inWidth;
	j0*=4*inWidth;
	j1*=4*inWidth;
	j2*=4*inWidth;
	// the various horizontal positions
	var i0=h;
	var im=i0-1;
	var i1=i0+1;
	var i2=i0+2;
	// too low
	if (im<0){
		im=0;
		i0=Math.max(0,i0);
		i1=Math.max(0,i1);
		i2=Math.max(0,i2);
	}
	else if (i2>=inWidth) {    // too high
		i2=inWidth-1;
		i1=Math.min(i1,inWidth-1);
		i0=Math.min(i0,inWidth-1);
		im=Math.min(im,inWidth-1);
	}
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



	
}
