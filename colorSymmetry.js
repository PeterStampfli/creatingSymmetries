"use strict";

// changing the color according to the colorposition
// depending on number of different color variants

/*
transition region between different color modifications:

transWidth is half of the tpotal witdth of the region.
inside the region: backgroundColor
changing to the color of the region on the transSmoothing length by linear interpolation
*/
function ColorSymmetry(numberOfVariants){
	this.transWidth=-1;
	this.transSmoothing=1;
	switch (numberOfVariants){
        case 1:
            this.makeSymmetry=this.noColorSymmetry;
            break;
        case 2:
            this.makeSymmetry=this.make2ColorSymmetry;
            break;
		case 3:
			this.makeSymmetry=this.make3ColorSymmetry;
			break;
		case 4:
			this.makeSymmetry=this.make4ColorSymmetry;
			break;
	}
}

/*
make color transition:
d is the distance from the line separating the different regions.

d>transWidth: color of the region, no change in color
transWidth-transSmoothing<d<transWidth: linear interpolation
d<transwidth-transSmoothing: background color
*/
ColorSymmetry.prototype.transition=function(color,d){
	if (d<this.transWidth){                     // no changes if d is great enough
		d-=this.transWidth-this.transSmoothing;
		if (d<0){                               // background color close to the separation
			color.set(backgroundColor);
		}
		else {
			color.fromBackground(d/this.transSmoothing);
		}
	}
}

/*
no color symmetry (just one single variant), do nothing
*/
ColorSymmetry.prototype.noColorSymmetry=function(color,colorPosition){
}

/*
make 2-color symmetry depending on x-coordinate of color position
*/
ColorSymmetry.prototype.make2ColorSymmetry=function(color,colorPosition){
	var d=colorPosition.x;
	// change color if in the changing section
    if (d<0){
        switch (nColorMod){
        	case 1:
        		color.simpleInversion();
        		break;
        	case 2: 
        		color.improvedInversion();
        		break;
        }
        this.transition(color,-d);
    }
    else {
    	this.transition(color,d);
    }
}

/*
make 3-color symmetry depending on the full color position
*/

ColorSymmetry.prototype.make3ColorSymmetry=function(color,colorPosition){
    if (colorPosition.x>0){
        if (colorPosition.y>0){
            // no change in color, only transition
            if (colorPosition.y<2*this.transWidth){                        // no transition if y large enough
	            if (colorPosition.x>2*this.transWidth) {// transition at x-axis
	            	this.transition(color,colorPosition.y);
	            }
	            else {
	                this.transition(color,Math.min(colorPosition.y,
	                						0.8660*colorPosition.x+0.5*colorPosition.y));
          		}
       		}
        }
        else {
            if (nColorMod>0) color.inverseRotation();
            if (colorPosition.y>-2*this.transWidth) {
	            if (colorPosition.x>2*this.transWidth) {
	            	this.transition(color,-colorPosition.y);
	            }
	            else {
	                this.transition(color,Math.min(-colorPosition.y,
	                						0.8660*colorPosition.x-0.5*colorPosition.y));
	            }   
            }     
        }
    }
    else {
        var d;
        if (colorPosition.y>0){
            d=0.8660*colorPosition.x+0.5*colorPosition.y;    // distance from 120 degrees separation
            if (d>0){                                         // no change, still first sector
                this.transition(color,d);
            }
            else {                                        // second sector
            	if (nColorMod>0) color.rotation();
                this.transition(color,-d);
            }
        }
        else {
            d=0.8660*colorPosition.x-0.5*colorPosition.y;
            if (d>0){
           		if (nColorMod>0) color.inverseRotation();
                this.transition(color,d);
            }
            else {
           		if (nColorMod>0) color.rotation();
                this.transition(color,-d);
            }           
        }
    }
}

// 4 color symmetry, transitions near the x- ynd y- axis, whatever is closer
ColorSymmetry.prototype.make4ColorSymmetry=function(color,colorPosition){
    if (colorPosition.x>0){
        if (colorPosition.y>0){    // first quadrant-no color change
            this.transition(color,Math.min(colorPosition.x,colorPosition.y));
        }
        else {
			switch (nColorMod){    // third quadrant
	        	case 1:
	        		color.shiftHue(4.5);
	        		break;
	        	case 2: 
	        		color.improvedInversion();
	        		break;
        	}
            this.transition(color,Math.min(colorPosition.x,-colorPosition.y));
        }
    }   
    else {
        if (colorPosition.y>0){
			switch (nColorMod){    // third quadrant
	        	case 1:
	        		color.shiftHue(1.5);
	        		break;
	        	case 2: 
	        		color.simpleInversion();
	        		break;
        	}
            this.transition(color,Math.min(-colorPosition.x,colorPosition.y));
        }
        else {
			switch (nColorMod){    // third quadrant
	        	case 1:
	        		color.shiftHue(3);
	        		break;
	        	case 2: 
	        		color.simpleInversion();
	        		color.improvedInversion();
	        		break;
        	}
            this.transition(color,Math.min(-colorPosition.x,-colorPosition.y));
        }
    }
}