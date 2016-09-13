var initialize_data = null;
var fibonacci_numbers = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765, 10946, 17711, 28657, 46368, 75025, 121393, 196418, 317811, 514229, 832040, 1346269, 2178309, 3524578, 5702887, 9227465, 14930352, 24157817, 39088169, 63245986, 102334155, 165580141, 267914296, 433494437, 701408733, 1134903170, 1836311903, 2971215073, 4807526976, 7778742049, 12586269025];
var fibonacci_sizes = [1, 1, 3, 5, 9, 15, 25, 41, 67, 109, 177, 287, 465, 753, 1219, 1973, 3193, 5167, 8361, 13529, 21891, 35421, 57313, 92735, 150049, 242785, 392835, 635621, 1028457, 1664079, 2692537, 4356617, 7049155, 11405773, 18454929, 29860703, 48315633, 78176337, 126491971, 204668309, 331160281, 535828591, 866988873, 1402817465, 2269806339, 3672623805, 5942430145, 9615053951, 15557484097, 25172538049, 40730022147];


var resStartTimes = [];
var resFibTimes   = [];

var workerStartTime = performance.now();

function smooth_fib_w(n, k) {
    if (n==0 || n==1) {
        return n;
    }

    var k1 = fibonacci_sizes[n-1];

    if (k > k1) {
        return smooth_fib_w(n-1, k1) + smooth_fib_w(n-2, k-k1-1);
    }
    else {
        return smooth_fib_w(n-1, k) + fibonacci_numbers[n-2];
    }
}

function smooth_fib(n, frac) {
    return smooth_fib_w(n, frac*fibonacci_sizes[n]);
}

function getFibTime() {
    
    var start = performance.now();
    smooth_fib(initialize_data.fibval, initialize_data.fibfrac);
    var end = performance.now(); 
    return { relStartTime : start - workerStartTime, fibTime : end - start } ;
    // return [start, end-start];
}

    
function getTimeSeries() {
    resStartTimes = [];
    resFibTimes   = [];

    for (var i = 0; i < initialize_data.interval_samples; i++) {
        var r = getFibTime();
        resStartTimes.push (r.relStartTime);
        resFibTimes.push (r.fibTime);
    }

    self.postMessage({payload: { startTimes: resStartTimes, fibTimes: resFibTimes }});
}


onmessage = function(e) 
{
    if(!initialize_data) 
    {
        if (e.data.fibval) 
        {
          initialize_data = e.data;
        }
    }
    if(e.data.override_fibfrac)
    {
        initialize_data.fibfrac = e.data.override_fibfrac;
        return;
    }

    getTimeSeries();
}

