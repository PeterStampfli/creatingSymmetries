"use strict";

// make the input image object, set initial interpolation method
var inputImage=new InputImage();
var interpolation="nearest";
inputImage.interpolation=inputImage.getNearest;


// setting up the buttons

// the input image
// get the input image pixels, adjust the reference, set the inputTransform
var imageInputButton = new Button('imageInput');
imageInputButton.onChange(function(){
    inputImage.read(imageInputButton.button.files[0],function(){
        referenceCanvas.adjust();
        inputTransform.setShift(0.5*inputImage.width,0.5*inputImage.height);
        inputTransform.setScale(initialInputScale);
        inputTransform.setAngle(0);
    	createImage();
    });
});

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
});
interpolationChoosers.add(function(){
	inputImage.interpolation=inputImage.getLinear;
    interpolation="linear";
});
interpolationChoosers.add(function(){
	inputImage.interpolation=inputImage.getCubic;
    interpolation="cubic";
});

// do the changes
var updateButton=new Button("update");
updateButton.onClick(function(){
    createImage();
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

// the harmonics
var harmonicsChooser=new Button("harmonics");
harmonicsChooser.setValue(initialHarmonics);
harmonicsChooser.onChange(function(){
    var n=harmonicsChooser.getValue();
    if (n<=0){
        imageFastFunction.makeTriangleTable();
    }
    else {
        imageFastFunction.makeTriangleExpansionTable(n);
    }
    map.isValid=false;
    createImage();
})

// imageCombination

var combinationChooser=new Chooser('combination');
combinationChooser.add(function(){
    imageCombination=makeSum;
    map.isValid=false;
    createImage();
});
combinationChooser.add(function(){
    imageCombination=makeProduct;
    map.isValid=false;
    createImage();
});

combinationChooser.add(function(){
    imageCombination=makeMax;
    map.isValid=false;
    createImage();
});

combinationChooser.add(function(){
    imageCombination=makeMin;
    map.isValid=false;
    createImage();
    console.log("min");
});

combinationChooser.add(function(){
    imageCombination=makeAbsoluteMinimum;
    map.isValid=false;
    createImage();
});

combinationChooser.add(function(){
    imageCombination=makeAbsoluteSum;
    map.isValid=false;
    createImage();
});


// the message
var progress=document.getElementById("progress");
progress.innerHTML="Waiting for input image.";

function progressMessage(){
	progress.innerHTML="Width "+outputWidthChooser.getValue()+", height "+outputHeightChooser.getValue()+
    ". No smoothing. Interpolation "+interpolation+". Color modification "+colorMod+".";
}

var saveImageButton=new Button("outputOutputCanvas");
saveImageButton.onClick(function(){
    outputCanvas.canvas.toBlob(function(blob){
        saveAs(blob,"someImage.jpg");
    },'image/jpeg',0.92);
});

var saveFinalImageButton=new Button("outputFinalCanvas");
saveFinalImageButton.onClick(function(){
    finalCanvas.canvas.toBlob(function(blob){
        saveAs(blob,"someImage.jpg");
    },'image/jpeg',0.92);
});





