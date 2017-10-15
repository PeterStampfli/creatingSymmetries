"use strict";

/*
object for rgb-color and manipulation
*/

/*
simply black
*/
function Color(){
	this.red=0;
	this.green=0;
	this.blue=0;
	this.grey=0;
	this.hue=0;
	this.colorIntensity=0;
	this.grey=0;
}

/*
type out all components
*/
Color.prototype.toString=function(){
	return "Color ("+this.red+", "+this.green+", "+this.blue+", "
	+this.hue+", "+this.colorIntensity+", "+this.grey+")"; 
}

/*
set values
*/
Color.prototype.setRgb=function(red,green,blue){
    this.red=red;
    this.green=green;
    this.blue=blue;
}

/*
set values
*/
Color.prototype.set=function(color){
    this.red=color.red;
    this.green=color.green;
    this.blue=color.blue;
}

/*
interpolate from background: T=1 gives color, T=0 gives background color
*/
Color.prototype.fromBackground=function(t){
    this.red=t*this.red+(1-t)*backgroundColor.red;
    this.green=t*this.green+(1-t)*backgroundColor.green;
    this.blue=t*this.blue+(1-t)*backgroundColor.blue;
}

// color manipulation, from colors.js

/*
simple trivial inversion
*/
Color.prototype.simpleInversion=function(){
	this.red=255-this.red;
	this.green=255-this.green;
	this.blue=255-this.blue;
}

/*
improved inversion of color only
*/
Color.prototype.improvedInversion=function(){
    var pixMaxMin=Math.max(this.red,this.green,this.blue)+Math.min(this.red,this.green,this.blue);
	this.red=pixMaxMin-this.red;
	this.green=pixMaxMin-this.green;
	this.blue=pixMaxMin-this.blue;
}

/* 
color rotation r<-g<-b<-r
*/
Color.prototype.rotation=function(){
	var h=this.red;
	this.red=this.green;
	this.green=this.blue;
	this.blue=h;
}

/* 
inverse color rotation r->g->b->r
*/
Color.prototype.inverseRotation=function(){
	var h=this.red;
	this.red=this.blue;
	this.blue=this.green;
	this.green=h;
}

/*
determine hue, colorIntensity,grey from red,green blue
beware of side effects
*/
Color.prototype.higFromRgb=function(){
    // get and subtract grey 
    // integer grey between 0 and 255
    var red=this.red;
    var green=this.green;
    var blue=this.blue;
    this.grey=Math.min(red,green,blue);
    red-=this.grey;
    green-=this.grey;
    blue-=this.grey;
    // analyze color part, integer pixels!
    // integer color intensity between 0 and 255
    // float hue between 0 and 6
    // javascript always makes float division
    if ((red>=green)&&(red>=blue)){   // going from magenta to red to yellow
        if (red>0){
            this.colorIntensity=red;
            this.hue=(green>blue)?green/red:6-blue/red;
        }
        else {
            this.colorIntensity=0;
            this.hue=0;
        }
    }
    else if((green>=red)&&(green>=blue)){    // going from yellow to green to cyan
        this.colorIntensity=this.Green;
        this.hue=(blue>red)?2+blue/green:2 -red/green;
    }
    else {                                                   // going from cyan to blue to magenta
        this.colorIntensity=blue;
        this.hue=(red>green)?4+red/blue:4-green/blue;
    }
}

/*
get rgb from hue, colorIntensity,grey
*/
Color.prototype.rgbFromHig=function(){
	this.hue-=6*Math.floor(this.hue/6);   //reduce to range 0..6
    var intHue=Math.floor(this.hue);
    var fracHue=this.hue-intHue;
    switch(intHue){
        case 0: // red to yellow
            this.red=this.colorIntensity;
            this.green=this.colorIntensity*fracHue;
            this.blue=0;
            break;
        case 1: // yellow to green
            this.red=this.colorIntensity*(1-fracHue);
            this.green=this.colorIntensity;
            this.blue=0;
            break;
        case 2: // green to cyan
            this.red=0;
            this.green=this.colorIntensity;
            this.blue=this.colorIntensity*fracHue;
            break;
        case 3: // cyan to blue
            this.red=0;
            this.green=this.colorIntensity*(1-fracHue);
            this.blue=this.colorIntensity;
            break;
        case 4: // blue to magenta
            this.red=this.colorIntensity*fracHue;
            this.green=0;
            this.blue=this.colorIntensity;
            break;
        case 5: // magenta to red
            this.red=this.colorIntensity;
            this.green=0;
            this.blue=this.colorIntensity*(1-fracHue);
            break;
   }
    this.red+=this.grey;
    this.green+=this.grey;
    this.blue+=this.grey;
}

/*
shift the hue to rotate the color
*/
Color.prototype.shiftHue=function(amount){
	this.higFromRgb();
	this.hue+=amount;
	this.rgbFromHig();
}