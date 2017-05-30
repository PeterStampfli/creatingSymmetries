// color inversion
// simplest type of color change, overwrite if you want something better
function simpleColorInversion(u,v){
    if (u<-transWidth){
        pixelRed=255-pixelRed;
        pixelGreen=255-pixelGreen;
        pixelBlue=255-pixelBlue;  
    }  
    else if(u<transWidth){
        var x=0.5*(1-u/transWidth);
        pixelRed=x*(255-pixelRed)+(1-x)*pixelRed;
        pixelGreen=x*(255-pixelGreen)+(1-x)*pixelGreen;
        pixelBlue=x*(255-pixelBlue)+(1-x)*pixelBlue;
    }
}

// color inversion: subtler method

function improvedColorInversion(u,v){
    var pixMaxMin=Math.max(pixelRed,pixelGreen,pixelBlue)+Math.min(pixelRed,pixelGreen,pixelBlue);
    if (u<-transWidth){
        pixelRed=pixMaxMin-pixelRed;
        pixelGreen=pixMaxMin-pixelGreen;
        pixelBlue=pixMaxMin-pixelBlue;   
    } 
        else if(u<transWidth){
        var x=0.5*(1-u/transWidth);
        pixelRed=x*(pixMaxMin-pixelRed)+(1-x)*pixelRed;
        pixelGreen=x*(pixMaxMin-pixelGreen)+(1-x)*pixelGreen;
        pixelBlue=x*(pixMaxMin-pixelBlue)+(1-x)*pixelBlue;
    }
}



// the replacement background color for outside pixels
var outsideRed = 40;
var outsideGreen = 40;
var outsideBlue = 40;

// width for background color for color inversion
var transWidth=0.1;