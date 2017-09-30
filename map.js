"use strict";

/*
the mapping data
width and height, data, input

*/

function Map(){
	this.width=0;
	this.height=0;
	this.data=[];
	this.input=new MapInput();
}

/*
set the size
*/
Map.prototype.setSize=function(width,height){
	var oldLength,newLength;
	this.width=width;
	this.height=height;
	oldLength=this.data.length;
	newLength=width*height;
	if (oldLength<newLength){
	this.data.length=newLength;
		for (var i=oldLength;i<newLength;i++){
			this.data[i]=new MapOutput();
		}
	}
}