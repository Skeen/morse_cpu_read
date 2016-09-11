var morse = require('morse-node').create("ITU");
var libCpuUsage = require( 'cpu-usage' );

var string = "";
var emit_letter = function()
{
    console.log(morse.decode(string));
    string = "";
}

var create_morse = function(signal)
{
    if(signal == -1)
    {
        return;
    }
    // Dot
    if(signal == 1)
        string += ".";
    // Line
    else if(signal == 3)
        string += "-";
    // Letter seperator
    else if(signal == -5)
    {
        emit_letter();
    }
    else if(signal == -7)
    {
        emit_letter();
        console.log("_");
    }
    else
    {
        emit_letter();
        console.log("Unknown primitive:", signal);
    }
}

var handle_signal = function(signal)
{
    if(Math.abs(signal) > 5)
    {
        var clean_sig = Math.round(signal/10);
        create_morse(clean_sig);
    }
}

var high = 0;
var low = 0;
libCpuUsage(100, function(load) 
{
    if(load > 10)
    {
        // We switched from low to high
        if(low != 0)
        {
            handle_signal(-low);
            low = 0;
        }
        high++;
    }
    else
    {
        // We switched from high to low
        if(high != 0)
        {
            handle_signal(high);
            high = 0;
        }
        low++;
    }

    // Handle run-aways
    if(low > 100)
    {
        emit_letter();
        low = 0;
    }
    if(high > 100)
    {
        emit_letter();
        high = 0;
    }
});
