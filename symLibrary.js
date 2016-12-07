function showPatch(){
	outputImage.strokeStyle="Red";	
	outputImage.strokeRect(0,0,patchWidth,patchHeight);
}





window.onload=function(){
	getCanvases();
	referenceCanvasAddEventListeners();
	activateImageDownloadButton();
	drawing();
}
