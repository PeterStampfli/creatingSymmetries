"use strict";


// make the input image object, set initial interpolation method
var inputImage=new InputImage();
var interpolation="nearest";
inputImage.interpolation=inputImage.getNearest;


// setting up the buttons

// the input image
var imageInputButton = new Button('imageInput');
imageInputButton.onChange(function(){
    inputImage.read(imageInputButton.button.files[0],function(){
    	console.log("adjust reference");
        referenceCanvas.adjust();
    	createImage();
    });
});

// choosing the output width
var outputWidthChooser=new Button('outputWidthChooser');
var outputHeightChooser=new Button('outputHeightChooser');

// set the start values
outputWidthChooser.setValue(initialOutputWidth);
outputHeightChooser.setValue(initialOutputHeight);
outputCanvas.setSize(initialOutputWidth,initialOutputWidth);
outputCanvas.blueScreen();
outputCanvas.createPixels();
map.setSize(initialOutputWidth,initialOutputWidth);

map.setRange(100);


map.make(mappingFunction);


console.log(map.transform.scale);

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
    createImage();
});
inversionChoosers.add(function(){
    nColorMod = 1;
    colorMod="first";
    createImage();
});
inversionChoosers.add(function(){
    nColorMod = 2;
    colorMod="second";
    createImage();
});

// the message
var progress=document.getElementById("progress");
progress.innerHTML="Waiting for input image.";

function progressMessage(){
	progress.innerHTML="Width "+outputWidthChooser.getValue()+", height "+outputHeightChooser.getValue()+
    ". No smoothing. Interpolation "+interpolation+". Color modification "+colorMod+".";
}

var updateButton=new Button("update");
updateButton.onClick(function(){
    createImage();
});

var saveImageButton=new Button("blob");
saveImageButton.onClick(function(){
    outputCanvas.canvas.toBlob(function(blob){
        saveAs(blob,"someImage.jpg");
    },'image/jpeg',0.92);
});


