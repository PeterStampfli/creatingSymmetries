"use strict";

// on the output canvas, the coordinates range is x,y=-2 ... +2
//  for easy work with inversion
//  then a mapping is done, resulting in xImage and yImage
// then a pixel address is put in the table
// a unit length corresponds
// ========================================================================
// using sectors

var xImage=0;
var yImage=0;

function mapping(r,phi){
    // the trivial map
    xImage=r*Math.cos(phi);
    yImage=r*Math.sin(phi);
}

function rosetteMapTables() {
 
    function storeImage(i,j){
        index=mapSize*j+i;
        mapXTab[index] = xImage;
        mapYTab[index] = yImage;
    }

    var mapSize = mapWidth;
    var mapSizeHalf = mapWidth / 2;
    var normFactor=4.0/mapWidth;
    var index = 0;
    var iBase,jBase;
    var x=0;
    var y=0;
    var r=0;
    var phi=0;
    //  using 8 sectors
    for (iBase = 0; i < mapSizeHalf; i++) {
       	x=normFactor*(iBase+0.5);
        for (j=0;j<=i;j++) {
     		y=normFactor*(jBase+0.5);
     		r=Math.sqrt(x*x+y*y);
            phi=atan2(y,x);
            // sector 1
            mapping(r,phi);
            storeImage(mapSizeHalf+iBase,mapSizeHalf+jBase);
         }
    }
}