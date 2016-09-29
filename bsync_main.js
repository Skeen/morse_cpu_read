var g_worker_as_string = ""; // Not used for now

var globals = {
    worker_blob : new Blob([g_worker_as_string],
                           {type: "application/javascript"}),
    fibval : 35,
    fibfrac : 0.0001,
    threadcount : 1,
    samples : 128,
    tag : "no_tag",
    user_cookie : "no_user",
    submit_count : 0,
    target_return_time : 35,
    timestamp : -1,
    entry_kind : "no_entry_kind",
    barrier_count : 2,
    job_id : ""
}


function reply(e)
{
    //result[e.data.id] = e.data.payload.fibTimes;
	result[j] = e.data.payload.fibTimes;

	j++;

    //result = result.concat(e.data.payload.fibTimes);;
	//console.log(i);
    if(j == globals.threadcount)
    {
        run++;
        j=0;
		//console.log(result);
        callback(result, run);
        result = [];
    }
}

worker_list = [];
for (var i = 0; i < globals.threadcount; ++i)
{
    var w = new Worker("bsync_worker.js");
    w.addEventListener('message', reply);
    worker_list.push(w);
}


var j = 0;
var run = 0;
var result = [];

function gather_timeseries() 
{
    // Initialize the webworkers
    for (var i = 0; i < globals.threadcount; ++i) {
        var worker_init_packet = {
            fibval : globals.fibval,
            fibfrac : globals.fibfrac,
            id : i,
            interval_samples :
                Math.floor(globals.samples / globals.barrier_count)
        }
		var w = worker_list[i];
        w.postMessage(worker_init_packet);
    }
}

function set_difficultness()
{
    // Initialize the webworkers
    for (var i = 0; i < globals.threadcount; ++i) {
        var worker_init_packet = {
            override_fibfrac : globals.fibfrac,
        }
		var w = worker_list[i];
        w.postMessage(worker_init_packet);
    }
}

var pre_time;
var post_time;

var morse_high = false;
var current_sum = 0;

var callback = function(data, run)
{
	
	//console.log(data);
    //console.log("run:", run, "done");
    var post_time = performance.now();
    var diff_time = post_time - pre_time;
    //console.log("Took ", diff_time);
	/*
	if(diff_time < 100)
    {
        globals.fibfrac = globals.fibfrac * 1.1;
        set_difficultness();
    }
	*/
    //console.log(data.length);
    var times = data;
    //var sum = times.reduce(function(a, b) { return a + b; });
	
	var sums = [];
	for(var i=0; i < times.length; i++)
	{
		//console.log('sums' + times[i]);
		sums[i] = times[i].reduce(function(a, b) { return a + b; });
	}

	var longest_time = Math.max(...sums);
	var fastest_time = Math.min(...sums);

	var sum_time = sums.reduce(function(a,b){ return a + b });

	
	if(sum_time < 100 * globals.threadcount)
	{
		globals.fibfrac = globals.fibfrac * 1.1;
		set_difficultness();
		console.log('Increasing Difficultness');
	}
	
	//console.log('SumTime: ' + sum_time);

	//var sum = Math.max
	//console.log('Took: '+ sum + ' diff: ' + diff_time);
    //console.log(sum - 100);
	current_sum = sum_time;
    if(sum_time - (100 * globals.threadcount) > 60)
    //if(longest_time > 130)
	{
		//console.log(diff_time);
		//console.log(sum_time);
		//console.log('Longest: ' + longest_time + ' Fastest: ' + fastest_time);
		morse_high = true
        //morse_input(true);
    }
    else
    {
		morse_high = false;
        //morse_input(false);
    }
    //var avg = sum / times.length;
    //console.log("total:", sum, "average:", avg);
    setTimeout(handler, 0);
}

var handler = function()
{
    pre_time = performance.now();
    gather_timeseries();
}

window.handler = handler;

setTimeout(handler, 0);
//setInterval(function(){ morse_input(morse_high)}, 100);
setInterval(function(){ output(current_sum)}, 100);
