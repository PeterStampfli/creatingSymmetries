"use strict";

// changing the color according to the colorposition
// depending on number of different color variants
function ColorSymmetry(numberOfVariants){


	this.transWidth=-1;
	this.transSmoothing=1;

	switch (numberOfVariants){
		case 2:
			this.makeSymmetry=this.make2ColorSymmetry;
			break;
	}
}

/*
make color amplitude:
d<0 - background, d>1 imagecolor (transformed), 0<d<1 - interpolation between background color and pixel color
 full amplitude everywhere for transWidth<0
*/
ColorSymmetry.prototype.colorAmplitude=function(d){
	if (this.transWidth<0){
        return 1;
    }
    else {
        return Math.max(0,(Math.abs(d)-this.transWidth)/this.transSmoothing);
    }
}

/*
make 2-color symmetry depending on x-coordinate of color position
*/
ColorSymmetry.prototype.make2ColorSymmetry=function(color,colorPosition){
	// change color if in the changing section
    if (colorPosition.x<0){
        switch (nColorMod){
        	case 1:
        		color.simpleInversion();
        		break;
        	case 2: 
        		color.improvedInversion();
        }
    }
    // transition region (for no color symmetry too)
    color.fromBackground(this.colorAmplitude(colorPosition.x));

}

/*
make 3-color symmetry depending on the full color position
*/
ColorSymmetry.prototype.make3ColorSymmetry=function(color,colorPosition){
    if (colorPosition.x>0){
        if (colorPosition.y>0){
            // no change in color, only transition
            if (uImage>2*(this.transWidth+this.transSmoothing)) {
            	color.fromBackground(this.colorAmplitude(colorPosition.y));
            }
            else {
                makeColorAmplitude(Math.min(vImage,(0.8660*uImage+0.5*vImage));
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