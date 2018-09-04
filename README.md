# dump1090-fa Debian/Raspbian packages

This is a fork of [dump1090-fa](https://github.com/flightaware/dump1090)
customized for use the --net-only HTTP server pulling data from existing
data sources. e.g. a Pi running a local ADS-B/ModeS receiver.
Intended to be run in a Docker Container

It is designed to build from the Debian.stable package. (Aug 2018)

### Modifications re original dump1090-fa

References to rtl-sdr and bladeRF are removed
--> It is not intended to collect data from a SDR receiver.
added daemon init and support for external configuration sources

### Instrument Panel
Instrument Panel for the selected aircraft, switch between panel and sheet view.
javascript draws on HTML5 Canvas.

### Screenshot and Video of the Instrument Panel

[Using the dump1090-fa with instrument panel (Youtube](https://www.youtube.com/watch?v=mQ3SeIqvK6E)
[![dump1090 instrument panel](https://raw.githubusercontent.com/bm98/dump1090/master/img/dump1090-fa-Mod1.png)](https://www.youtube.com/watch?v=mQ3SeIqvK6E)

[Panel view](https://raw.githubusercontent.com/bm98/dump1090/master/img/dump1090-fa-Mod0.png)]

[Change between Panel and Sheet](https://raw.githubusercontent.com/bm98/dump1090/master/img/dump1090-fa-Mod2.png)]

[Sheet view](https://raw.githubusercontent.com/bm98/dump1090/master/img/dump1090-fa-Mod3.png)]


### Using only the Instrument Panel

Stop the http daemon:  $ sudo service lighttpd stop

In /usr/share/dump1090-fa/html

Backup the original index.html, style.css and script.js

Drop the following files from this public_html folder here:
index.html, style.css, script.js + all the new gp*.js
$ sudo cp   is usually needed  
Start the http daemon: $ sudo service lighttpd start


### Actually building it

Nothing special, just build it ("dpkg-buildpackage -b")
see also docker-dump1090-fa Git repo of this Git account

no Raspian build tested so far - may or may not work..

## Building manually

You can probably just run "make" after installing the required dependencies.
Binaries are built in the source directory; you will need to arrange to
install them (and a method for starting them) yourself.
