"use strict";

// "trivial" symmetry operations of the map

// mirror at center in horizontal direction
// the left half becomes same as right half
Map.prototype.leftToRight=function(){
	var height=this.height;
	var width=this.width;
	var imagePositionX=this.imagePositionX;
	var imagePositionY=this.imagePositionY;
	var colorPositionX=this.colorPositionX;
	var colorPositionY=this.colorPositionY;
	var i,j;
	var indexFrom;
	var indexTo;

	for (j=0;j<height;j++){
		indexFrom=j*width;
		indexTo=indexFrom+width-1;
		for (i=0;i<width/2;i++){
			imagePositionX[indexTo]=imagePositionX[indexFrom];
			imagePositionY[indexTo]=imagePositionY[indexFrom];
			colorPositionX[indexTo]=colorPositionX[indexFrom];
			colorPositionY[indexTo]=colorPositionY[indexFrom];
			indexTo--;
			indexFrom++;

		}
	}

}