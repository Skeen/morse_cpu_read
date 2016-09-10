var morse = require('morse-node').create("ITU");

var libCpuUsage = require( 'cpu-usage' );

var high = 0;
var low = 0;
var string = "";

process.on('SIGINT', function() 
{
    console.log("Caught string:", string);
    console.log("Decoded:", morse.decode(string));
    process.exit();
});

libCpuUsage(100, function(load) 
{
    if(load > 10)
    {
        if(low != 0)
        {
            if(low > 40)
            {
                var decoded = morse.decode(string);
                string = "";

                process.stdout.write(decoded);
            }

            if(low > 75)
            {
                decoded = "";
                string = "";
                console.log(" ");
            }
            low = 0;
        }
        high++;
    }
    else
    {
        if(low > 100)
        {
            var decoded = morse.decode(string);
            string = "";

            process.stdout.write(decoded);
            low = 0;
        }

        if(high != 0)
        {
            if(high > 20)
                string += "-";
            else
                string += ".";
            high = 0;
        }
        low++;
    }
});
