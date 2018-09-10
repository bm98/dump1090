// JavaScript Document
// Handles the GlasPanel Altitude items
"use strict";

// an object carrying the geometrical positions
// based on a 1000x1000 canvas - 
// some are calculated to avoid inconsistencies
function Alt_geo()
{
	// absolute pix in the canvas
	this.X    = 730;   // X pos
//	this.X    = 150;   // DEVELOP
	this.Y    = 158;  // Y pos
	this.W    = 145;  // width
	this.H    = 430;  // height
	//  Baro Pressure
	this.BaroX = this.X;   		//  X pos
	this.BaroY = this.Y+this.H; // Y pos (below indicator)
	this.BaroW = this.W;  		// width
	this.BaroH = 40;   			// height MASTER for the others
	//  Set Alt (ft)
	this.SetAltX = this.BaroX;   	//  X pos
	this.SetAltH = this.BaroH;   	// height
	this.SetAltY = this.Y-this.SetAltH; // Y pos (above indicator)
	this.SetAltW = this.BaroW;  	// width
	//  Set Alt (ft)
	this.SetAltmX = this.BaroX;  	//  X pos
	this.SetAltmH = this.BaroH;  	// height
	this.SetAltmY = this.SetAltY-this.SetAltmH; // Y pos (above SetAlt)
	this.SetAltmW = this.BaroW; 	// width

	// relative pix in the rect
	this.XC = this.W / 2; // rel center X
	this.YC = this.H / 2; // rel center Y
	
	this.BaroXC = this.BaroW / 2; // rel center X
	this.BaroYC = this.BaroH / 2; // rel center Y
	
	this.SetAltXC = this.SetAltW / 2; // rel center X
	this.SetAltYC = this.SetAltH / 2; // rel center Y
	
	this.SetAltmXC = this.SetAltmW / 2; // rel center X
	this.SetAltmYC = this.SetAltmH / 2; // rel center Y
	
	//
	this.offset     = 65; // offset of the Scale items
	this.scale      = 10; // the scale number steps
	this.nPad       = "     "; // number pad format # digits expected
}

// the GEO instance to use
const alt_geo = new Alt_geo();

// The airspeed object to use outside 
//   alt_obj.draw() will do the job
const alt_obj = {
	// print baro pressure
	draw_baro : function(QNH, IALT)
	{
		if ( QNH == null) return;
		var BARO = Math.round(QNH);
		if ( IALT != null ) {
			BARO = pad(alt_geo.nPad, BARO.toString(), true) + " HPA";
			// can only switch if altitude is available
			/*
				Calc hPa from ft 	R² = 0.9995 (1013 .. 827 hPa)
				p = -0.0338 * h + 1010.9
				Calc ft from hPa
				h[ft] = (p - 1010.9) / -0.0338 
			*/
			// assume QNH is reasonable..
			// Calc FL_TA = TA - h(QNH)
			var trAlt =  20000; // [ft] get from config file or use the default set here
			if (typeof DefaultTransitionAltitude !== 'undefined') {
				trAlt = DefaultTransitionAltitude; // config value
			}
			var FL_TA = trAlt - ((QNH - 1010.9) / -0.0338 ); // fix for current barometer delta
			if ( IALT >= FL_TA ) {
				// switch to Standard Pressure above FL_TA
				BARO = "STD BARO";
			}
		}else {
			// if Alt is not avail we cannot switch at level - so indicate QNH usage
			BARO = "QNH " + pad(alt_geo.nPad, BARO.toString(), true);
		}
		var ctx = gp_geo.Canvas.getContext("2d");
		// set the origin to pos of Barometer field and assume a relative drawing 
        ctx.save();
			ctx.translate(alt_geo.BaroX, alt_geo.BaroY); 
			// frame and background		
			ctx.fillStyle = gpGUI.colBGLabel;
			ctx.strokeStyle = gpGUI.colFrame;
			ctx.fillRect(0,0, alt_geo.BaroW, alt_geo.BaroH);
			ctx.lineWidth = 2;
			ctx.strokeRect(0,0, alt_geo.BaroW, alt_geo.BaroH);
			// for the rest clip the usable area
			ctx.rect(1,1, alt_geo.BaroW-2, alt_geo.BaroH-2);
			ctx.clip();
			// finally the indicated number
			ctx.globalAlpha=1.0; // opaque
			ctx.font = gpGUI.font24;
			ctx.fillStyle = gpGUI.colNav;
			ctx.textAlign = "center";
			ctx.textBaseline="middle";
			ctx.fillText( BARO, alt_geo.BaroXC, alt_geo.BaroYC); // middle align
		// leave with the origin reset to the canvas origin
        ctx.restore();
	},
	
	// print set altitude
	draw_setAlt : function(SETALT)
	{
		if ( SETALT == null) return;
		SETALT = Math.round(SETALT);

		var ctx = gp_geo.Canvas.getContext("2d");
		// set the origin to pos of TAS field and assume a relative drawing 
        ctx.save();
			ctx.translate(alt_geo.SetAltX, alt_geo.SetAltY); 
			// frame and background		
			ctx.fillStyle = gpGUI.colBGLabel;
			ctx.strokeStyle = gpGUI.colFrame;
			ctx.fillRect(0,0, alt_geo.SetAltW, alt_geo.SetAltH);
			ctx.lineWidth = 2;
			ctx.strokeRect(0,0, alt_geo.SetAltW, alt_geo.SetAltH);
			// for the rest clip the usable area
			ctx.rect(1,1, alt_geo.SetAltW-2, alt_geo.SetAltH-2);
			ctx.clip();
			// finally the indicated number
			ctx.globalAlpha=1.0; // opaque
			ctx.font = gpGUI.font24;
			ctx.fillStyle = gpGUI.colNav;
			ctx.textAlign = "center";
			ctx.textBaseline="middle";
			ctx.fillText( pad(alt_geo.nPad, SETALT.toString(), true), alt_geo.SetAltXC, alt_geo.SetAltYC); // middle align
		// leave with the origin reset to the canvas origin
        ctx.restore();
	},

	// print Set altitude in meters
	draw_setAltm : function(SETALTM)
	{
		if ( SETALTM == null) return; // dont'r draw if not available
		SETALTM = Math.round(SETALTM);

		var ctx = gp_geo.Canvas.getContext("2d");
		// set the origin to pos of TAS field and assume a relative drawing 
        ctx.save();
			ctx.translate(alt_geo.SetAltmX, alt_geo.SetAltmY); 
			// frame and background		
			ctx.fillStyle = gpGUI.colBGLabel;
			ctx.strokeStyle = gpGUI.colFrame;
			ctx.fillRect(0,0, alt_geo.SetAltmW, alt_geo.SetAltmH);
			ctx.lineWidth = 2;
			ctx.strokeRect(0,0, alt_geo.SetAltmW, alt_geo.SetAltmH);
			// for the rest clip the usable area
			ctx.rect(1,1, alt_geo.SetAltmW-2, alt_geo.SetAltmH-2);
			ctx.clip();
			// finally the indicated number
			ctx.globalAlpha=1.0; // opaque
			ctx.font = gpGUI.font24;
			ctx.fillStyle = gpGUI.colNav;
			ctx.textAlign = "center";
			ctx.textBaseline="middle";
			ctx.fillText( pad(alt_geo.nPad, SETALTM.toString(), true) + " MT", alt_geo.SetAltmXC, alt_geo.SetAltmYC); // middle align
		// leave with the origin reset to the canvas origin
        ctx.restore();
	},
	
	
	// local only - draw the scale of the airspeed indicator
	drawScale : function(value)
	{
		var ctx = gp_geo.Canvas.getContext("2d");
		
		var part = value % alt_geo.scale;
        ctx.save();
			ctx.translate(0, part*(alt_geo.offset/10)); // set origin to pos of AS indicator
			ctx.beginPath();
			ctx.strokeStyle = gpGUI.colFrame;
			ctx.lineWidth=1;
			// dashes to the right, drawing from the vert center to aling nicely
			var i;
			for ( i=-5; i<7; i++) {
				ctx.moveTo( 0, alt_geo.YC + (i*alt_geo.offset/2));
				ctx.lineTo( 10, alt_geo.YC + (i*alt_geo.offset/2));
			}
			// larger ones for the set indicator
			ctx.lineWidth=2;
			for ( i=-3; i<4; i++) {
				ctx.moveTo(0, alt_geo.YC + (i*alt_geo.offset));
				ctx.lineTo(20, alt_geo.YC + (i*alt_geo.offset));
			}
			// draw it
			ctx.stroke();
		ctx.restore();
	},

	// MAIN call to draw the airspeed instrument
	draw : function(IALT, BARO, SETALT, SETALTM) 
	{
		var ctx = gp_geo.Canvas.getContext("2d");

		// sanity check
		var value = 0; // used as Input later
		// sanity check
		if ( IALT != null ) {
			IALT = Math.round(IALT);
			value = IALT; // set from IALT if available
		}
        ctx.save();
			// set the origin to pos of AS indicator and assume a relative drawing 
			ctx.translate(alt_geo.X, alt_geo.Y); 
	
			// frame and background		
			ctx.fillStyle = gpGUI.colFrame;
			ctx.strokeStyle = gpGUI.colFrame;
			ctx.globalAlpha=0.2; // draw transparent rectangle
			ctx.fillRect(0,0, alt_geo.W, alt_geo.H);
			ctx.globalAlpha=0.8; // draw transparent rectangle frame
			ctx.lineWidth = 2;
			ctx.strokeRect(0,0, alt_geo.W, alt_geo.H);
	
			// for the rest clip the usable area
			ctx.rect(1,1, alt_geo.W-2, alt_geo.H-2);
			ctx.clip();
			// makes the scale indicators
			this.drawScale(value);
			
			// draw scale numbers
			ctx.globalAlpha=1.0; // opaque
			ctx.font = gpGUI.font32;
			ctx.fillStyle = gpGUI.colSmoke; // almost white
			ctx.textAlign = "center";
			ctx.textBaseline="middle";
			// calc the in-betweens..
			var part = value % alt_geo.scale;
			var scaleValue = Math.floor(value/alt_geo.scale) * alt_geo.scale;
			// the number band
			var i;
			for ( i=-3; i<5; i++) {
				// vert pos of the number is centerY - Offset*Step +  Offset/Scale*part	
				ctx.fillText( pad(alt_geo.nPad, scaleValue + i * alt_geo.scale .toString(), true), 
					alt_geo.XC, 
					alt_geo.YC - i*alt_geo.offset + alt_geo.offset/alt_geo.scale * part); 
			}
			// Show the set value on a black rect
			ctx.fillStyle = gpGUI.colBGLabel;
			ctx.fillRect(20, alt_geo.YC-gpGUI.size32, alt_geo.W-2, gpGUI.size32*2);
			// Marker triangle
			ctx.beginPath();
			ctx.strokeStyle = gpGUI.colBGLabel;
			ctx.moveTo(20, alt_geo.YC - 8);
			ctx.lineTo(2, alt_geo.YC);
			ctx.lineTo(20, alt_geo.YC+8);
			ctx.closePath();
			ctx.fill();
			// finally the indicated number
			ctx.fillStyle = gpGUI.colWhite;
			if ( IALT != null ) {
				ctx.fillText( pad(alt_geo.nPad, value.toString(), true), alt_geo.XC, alt_geo.YC); // middle align
			}
			else {
				ctx.fillText( "- - - ", alt_geo.XC, alt_geo.YC); // middle align
			}
        ctx.restore();
		
		this.draw_baro(BARO, IALT);
		this.draw_setAlt(SETALT);
		this.draw_setAltm(SETALTM);
		
		// TESTING ONLY - incr by clicking
		CenterValue+=1;
	}
}





