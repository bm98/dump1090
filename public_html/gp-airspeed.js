// JavaScript Document
// Handles the GlasPanel Airspeed items
// this is a Vscale of 
"use strict";

// an object carrying the geometrical positions
// based on a 1000x1000 canvas - 
// some are calculated to avoid inconsistencies
function As_geo()
{
	// absolute pix in the canvas
	this.X    = 20;   // X pos
	this.Y    = 158;  // Y pos
	this.W    = 114;  // width
	this.H    = 430;  // height
	// TAS (true airspeed) label
	this.TasX = this.X;   		// X pos
	this.TasY = this.Y+this.H; 	// Y pos (below indicator)
	this.TasW = this.W;  		// width
	this.TasH = 40;   			// height
	// TAS (true airspeed) label
	this.MachX = this.X;   		// X pos
	this.MachY = this.TasY+this.TasH; 	// Y pos (below TAS)
	this.MachW = this.W;  		// width
	this.MachH = 40;   			// height

	// relative pix in the rect
	this.XC = this.W / 2; // rel center X
	this.YC = this.H / 2; // rel center Y
	// TAS (true airspeed) label
	this.TasXC = this.TasW / 2; // rel center X
	this.TasYC = this.TasH / 2; // rel center Y
	// Mach label
	this.MachXC = this.MachW / 2; // rel center X
	this.MachYC = this.MachH / 2; // rel center Y
	
	//
	this.offset     = 65; // offset of the Scale items
	this.scale      = 10; // the scale number steps
	this.nPad       = "   "; // number pad format # digits expected
}

// the GEO instance to use
const as_geo = new As_geo();

// The airspeed object to use outside 
//   as_obj.draw() will do the job
const as_obj = {
	// draw Mach label
	draw_mach : function(MACH)
	{
		if ( MACH == null) return;

		var ctx = gp_geo.Canvas.getContext("2d");
		// set the origin to pos of TAS field and assume a relative drawing 
        ctx.save();
			ctx.translate(as_geo.MachX, as_geo.MachY); 
			// frame and background		
			ctx.fillStyle = gpGUI.colBGLabel;
			ctx.strokeStyle = gpGUI.colFrame;
			ctx.fillRect(0,0, as_geo.MachW, as_geo.MachH);
			ctx.lineWidth = 2;
			ctx.strokeRect(0,0, as_geo.MachW, as_geo.MachH);
			// for the rest clip the usable area
			ctx.rect(1,1, as_geo.MachW-2, as_geo.MachH-2);
			ctx.clip();
			// finally the indicated number
			ctx.globalAlpha=1.0; // opaque
			ctx.font = gpGUI.font24;
			ctx.fillStyle = gpGUI.colWhite;
			ctx.textAlign = "center";
			ctx.textBaseline="middle";
			ctx.fillText( "M " + MACH.toFixed(3).toString(), as_geo.MachXC, as_geo.MachYC); // middle align
        ctx.restore();
	},
	// draw TAS label
	draw_tas : function(TAS)
	{
		if ( TAS == null) return;
		TAS = Math.round(TAS);

		var ctx = gp_geo.Canvas.getContext("2d");
		// set the origin to pos of TAS field and assume a relative drawing 
        ctx.save();
			ctx.translate(as_geo.TasX, as_geo.TasY); 
			// frame and background		
			ctx.fillStyle = gpGUI.colBGLabel;
			ctx.strokeStyle = gpGUI.colFrame;
			ctx.fillRect(0,0, as_geo.TasW, as_geo.TasH);
			ctx.lineWidth = 2;
			ctx.strokeRect(0,0, as_geo.TasW, as_geo.TasH);
			// for the rest clip the usable area
			ctx.rect(1,1, as_geo.TasW-2, as_geo.TasH-2);
			ctx.clip();
			// finally the indicated number
			ctx.globalAlpha=1.0; // opaque
			ctx.font = gpGUI.font24;
			ctx.fillStyle = gpGUI.colWhite;
			ctx.textAlign = "center";
			ctx.textBaseline="middle";
			ctx.fillText( "TAS " + pad(as_geo.nPad, TAS.toString(), true) + "KT", as_geo.TasXC, as_geo.TasYC); // middle align
        ctx.restore();
	},
	// local only - draw the scale of the airspeed indicator
	drawScale : function(value)
	{
		var ctx = gp_geo.Canvas.getContext("2d");

		var part = value % as_geo.scale;	// MOD operation
		
        ctx.save();
			ctx.translate(0, part*(as_geo.offset/10)); // set origin to pos of AS indicator
			ctx.beginPath();
			ctx.strokeStyle = gpGUI.colFrame;
			ctx.lineWidth=1;
			// dashes to the right, drawing from the vert center to aling nicely
			var i;
			for ( i=-5; i<7; i++) {
				ctx.moveTo( as_geo.W-10, as_geo.YC + (i*as_geo.offset/2));
				ctx.lineTo( as_geo.W, as_geo.YC + (i*as_geo.offset/2));
			}
			// larger ones for the set indicator
			ctx.lineWidth=2;
			for ( i=-3; i<4; i++) {
				ctx.moveTo(as_geo.W-20, as_geo.YC + (i*as_geo.offset));
				ctx.lineTo(as_geo.W, as_geo.YC + (i*as_geo.offset));
			}
			// draw it
			ctx.stroke();
		ctx.restore();
	},

	// MAIN call to draw the airspeed instrument
	draw : function(IAS, TAS, MACH) 
	{
		var ctx = gp_geo.Canvas.getContext("2d");
		IAS = Math.round(IAS);

		var value = IAS; // set to uniform the routines
//		value = CenterValue; // DEVELOP we take it from global until having a real number

        ctx.save();
			// set the origin to pos of AS indicator and assume a relative drawing 
			ctx.translate(as_geo.X, as_geo.Y); 
	
			// frame and background		
			ctx.fillStyle = gpGUI.colFrame;
			ctx.strokeStyle = gpGUI.colFrame;
			ctx.globalAlpha=0.2; // draw transparent rectangle
			ctx.fillRect(0,0, as_geo.W, as_geo.H);
			ctx.globalAlpha=0.8; // draw transparent rectangle frame
			ctx.lineWidth = 2;
			ctx.strokeRect(0,0, as_geo.W, as_geo.H);
	
			// for the rest clip the usable area
			ctx.rect(1,1, as_geo.W-2, as_geo.H-2);
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
			var part = value % as_geo.scale;	// MOD operation
			var scaleValue = Math.floor(value/as_geo.scale) * as_geo.scale; // DIV operation
			// the number band
			ctx.rect(1,1, as_geo.W-2, as_geo.H-2);
			ctx.clip();
			var i;
			for ( i=-3; i<5; i++) {
				// vert pos of the number is centerY - Offset*Step +  Offset/Scale*part	
				ctx.fillText( pad(alt_geo.nPad, scaleValue + i * as_geo.scale .toString(), true), 
					as_geo.XC, 
					as_geo.YC - i*as_geo.offset + as_geo.offset/as_geo.scale * part); 
			}
			// Show the set value on a black rect
			ctx.fillStyle = gpGUI.colBGLabel;
			ctx.fillRect(2, as_geo.YC-gpGUI.size32, as_geo.W-20, gpGUI.size32*2);
			// Marker triangle
			ctx.beginPath();
			ctx.strokeStyle = gpGUI.colBGLabel;
			ctx.moveTo(as_geo.W-20, as_geo.YC - 8);
			ctx.lineTo(as_geo.W-2, as_geo.YC);
			ctx.lineTo(as_geo.W-20, as_geo.YC+8);
			ctx.closePath();
			ctx.fill();
			// finally the indicated number
			ctx.fillStyle = gpGUI.colWhite;
			ctx.fillText( pad(as_geo.nPad, value.toString(), true), as_geo.XC, as_geo.YC); // middle align
	
			// leave with the origin reset to the canvas origin
        ctx.restore();
		
		this.draw_tas(TAS);
		this.draw_mach(MACH);
	},
	
}





