// JavaScript Document
// Glas Panel Base
// GP assumes a 1000x1000 canvas - sould be possible to scale it down
// Expects a Canvas wtih ID  'GlasPanel'
"use strict";

var Scale = 1.0;

// Panel geometries
function Gp_geo()
{
	// absolute pix in the canvas
	this.X    = 0;   // X pos
	this.Y    = 0;  // Y pos
	this.W    = 1000;  // width
	this.H    = 1000;  // height
	// relative pix in the rect
	this.XC = this.W / 2; // rel center X
	this.YC = this.H / 2; // rel center Y
	//
	this.RollXC = 420;    // Roll Center X
	this.RollYC = 373;    // Roll Center Y
	
	this.Div1X = 352;
	this.Div2X = 822;
	
	this.HeadH = 77;  // Headline heigt
	this.FootH = 40;
	//
	this.CallRegX = 10;
	this.CallRegY = 4;
	this.CallRegW = 328;
	this.CallRegH = 70;
	this.CallRegXC = this.CallRegW/2;
	this.CallRegYC = this.CallRegH/2;
	
	this.IacoX = this.Div2X+4;
	this.IacoY = 4;
	this.IacoW = 170;
	this.IacoH = 70;
	this.IacoXC = this.IacoW/2;
	this.IacoYC = this.IacoH/2;
	
	this.SqkW = 236;
	this.SqkH = 40;
	this.SqkX = 596;
	this.SqkY = this.H-this.FootH-this.SqkH-1;
	this.SqkXC = this.SqkW/2;
	this.SqkYC = this.SqkH/2;
	
	this.UtcW = 168;
	this.UtcH = 40;
	this.UtcX = 832;
	this.UtcY = this.H-this.FootH-this.UtcH-1;
	this.UtcXC = this.UtcW/2;
	this.UtcYC = this.UtcH/2;
	
	
	this.LblX = this.Div1X+8; this.LblY = 1;
	this.LblW = 25; this.LblH = 36;
	this.FldW = 120; this.FldH = 36;
	this.LblCX = this.LblW/2; this.LblCY = this.LblH/2;
	this.FldCX = this.FldW/2; this.FldCY = this.FldH/2;
	
	
	this.offset     = 65; // offset of the Scale items
	this.scale      = 10; // the scale number steps
	
	this.Canvas = null;
	this.FlagLoaded = false;
}

const gp_geo = new Gp_geo();

const gp_obj = {
// Draw basic elements of the GP
	drawHeader : function(selPlane)
	{
		// top
		var ctx = gp_geo.Canvas.getContext("2d");
		ctx.fillStyle = gpGUI.colBGLabel;
		ctx.strokeStyle = gpGUI.colFrame; ctx.lineWidth = 2;
		ctx.fillRect(gp_geo.X, gp_geo.Y, gp_geo.W, gp_geo.HeadH); ctx.strokeRect(gp_geo.X, gp_geo.Y, gp_geo.W, gp_geo.HeadH);
		ctx.fillRect(gp_geo.X, gp_geo.Y+gp_geo.H-gp_geo.FootH, gp_geo.W, gp_geo.FootH); ctx.strokeRect(gp_geo.X, gp_geo.Y+gp_geo.H-gp_geo.FootH, gp_geo.W, gp_geo.FootH);

		ctx.strokeStyle = gpGUI.colFrame;
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(gp_geo.Div1X, gp_geo.Y);
		ctx.lineTo(gp_geo.Div1X, gp_geo.Y+gp_geo.HeadH);
		ctx.moveTo(gp_geo.Div2X, gp_geo.Y);
		ctx.lineTo(gp_geo.Div2X, gp_geo.Y+gp_geo.HeadH);
		// hor
		ctx.moveTo(gp_geo.Div1X, gp_geo.Y+gp_geo.HeadH/2);
		ctx.lineTo(gp_geo.Div2X, gp_geo.Y+gp_geo.HeadH/2);
		ctx.stroke();
		
		ctx.globalAlpha=1.0; // opaque

		// flag and country
		ctx.font = gpGUI.font18s;
		ctx.fillStyle = gpGUI.colWhite;
		ctx.textAlign = "left";	ctx.textBaseline="top";
		ctx.fillText(selPlane.icaorange.country, gp_geo.X+40,5);
		if ( selPlane.icaorange.flag_image !== null) {
			var flagImg = new Image();
			flagImg.onload = function() {			
				gp_geo.FlagLoaded=true; // have to wait until the flag is loaded (first time only)
			}
			flagImg.src = "flags-tiny/" + selPlane.icaorange.flag_image; // can also be a remote URL e.g. http://
			if (gp_geo.FlagLoaded == true ) {
				ctx.drawImage(flagImg, gp_geo.X+6,5); // now draw it
			}
		}
		// airframe type
		ctx.textAlign = "right"; ctx.textBaseline="top";
		// sanity for null values
		var icaotype = "- - - ";
		var flight = "- - - ";
		var registration =  "- - - ";
		if ( selPlane.icaotype != null ) {
			icaotype = selPlane.icaotype;
		}		
		if ( selPlane.flight != null ) {
			flight = selPlane.flight;
		}
		if ( selPlane.registration != null ) {
			registration = selPlane.registration;
		}
		// Airframe type
		ctx.fillText(icaotype, gp_geo.Div1X-10,5);

		// callsign - register
		ctx.font = gpGUI.font24s;
		ctx.fillStyle = gpGUI.colWhite;
		ctx.textAlign = "center"; ctx.textBaseline="top";
	    ctx.save();
			ctx.translate(gp_geo.CallRegX, gp_geo.CallRegY);
			// sanity for null values
			ctx.fillText( flight + "   " + registration, gp_geo.CallRegXC, gp_geo.CallRegYC); // middle align
	    ctx.restore();

	    ctx.save();
		// IACO
		ctx.textAlign = "center"; ctx.textBaseline="middle";
			ctx.font = gpGUI.font32;
			ctx.fillStyle = gpGUI.colYellow;
			ctx.translate(gp_geo.IacoX, gp_geo.IacoY);
			ctx.fillText( selPlane.icao, gp_geo.IacoXC, gp_geo.IacoYC); // middle align
	    ctx.restore();

		ctx.save();
		// Fld Labels- upper half LAT, LON, DIS
			ctx.font = gpGUI.font18;
			ctx.textBaseline="bottom";
			ctx.textAlign = "left";
			ctx.fillStyle = gpGUI.colWhite;
			ctx.translate(gp_geo.LblX, gp_geo.LblY); // go from Div1 divider
			ctx.fillText( "LAT", 0, gp_geo.LblH); // bottom align
			ctx.fillText( "LON", gp_geo.LblW+gp_geo.FldW+8, gp_geo.LblH); // bottom align
			ctx.fillText( "DIS", (gp_geo.LblW+gp_geo.FldW+8)*2, gp_geo.LblH); // bottom align
			ctx.font = gpGUI.font24;
			ctx.textAlign = "right";
			ctx.fillStyle = gpGUI.colPurple;
			if ( selPlane.position != null){
				ctx.fillText( selPlane.position[0].toFixed(4).toString() + "°" , gp_geo.LblW+gp_geo.FldW, gp_geo.LblH);
				ctx.fillText( selPlane.position[1].toFixed(4).toString() + "°" , (gp_geo.LblW+gp_geo.FldW)*2+4, gp_geo.LblH);
			}
			if ( selPlane.sitedist != null ){
				ctx.fillText( (selPlane.sitedist/1852).toFixed(0).toString() + " NM" , (gp_geo.LblW+gp_geo.FldW)*3+5, gp_geo.LblH);
			}
		ctx.restore();

	    ctx.save();
		// Fld Labels- lower half ROLL, TRACK, GS
			ctx.font = gpGUI.font18;
			ctx.textBaseline="bottom";
			ctx.textAlign = "left";
			ctx.fillStyle = gpGUI.colWhite;
			ctx.translate(gp_geo.LblX, gp_geo.LblY+gp_geo.LblH); // go from Div1 divider
			ctx.fillText( "Roll", 0, gp_geo.LblH); // bottom align
			ctx.fillText( "Track", gp_geo.LblW+gp_geo.FldW+8, gp_geo.LblH); // bottom align
			ctx.fillText( "GS", (gp_geo.LblW+gp_geo.FldW+8)*2, gp_geo.LblH); // bottom align
			ctx.font = gpGUI.font24;
			ctx.textAlign = "right";
			ctx.fillStyle = gpGUI.colPurple;
			if ( selPlane.roll != null ){
				ctx.fillText( selPlane.roll.toFixed(2).toString() + "°" , gp_geo.LblW+gp_geo.FldW, gp_geo.LblH);
			}
			else {
				ctx.fillText( "- - - " , gp_geo.LblW+gp_geo.FldW, gp_geo.LblH);
			}
			if ( selPlane.track_rate != null ){
				ctx.fillText( selPlane.track_rate.toFixed(2).toString() + "r", (gp_geo.LblW+gp_geo.FldW)*2+4, gp_geo.LblH);
			}
			else {
				ctx.fillText( "- - - ", (gp_geo.LblW+gp_geo.FldW)*2+4, gp_geo.LblH);
			}
			if ( selPlane.gs != null ){
				ctx.fillText( selPlane.gs.toFixed(0).toString() + " KT" , (gp_geo.LblW+gp_geo.FldW)*3+5, gp_geo.LblH);
			}
			else {
				ctx.fillText( "- - - " , (gp_geo.LblW+gp_geo.FldW)*3+5, gp_geo.LblH);
			}
	    ctx.restore();
	},
	
	drawSquawk : function(selPlane)
	{
		if ( selPlane.squawk == null) return;
		// top
		var ctx = gp_geo.Canvas.getContext("2d");
		
		const sqw = selPlane.squawk.toString();
	
		ctx.save();
			ctx.translate(gp_geo.SqkX, gp_geo.SqkY);

			ctx.strokeStyle = gpGUI.colFrame; ctx.lineWidth = 2;
			ctx.font = gpGUI.font24;
			ctx.fillStyle = gpGUI.colWhite;
			ctx.textAlign = "center";
			ctx.textBaseline="bottom";
			if ( sqw === "7500" ){ //Aircraft Hijacking
				ctx.fillStyle = gpGUI.colHJack; ctx.fillRect(0, 0, gp_geo.SqkW, gp_geo.SqkH); ctx.strokeRect(0, 0, gp_geo.SqkW, gp_geo.SqkH);
				ctx.font = gpGUI.font24; ctx.fillStyle = gpGUI.colWhite;
				ctx.fillText("XPDR               ", gp_geo.SqkXC, gp_geo.SqkH);
				ctx.font = gpGUI.font32; ctx.fillStyle = gpGUI.colSqw;
				ctx.fillText("  " + sqw.toString() + " HJ", gp_geo.SqkXC, gp_geo.SqkH);				
			} else if ( sqw === "7600" ){ // Radio Failure
				ctx.fillStyle = gpGUI.colRadioF; ctx.fillRect(0, 0, gp_geo.SqkW, gp_geo.SqkH); ctx.strokeRect(0, 0, gp_geo.SqkW, gp_geo.SqkH);
				ctx.font = gpGUI.font24; ctx.fillStyle = gpGUI.colWhite;
				ctx.fillText("XPDR               ", gp_geo.SqkXC, gp_geo.SqkH);
				ctx.font = gpGUI.font32; ctx.fillStyle = gpGUI.colSqw;
				ctx.fillText("  " + sqw.toString() + " RF", gp_geo.SqkXC, gp_geo.SqkH);				
			} else if ( sqw === "7700" )  { // General Emergency
				ctx.fillStyle = gpGUI.colEmerg; ctx.fillRect(0, 0, gp_geo.SqkW, gp_geo.SqkH); ctx.strokeRect(0, 0, gp_geo.SqkW, gp_geo.SqkH);
				ctx.font = gpGUI.font24; ctx.fillStyle = gpGUI.colWhite;
				ctx.fillText("XPDR               ", gp_geo.SqkXC, gp_geo.SqkH);
				ctx.font = gpGUI.font32; ctx.fillStyle = gpGUI.colSqw;
				ctx.fillText("  " + sqw.toString() + " GE", gp_geo.SqkXC, gp_geo.SqkH);				
			} else { // normal
				ctx.fillStyle = gpGUI.colBGLabel; ctx.fillRect(0, 0, gp_geo.SqkW, gp_geo.SqkH); ctx.strokeRect(0, 0, gp_geo.SqkW, gp_geo.SqkH);
				ctx.font = gpGUI.font24; ctx.fillStyle = gpGUI.colWhite;
				ctx.fillText("XPDR               ", gp_geo.SqkXC, gp_geo.SqkH);
				ctx.font = gpGUI.font32; ctx.fillStyle = gpGUI.colSqw;
				ctx.fillText("  " + sqw.toString(), gp_geo.SqkXC, gp_geo.SqkH);				
			}
			
		ctx.restore();		
	},

	drawUtc : function()
	{
		// top
		var ctx = gp_geo.Canvas.getContext("2d");
		
	    const today = new Date();
		const us = today.toISOString().slice(11, 19); //		"2018-09-01T23:01:38.021Z"
		ctx.save();
			ctx.translate(gp_geo.UtcX, gp_geo.UtcY);

			ctx.strokeStyle = gpGUI.colFrame; ctx.lineWidth = 2;
			ctx.font = gpGUI.font24;
			ctx.fillStyle = gpGUI.colWhite;
			ctx.textAlign = "center";
			ctx.textBaseline="bottom";
			ctx.fillStyle = gpGUI.colBGLabel; ctx.fillRect(0, 0, gp_geo.UtcW, gp_geo.UtcH); ctx.strokeRect(0, 0, gp_geo.UtcW, gp_geo.UtcH);
			ctx.font = gpGUI.font24; ctx.fillStyle = gpGUI.colWhite;
			ctx.fillText("UTC " + us, gp_geo.UtcXC, gp_geo.UtcH);
		ctx.restore();		
	},
}


// all initialization
function gp_init()
{
	// our 1000x1000	
	gp_geo.Canvas = document.createElement('canvas');
	gp_geo.Canvas.id = "GPanel";
	gp_geo.Canvas.width = 1000;
	gp_geo.Canvas.height = 1000;
	gp_geo.Canvas.style.zIndex = 8;
	gp_geo.Canvas.style.position = "absolute";
	gp_geo.Canvas.style.border = "0px solid";
}

// Update all of the Glas Planel (selPlane is planeObject Type)
function gp_update(canvasName, selPlane)
{
	if (typeof selPlane === 'undefined') {
		return;
	}
	//our drawing canvas
	var ctx = gp_geo.Canvas.getContext("2d");
	// clear area
	ctx.clearRect(0, 0, gp_geo.Canvas.width, gp_geo.Canvas.height);
	
	at_obj.drawAttitude(selPlane.roll, selPlane.gs, selPlane.vert_rate); // ROLL, GS, VR - roll , ground speed, vertical rate

	gp_obj.drawHeader(selPlane);
	gp_obj.drawSquawk(selPlane);
	gp_obj.drawUtc();
	
    ctx.save();
		// restrict to main area w/o header and footer
		ctx.rect(gp_geo.X, gp_geo.Y+gp_geo.HeadH, gp_geo.W, gp_geo.H-gp_geo.HeadH-gp_geo.FootH ); // inner part only
		ctx.clip()
		as_obj.draw(selPlane.ias, selPlane.tas, selPlane.mach); // IAS, TAS, MACH
		// sanity for null values
		var setaltm = null;
		if ( selPlane.nav_altitude != null) {
			setaltm = convert_altitude(selPlane.nav_altitude, "metric");
		}
		alt_obj.draw(selPlane.altitude, selPlane.nav_qnh, 
					 selPlane.nav_altitude, setaltm ); // IALT, BARO, SETALT, SETALTM
		vs_obj.draw(selPlane.vert_rate);
		comp_obj.draw(selPlane.mag_heading, selPlane.nav_heading, selPlane.track, selPlane.track_rate); //THEAD, NHEAD, TRACK, TRACKRATE
		iw_obj.drawInfowindow(selPlane);
    ctx.restore();
	// finally - paint it streched / reduced onto the HTML canvas
	// external canvas to draw to 
	var dstCanvas = document.getElementById(canvasName);
	var destCtx = dstCanvas.getContext("2d");
	destCtx.clearRect(0, 0, dstCanvas.width, dstCanvas.height);
	destCtx.drawImage(gp_geo.Canvas, 0, 0, gp_geo.Canvas.width, gp_geo.Canvas.height, 
									 0, 0, dstCanvas.width, dstCanvas.width); // square image where width is the master
	
	if ( GP_DUMMY ) {
		gp_dummy.update();
	}

}



