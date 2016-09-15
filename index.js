var morse = require('morse-node').create("ITU");

var outputText = "";

var string = "";

var emit = function(text)
{
	outputText = outputText + text;
	document.getElementById('morseOutput').innerHTML = outputText;
}
var emit_letter = function()
{
	var decoded = morse.decode(string);
	var decoded = decoded.trim();
    console.log(decoded);
	emit(decoded);
    string = "";
}
var emit_space = function()
{
	console.log("_");
	emit(" ");
}

POINT_SEPERATOR = -10;
DOT = 10;
DASH = 30;
LETTER_SEPERATOR = -50;
SPACE = -70;

var close_to = function(reading, optimal)
{
    return optimal - 5 < reading && reading < optimal + 5;
}

var create_morse = function(signal)
{
    if(close_to(signal, POINT_SEPERATOR))
    {
        console.log("POINT SEPERATOR");
    }
    // Dot
	else if(close_to(signal, DOT))
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
    else if(close_to(signal, SPACE))
    {
        emit_letter();
		emit_space();
    }
    else
    {
        //emit_letter();
        console.log("Unknown primitive:", signal);
    }
}

var handle_signal = function(signal)
{
	console.log(signal);
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
