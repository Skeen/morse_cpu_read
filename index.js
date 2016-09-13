var morse = require('morse-node').create("ITU");

var string = "";
var emit_letter = function()
{
    console.log(morse.decode(string));
    string = "";
}

POINT_SEPERATOR = -10;
DOT = 5;
DASH = 15;
LETTER_SEPERATOR = -45;

var close_to = function(reading, optimal)
{
    return optimal - 5 < reading && reading < optimal + 5;
}

var create_morse = function(signal)
{
    if(close_to(signal, POINT_SEPERATOR))
    {
        console.log("POINT SEPERATOR");
        return;
    }
    // Dot
    if(close_to(signal, DOT))
    {
        console.log("DOT");
        string += ".";
    }
    // Line
    else if(close_to(signal, DASH))
    {
        console.log("DASH");
        string += "-";
    }
    // Letter seperator
    else if(close_to(signal, LETTER_SEPERATOR))
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
        //emit_letter();
        console.log("Unknown primitive:", signal);
    }
}

var handle_signal = function(signal)
{
    if(Math.abs(signal) > 2)
    {
        var clean_sig = Math.round(signal);
        create_morse(clean_sig);
    }
}

var high = 0;
var low = 0;

var morse_input = function(state)
{
    if(state)
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
}

window.morse_input = morse_input;
