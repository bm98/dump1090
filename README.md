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

### Actually building it

Nothing special, just build it ("dpkg-buildpackage -b")
see also docker-dump1090-fa Git repo of this Git account

no Raspian build tested so far - may or may not work..

## Building manually

You can probably just run "make" after installing the required dependencies.
Binaries are built in the source directory; you will need to arrange to
install them (and a method for starting them) yourself.
