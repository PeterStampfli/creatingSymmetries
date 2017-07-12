
function sumCosinesWavevectorOdd(args){
    setWavevector(arguments);
    var sum=0;
    for (var i=0;i<p;i++){
        sum+=fCos(sumKtimesXE());
        rotateWavevectorOdd();
    }
    return sum;
}

function sumSinesWavevectorOdd(args){
    setWavevector(arguments);
    var sum=0;
    for (var i=0;i<p;i++){
        sum+=fSin(sumKtimesXE());
        rotateWavevectorOdd();
    }
    return sum;
}

function sumCosinesWavevectorEven(args){
    setWavevector(arguments);
    var sum=0;
    for (var i=0;i<p;i++){
        sum+=fCos(sumKtimesXE());
        rotateWavevectorEven();
    }
    return sum;
}

// single wavevector components, sine or cosine

function sumCosines(k){
    var sum=0;
    for (var i=0;i<p;i++){
        sum+=fCos(k*xTimesE[i]);
    }
    return sum;
}

function sumAlternatingCosines(k){
    var sum=0;
    var factor=1;
     for (var i=0;i<p;i++){
        sum+=factor*fCos(k*xTimesE[i]);
        factor=-factor;
    }
    return sum;
}

function sumSines(k){
    var sum=0;
     for (var i=0;i<p;i++){
        sum+=fSin(k*xTimesE[i]);
    }
    return sum;
}


function sumCosines2Odd(k1,k2){
    var sum=fCos(k1*xTimesE[p-1]+k2*xTimesE[0]);
     for (var i=1;i<p;i++){
        sum+=fCos(k1*xTimesE[i-1]+k2*xTimesE[i]);
    }
    return sum;
}

function sumCosines2Even(k1,k2){
    var sum=fCos(-k1*xTimesE[p-1]+k2*xTimesE[0]);
     for (var i=1;i<p;i++){
        sum+=fCos(k1*xTimesE[i-1]+k2*xTimesE[i]);
    }
    return sum;
}

function sumSines2Odd(k1,k2){
    var sum=fSin(k1*xTimesE[p-1]+k2*xTimesE[0]);
     for (var i=1;i<p;i++){
        sum+=fSin(k1*xTimesE[i-1]+k2*xTimesE[i]);
    }
    return sum;
}



function sumPhasedCosines(k){
    var sum=0;
    var deltaPhase=2*Math.PI/nColors;
    var phase=0;
    for (var i=0;i<p;i++){
        sum+=fCos(phase+k*xTimesE[i]);
        phase+=deltaPhase;
    }
    return sum;    
}

function sumPhasedSines(k){
    var sum=0;
    var deltaPhase=2*Math.PI/nColors;
    var phase=0;
    for (var i=0;i<p;i++){
        sum+=fSin(phase+k*xTimesE[i]);
        phase+=deltaPhase;
    }
    return sum;    
}