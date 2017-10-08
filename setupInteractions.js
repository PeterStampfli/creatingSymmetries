"use strict";


// make the input image object
var inputImage=new InputImage();
var interpolation="nearest";
inputImage.interpolation=inputImage.getNearest;

// the output canvas
var initialOutputWidth=500;
var initialOutputHeight=500
var outputCanvas=new PixelCanvas('outputCanvas');
outputCanvas.setSize(initialOutputWidth,initialOutputHeight);

// setting up the buttons

// the input image

// choosing the output width
var outputWidthChooser=new Button('outputWidthChooser');
var outputHeightChooser=new Button('outputHeightChooser');

// set the start values
outputWidthChooser.setValue(initialOutputWidth);
outputHeightChooser.setValue(initialOutputHeight);

// the smoothing variants

var smoothing=false;
var smoothingChoosers=new Chooser('smoothing');
smoothingChoosers.add(function(){
        smoothing=false;
        console.log("smoothing "+smoothing);
    });
smoothingChoosers.add(function(){
        smoothing=true;
        console.log("smoothing "+smoothing);
    });

// the interpolation method

var interpolationChoosers=new Chooser('interpolation');
interpolationChoosers.add(function(){
		inputImage.interpolation=inputImage.getNearest;
        interpolation="nearest";
        console.log("interpolation "+interpolation);
    });
interpolationChoosers.add(function(){
		inputImage.interpolation=inputImage.getLinear;
        interpolation="linear";
        console.log("interpolation "+interpolation);
    });
interpolationChoosers.add(function(){
		inputImage.interpolation=inputImage.getCubic;
        interpolation="cubic";
        console.log("interpolation "+interpolation);
    });

// the color modification (inversion)
	
var nColorMod=0;
var colorMod="none";
var inversionChoosers=new Chooser('inversion');
inversionChoosers.add(function(){
        nColorMod = 0;
        colorMod="none";
        updateAll();
    });
inversionChoosers.add(function(){
        nColorMod = 1;
        colorMod="first";
        updateAll();
    });
inversionChoosers.add(function(){
        nColorMod = 2;
        colorMod="second";
        updateAll();
    });

// the message
var progress=document.getElementById("progress");
progress.innerHTML="Waiting for input image.";
