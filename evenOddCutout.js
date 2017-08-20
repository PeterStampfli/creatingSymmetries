



//  for odd-p rotational symmetry
function makeSumCosinesOdd2(k1,k2){
    var sum=0;
    var lastXTimesE=xTimesE[p-1];
    var newXTimesE;
    for (var i=0;i<p;i++){
        newXTimesE=xTimesE[i];
        sum+=fCos(k1*lastXTimesE+k2*newXTimesE);
        lastXTimesE=newXTimesE;
    }
    return sum;
}

function makeSumSharpCosinesOdd2(k1,k2){
    var sum=0;
    var lastXTimesE=xTimesE[p-1];
    var newXTimesE;
    for (var i=0;i<p;i++){
        newXTimesE=xTimesE[i];
        sum+=fCos(k1*lastXTimesE+k2*newXTimesE);
        lastXTimesE=newXTimesE;
    }
    return sum;
}

function makeSumSinesOdd2(k1,k2){
    var sum=0;
    var lastXTimesE=xTimesE[p-1];
    var newXTimesE;
    for (var i=0;i<p;i++){
        newXTimesE=xTimesE[i];
        sum+=fSin(k1*lastXTimesE+k2*newXTimesE);
        lastXTimesE=newXTimesE;
    }
    return sum;
}

// for even 2p-rotational symmetry

function makeSumCosinesEven2(k1,k2){
    var sum=0;
    var lastXTimesE=-xTimesE[p-1];
    var newXTimesE;
    for (var i=0;i<p;i++){
        newXTimesE=xTimesE[i];
        sum+=fCos(k1*lastXTimesE+k2*newXTimesE);
        lastXTimesE=newXTimesE;
    }
    return sum;
}
// for even 2p-rotational symmetry

function makeSumSharpCosinesEven2(k1,k2){
    var sum=0;
    var phase;
    var lastXTimesE=-xTimesE[p-1];
    var newXTimesE;
    for (var i=0;i<p;i++){
        newXTimesE=xTimesE[i];
        phase=k1*lastXTimesE+k2*newXTimesE;
        sum+=fCos(phase)+0.11111*fCos(3*phase);
        lastXTimesE=newXTimesE;
    }
    return sum;
}

function makeSumSharperCosinesEven2(k1,k2){
    var sum=0;
    var phase;
    var lastXTimesE=-xTimesE[p-1];
    var newXTimesE;
    for (var i=0;i<p;i++){
        newXTimesE=xTimesE[i];
        phase=k1*lastXTimesE+k2*newXTimesE;
        sum+=fCos(phase)+0.11111*fCos(3*phase)+0.04*fCos(5*phase);
        lastXTimesE=newXTimesE;
    }
    return sum;
}
