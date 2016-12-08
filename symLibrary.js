function showHintPatch(){
	outputImage.strokeStyle="Red";	
	outputImage.strokeRect(0,0,patchWidth,patchHeight);
}





window.onload=function(){
	getCanvases();
	referenceCanvasAddEventListeners();
	activateImageDownloadButton();
	updatePeriod(256,256);
	drawing();

}
