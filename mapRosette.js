"use strict";

// on the output canvas, the coordinates range is x,y=-2 ... +2
//  for easy work with inversion
//  then a mapping is done, resulting in xImage and yImage
// then a pixel address is put in the table
// a unit length corresponds
// ========================================================================
function rosetteMapTables() {
    var mapSize = mapWidth;
    var sizeHalf = mapWidth / 2;
    var normFactor=4.0/mapWidth;
    var index = 0;
    var i, j;
    var x=0;
    var y=0;
    var xImage=0;
    var yImage=0;
    for (j = 0; j < mapSize; j++) {
    	y=normFactor*(j-sizeHalf+0.5);
        for (i = 0; i < mapSize; i++) {
     		x=normFactor*(i-sizeHalf+0.5);
     		// the mapping
     		xImage=x;
     		yImage=y;
         	//  scale to typical input size
            mapXTab[index] = xImage;
            mapYTab[index++] = yImage;
        }
    }
}