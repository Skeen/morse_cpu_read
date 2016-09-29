(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
	console.log("SPACE");
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

var primitives = [LETTER_SEPERATOR, POINT_SEPERATOR, DOT, DASH, SPACE];

var closest_to = function(reading)
{

	var current_diff = 99;
	var current_value = 99;

	for(var i=0; i < primitives.length; i++)
	{
		var diff = Math.abs(reading - primitives[i]);
		
		if(diff < current_diff)
		{
			current_diff = diff;
			current_value = primitives[i];
		}
	}

	return current_value;
}

var create_morse = function(signal)
{
	var approx = closest_to(signal);

    if(close_to(approx, POINT_SEPERATOR))
    {
        console.log("POINT SEPERATOR");
    }
    // Dot
	else if(close_to(approx, DOT))
    {
        console.log("DOT");
        string += ".";
    }
    // Line
    else if(close_to(approx, DASH))
    {
        console.log("DASH");
        string += "-";
    }
    // Letter seperator
    else if(close_to(approx, LETTER_SEPERATOR))
    {
		console.log("LETTER SEPERATOR");
        emit_letter();
    }
    else if(close_to(approx, SPACE))
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

// Decode signal as morse code
var high = 0;
var low = 0;
var counter = 0;
var tolerance = 3;

var morse_input = function(state)
{
	if(state)
		output(1);
	else
		output(0);
	/*
    if(state)
    {
		counter = Math.min(counter + 1, tolerance);
        // We switched from low to high
        // Check if this is noise.
		if(counter == tolerance && low >= tolerance)
        {
			handle_signal(-low);
			low = 0;
        }
        high++;
    }
    else
    {
		counter = Math.max(counter -1, -tolerance);
        // We switched from high to low
        if(counter == -tolerance && high >= tolerance)
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
	*/
	
}


// Output the data to an array, for saving.
var output_string = "Time, Value \n";
var output_index = 0;
var output = function(value)
{
	output_string = output_string + output_index + ", " + value + "\n";
	output_index++;
}

window.output_string = function()
{
	return output_string;
}
window.output = output;
window.morse_input = morse_input;

},{"morse-node":2}],2:[function(require,module,exports){
function MorseNode(){
    return this;
}

var ITU = {
    // letters
    "a" :  ".-",
    "b" :  "-...",
    "c" :  "-.-.",
    "d" :  "-..",
    "e" :  ".",
    "f" :  "..-.",
    "g" :  "--.",
    "h" :  "....",
    "i" :  "..",
    "j" :  ".---",
    "k" :  "-.-",
    "l" :  ".-..",
    "m" :  "--",
    "n" :  "-.",
    "o" :  "---",
    "p" :  ".--.",
    "q" :  "--.-",
    "r" :  ".-.",
    "s" :  "...",
    "t" :  "-",
    "u" :  "..-",
    "v" :  "...-",
    "w" :  ".--",
    "x" :  "-..-",
    "y" :  "-.--",
    "z" :  "--..",
    // numbers
    "1" :  ".----",
    "2" :  "..---",
    "3" :  "...--",
    "4" :  "....-",
    "5" :  ".....",
    "6" :  "-....",
    "7" :  "--...",
    "8" :  "---..",
    "9" :  "----.",
    "0" :  "-----",
    // punctuation
    "." :  ".-.-.-",
    "," :  "--..--",
    "?" :  "..--..",
    "\'": ".----.",
    "!" :  "-.-.--",
    "/" :  "-..-.",
    "(" :  "-.--.",
    ")" :  "-.--.-",
    "&" :  ".-...",
    ":" :  "---...",
    ";" :  "-.-.-.",
    "=" :  "-...-",
    "+" :  ".-.-.",
    "-" :  "-....-",
    "_" :  "..--.-",
    "\"": ".-..-.",
    "$" :  "...-..-",
    "@" :  ".--.-.",
    " " :  "/"
};

var chars = {
    // letters
    ".-"  : "a",
    "-...": "b",
    "-.-.": "c",
    "-.." : "d",
    "."   : "e",
    "..-.": "f",
    "--." : "g",
    "....": "h",
    ".."  : "i",
    ".---": "j",
    "-.-" : "k",
    ".-..": "l",
    "--"  : "m",
    "-."  : "n",
    "---" : "o",
    ".--.": "p",
    "--.-": "q",
    ".-." : "r",
    "..." : "s",
    "-"   : "t",
    "..-" : "u",
    "...-": "v",
    ".--" : "w",
    "-..-": "x",
    "-.--": "y",
    "--..": "z",
    // numbers
    ".----": "1",
    "..---": "2",
    "...--": "3",
    "....-": "4",
    ".....": "5",
    "-....": "6",
    "--...": "7",
    "---..": "8",
    "----.": "9",
    "-----": "0",
    // punctuation
    ".-.-.-" : ".",
    "--..--" : ",",
    "..--.." : "?",
    ".----." : "\'",
    "-.-.--" : "!",
    "-..-."  : "/",
    "-.--."  : "(",
    "-.--.-" : ")",
    ".-..."  : "&",
    "---..." : ":",
    "-.-.-." : ";",
    "-...-"  : "=",
    ".-.-."  : "+",
    "-....-" : "-",
    "..--.-" : "_",
    ".-..-." : "\"",
    "...-..-": "$",
    ".--.-." : "@",
    //" "      : "",
    "/"      : " "
};

MorseNode.prototype = {
    version: "0.0.1",

    encode: function(str) {
        var encoding = "";

        for (var i=0; i<str.length; i++) {
            var char = str.charAt(i).toLowerCase();
            if (ITU[char]) {
                encoding += ITU[char];
                encoding += " ";
            }
        }
        return encoding;
    },

    decode: function(str) {
        var decoding = "";
        var words = str.split("/");

        // each word
        for (var i=0; i<words.length; i++) {
            // each character
            var character = words[i].split(" ");
            for (var j=0; j<character.length; j++) {
                if (chars[character[j]])
                    decoding += chars[character[j]];
            }
            decoding += " ";
        }
        return decoding;
    },

    isValid: function(str, type) { // type = chars, morse
        if (!str)
            return null;

        if (type != "chars" && type != "morse")
            return null;

        if (type == "chars") {
            for (var i=0; i<str.length; i++) {
                if (!ITU[str.charAt(i).toLowerCase()])
                    return false;
            }
            return true;
        }
        else if (type == "morse") {
            var words = str.split("/");
            // each word
            for (var i=0; i<words.length; i++) {
                // each character
                var character = words[i].split(" ");
                for (var j=0; j<character.length; j++) {
                    if (!chars[character[j]] && character[j] != '') // ignore spaces
                        return false;
                }
            }
            return true;
        }
    }

};

exports.create = function(version) {
    version = typeof version !== 'undefined' ? version : 'ITU';
    if (version != "ITU") // currently no other morse code versions supported
        return null;
    return new MorseNode();
};
},{}]},{},[1]);
