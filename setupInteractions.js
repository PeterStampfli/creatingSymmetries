"use strict";

// make the input image object, set initial interpolation method
var inputImage=new InputImage();
inputImage.periodic=inputImagePeriodic;

var interpolation="nearest";
inputImage.interpolation=inputImage.getNearest;


// setting up the buttons

// the input image
// get the input image pixels, adjust the reference, set the inputTransform
var imageInputButton = new Button('imageInput');
imageInputButton.onChange(function(){
    inputImage.read(imageInputButton.button.files[0],function(){
    	
    	
    	
       // referenceCanvas.adjust();

//referenceCanvas.adjustToOutput();
        inputTransform.setShift(0.5*inputImage.width,0.5*inputImage.height);
        //inputTransform.setScale(initialInputScale);
    	createImage();
    });
});

// choosing the output width
var outputWidthChooser=new Button('outputWidthChooser');
//var outputHeightChooser=new Button('outputHeightChooser');
/*
// the reference image height
var referenceHeightChooser=new Button('referenceHeightChooser');
	referenceHeightChooser.setValue(referenceCanvasHeight);
	*/
// set the start values
outputWidthChooser.setValue(initialOutputWidth);
//outputHeightChooser.setValue(initialOutputHeight);

var backgroundRedChooser=new Button('backgroundRed');
backgroundRedChooser.setValue(backgroundRed);

var backgroundGreenChooser=new Button('backgroundGreen');
backgroundGreenChooser.setValue(backgroundGreen);

var backgroundBlueChooser=new Button('backgroundBlue');
backgroundBlueChooser.setValue(backgroundBlue);
// the smoothing variants

var smoothing=false;
var smoothingText="No"
var smoothingChoosers=new Chooser('smoothing');
smoothingChoosers.add(function(){
    smoothing=false;
    smoothingText="No";
    console.log("smoothing "+smoothing);
});
smoothingChoosers.add(function(){
    smoothing=true;
    smoothingText="2x2",
    console.log("smoothing "+smoothing);
});
smoothingChoosers.setCheckedFirst();

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
interpolationChoosers.setCheckedFirst();

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
inversionChoosers.setCheckedFirst();

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
combinationChooser.setCheckedFirst();
// rosette for poincare disc etc.

var rosetteChooser=new Chooser('rosette');

rosetteChooser.add(function(){
    basicRosette=rosettePeriodicMirrorPhi;
    map.isValid=false;
    createImage();    
})

rosetteChooser.add(function(){
    basicRosette=rosetteRotationMirror;
    map.isValid=false;
    createImage();    
})

rosetteChooser.add(function(){
    basicRosette=rosetteRotation;
    map.isValid=false;
    createImage();    
})
rosetteChooser.setCheckedFirst();

// the message
var progress=document.getElementById("progress");
progress.innerHTML="Waiting for input image.";

// the message
var averageColor=document.getElementById("averageColor");
averageColor.innerHTML="Average color.";

function progressMessage(){
	progress.innerHTML="Size "+outputWidthChooser.getValue()+
    ". "+smoothingText+" smoothing. Interpolation "+interpolation+". Color modification "+colorMod+".";
}


var averageAsBackground=null;

function colorMessage(red,green,blue){
	averageColor.innerHTML="average color: red "+red+", green "+green+", blue "+blue+".";
	averageColor.innerHTML+="<button type='button' id='asBackground'>as background</button>";

		averageAsBackground=new Button("asBackground");
			averageAsBackground.onClick(function(){
			backgroundRedChooser.setValue(averageRed);
			backgroundGreenChooser.setValue(averageGreen);
			backgroundBlueChooser.setValue(averageBlue);
    		createImage();
		});

}




var saveOutputImageJpgButton=new Button("downloadOutputJpg");
saveOutputImageJpgButton.onClick(function(){
    outputCanvas.saveImageJpg("outputImage");
});

/*
var saveOutputImagePngButton=new Button("downloadOutputPng");
saveOutputImagePngButton.onClick(function(){
    outputCanvas.saveImagePng("outputImage");
    referenceCanvas.saveImagePng("referenceImage");
});
*/
/*
var saveReferenceImagePngButton=new Button("downloadReferencePng");
saveReferenceImagePngButton.onClick(function(){
    referenceCanvas.saveImagePng("referenceImage");
});
*/

