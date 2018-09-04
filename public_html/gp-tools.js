// GlasPanel Tools

// DEBUG and DEVELOP
var CenterValue = 100;
var GP_DUMMY = true;  // set to false for the real page, else dummy data is used

var gpGUI = 
{
	font32  : "32px Share Tech Mono",
	font32s : "32px Arial",
	size32  : 24,
	font24  : "22px Share Tech Mono",
	font24s : "24px Arial",
	size24  : 18,
	font18  : "18px Share Tech Mono",
	size18  : 16,
	font18s : "18px Arial",
	// #RBG 
	colBlack   : "#10101f",	// not pitch black..
	colFrame   : "white",   // Frame color
	colBGLabel : "#10101f",   // Label background
	colSky     : "#004aff",	// blue
	colGround  : "#523108", //  brown
	colCompass : "#4b3a21", // darker brown
	colWhite   : "white",
	colSmoke   : "#f5f5f5", // almost white
	colNav     : "#00fbfb",  // cyan
	colYellow  : "#fde200", 
	colPurple  : "#e501e5", 

	colSqw     : "#00fe00", // Text Color
	colHJack   : "#a73838", // Back Color
	colRadioF  : "#008686", // Back Color
	colEmerg   : "#969600", // Back Color
	
	colAlarm   : "#f04a24",
	colWarn    : "#ffdd26",
}

// load google font == Share Tech Mono
WebFontConfig = {
  google:{ families: ['Share Tech Mono'] },
//  active: function(){start();},
  timeout: 1500,
  };
(function(){
  var wf = document.createElement("script");
  wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1.5.10/webfont.js';
  wf.async = 'true';
  document.head.appendChild(wf);
})();

// Pad a string 
function pad(pad, str, padLeft) {
  if (typeof str === 'undefined') 
    return pad;
  if (padLeft) {
    return (pad + str).slice(-pad.length);
  } else {
    return (str + pad).substring(0, pad.length);
  }
}

// Gp_dummy
// constructor
function Gp_dummy() {
	// provide a dummy plane object that is providing some data
	this.dummyPlane = new PlaneObject("341583");
	this.dummyPlane.flight = "AEA1518";
	this.dummyPlane.registration = "EC-IDT";
	this.dummyPlane.squawk = 7000;
	this.dummyPlane.selected = true;		
	this.dummyPlane.altitude = 10000;
	this.dummyPlane.alt_baro = 10010;
	this.dummyPlane.alt_geom = 9990;
	this.dummyPlane.speed = 123;
	this.dummyPlane.gs = 125;
	this.dummyPlane.ias = 130;
	this.dummyPlane.tas = 220;
	this.dummyPlane.track = 222;
	this.dummyPlane.track_rate = -0.5;
	this.dummyPlane.mag_heading = 220;
	this.dummyPlane.true_heading = 230;
	this.dummyPlane.mach = 0.22;
	this.dummyPlane.roll = -7.0;
	this.dummyPlane.nav_altitude = 20000;
	this.dummyPlane.nav_heading = 56;
	this.dummyPlane.nav_qnh = 1010;
	this.dummyPlane.baro_rate = -1000;
	this.dummyPlane.geom_rate = -1020;
	this.dummyPlane.vert_rate = +1950;
	this.dummyPlane.position = [47.123456, 8.9876543];
	this.dummyPlane.sitedist = 23.456789;
	this.dummyPlane.messages = 222;
	this.dummyPlane.rssi = -24.5;
	this.dummyPlane.seen = -0.3;
};	

Gp_dummy.prototype.selected = function()
{ 
	return this.dummyPlane; 
};
	
Gp_dummy.prototype.update = function() 
{
	this.dummyPlane.altitude++;
	this.dummyPlane.alt_baro++;
	this.dummyPlane.alt_geom++;
	this.dummyPlane.speed++;
	this.dummyPlane.gs++;
	this.dummyPlane.ias++;
	this.dummyPlane.tas++;
	this.dummyPlane.track++;
	this.dummyPlane.track_rate+=0.02;
	this.dummyPlane.mag_heading++;
	this.dummyPlane.true_heading++;
	this.dummyPlane.mach+=0.01;
	this.dummyPlane.roll++;
	this.dummyPlane.nav_altitude++;
	this.dummyPlane.nav_heading++;
	this.dummyPlane.baro_rate++;
	this.dummyPlane.geom_rate++;
	this.dummyPlane.vert_rate+=20;
	this.dummyPlane.sitedist++;
	this.dummyPlane.messages++;
	this.dummyPlane.rssi++;
	this.dummyPlane.seen += 0.1;
};

var gp_dummy = new Gp_dummy();




