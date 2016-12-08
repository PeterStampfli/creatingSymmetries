// the sine and cosine functions on the lattice taken from tables
// declare the arrays
var sinXTab=[];
var sinYTab=[];


//making the tables, update needed if periods change
function setupSinTables(){
	var factor=2*Math.PI/periodWidth;
	sinXTab.length=periodWidth;
	for (var i=0;i<periodWidth;i++){
		sinXTab[i]=Math.sin(factor*i);
	}
	factor=2*Math.PI/periodHeight;
	sinYTab.length=periodHeight;
	for (var i=0;i<periodHeight;i++){
		sinYTab[i]=Math.sin(factor*i);
	}	
}

// getting the functions
//  horizontal
function sinX(i){
	return sinXTab[i%periodWidth];
}

function cosX(i){
	return sinXTab[(i+periodWidth4)%periodWidth];
}

// vertical
function sinY(i){
	return sinYTab[i%periodHeight];
}

function cosY(i){
	return sinYTab[(i+periodHeight4)%periodHeight];
}

// the table for the mapping function
var mapXTab=[];
var mapYTab=[];

//  a map for the primitive patch !!!
// this depends on symmetry
// inline the function?
//  trivial map for simple patching
function setupMapTables(){
	var size=patchWidth*patchHeight;
	mapXTab.length=size;
	mapYTab.length=size;
	var index=0;
	var i,j;
	for (j=0;j<patchHeight;j++){
		for (i=0;i<patchWidth;i++){
			mapXTab[index]=i;
			mapYTab[index]=j;		
			index++;
		}
	}
	
}
