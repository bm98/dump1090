// JavaScript Document
// Handles the GlasPanel Vertial speed items
// this is a Vscale of 
"use strict";

// an object carrying the geometrical positions
// based on a 1000x1000 canvas - 
// some are calculated to avoid inconsistencies
function Vs_geo()
{
	// absolute pix in the canvas
	this.X    = alt_geo.X+alt_geo.W;   // X pos relative to Alt Indicator
	this.H    = 404;  // height
	this.Y    = alt_geo.Y+alt_geo.YC - this.H/2;  // Y pos relative to Alt Indicator
	this.W    = 106;  // width 

	// relative pix in the rect
	this.XC = this.W / 2; // rel center X
	this.YC = this.H / 2; // rel center Y
	
	//
	this.offset     = 45; // offset of the Scale items
	this.scale      = 10; // the scale number steps
	this.nPad       = "   "; // number pad format # digits expected
}

// the GEO instance to use
const vs_geo = new Vs_geo();

// The verticalSpeed object to use outside 
//   as_obj.draw() will do the job
const vs_obj = {
	// local only - draw the scale of the airspeed indicator
	drawScale : function()
	{
		//	we are at 0/0
		var ctx = gp_geo.Canvas.getContext("2d");
		
		ctx.beginPath();
		ctx.strokeStyle = gpGUI.colFrame;
		ctx.lineWidth=1;
		// dashes to the left, drawing from the vert center to aling nicely
		// larger ones for the set indicator
		ctx.lineWidth=2;
		var i;
		for ( i=-4; i<5; i++) {
			ctx.moveTo(0, vs_geo.YC + (i*vs_geo.offset));
			ctx.lineTo(20, vs_geo.YC + (i*vs_geo.offset));
		}
		// draw it
		ctx.stroke();
	},

	// MAIN call to draw the airspeed instrument
	draw : function(IVS) 
	{
		if ( IVS == null) return;
		IVS = Math.round(IVS);

		var ctx = gp_geo.Canvas.getContext("2d");

		var value = IVS; // set to uniform the routines

        ctx.save();
		// set the origin to pos of AS indicator and assume a relative drawing 
		ctx.translate(vs_geo.X, vs_geo.Y); 

		// frame and background		
		ctx.fillStyle = gpGUI.colFrame;
		ctx.strokeStyle = gpGUI.colFrame;
		ctx.globalAlpha=0.2; // draw transparent rectangle
		// draw the VS shape
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(vs_geo.XC, 0);
		ctx.lineTo(vs_geo.XC, vs_geo.YC-vs_geo.offset);
		ctx.lineTo(0, vs_geo.YC);
		ctx.lineTo(vs_geo.XC, vs_geo.YC+vs_geo.offset);
		ctx.lineTo(vs_geo.XC, vs_geo.H);
		ctx.lineTo(0, vs_geo.H);
		ctx.closePath();
		ctx.fill();
		ctx.lineWidth = 2;
		ctx.globalAlpha=0.8; // draw transparent rectangle frame
		ctx.stroke();

		// for the rest clip the usable area
		ctx.rect(1,1, vs_geo.W-2, vs_geo.H-2);
		ctx.clip();
		// makes the scale indicators
		this.drawScale();
		
		// draw scale numbers
		ctx.globalAlpha=1.0; // opaque
		ctx.font = gpGUI.font32;
		ctx.fillStyle = gpGUI.colSmoke; // almost white
		ctx.textAlign = "left";
		ctx.textBaseline="middle";
		// the number band
		ctx.fillText( "2", 22, vs_geo.YC-4*vs_geo.offset ); 
		ctx.fillText( "1", 22, vs_geo.YC-2*vs_geo.offset ); 
		ctx.fillText( "1", 22, vs_geo.YC+2*vs_geo.offset ); 
		ctx.fillText( "2", 22, vs_geo.YC+4*vs_geo.offset ); 

		// Show the set value on a black rect that is in line with the scale...
		// scale is 1000,2000 ft/min
		ctx.fillStyle = gpGUI.colBGLabel;
		ctx.strokeStyle = gpGUI.colFrame;
		// calc the position - but limit at +-2000
		var posVal = (value > 2000) ? 2000 : value;
		posVal = (posVal < -2000) ? -2000 : posVal;		
		var lPos = vs_geo.YC - (posVal / 500) * vs_geo.offset;
		// Label Shape
		ctx.beginPath();
		ctx.moveTo(2, lPos);
		ctx.lineTo(20, lPos-gpGUI.size24);
		ctx.lineTo(vs_geo.W-2, lPos-gpGUI.size24);
		ctx.lineTo(vs_geo.W-2, lPos+gpGUI.size24);
		ctx.lineTo(20, lPos+gpGUI.size24);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		// finally the indicated number
		ctx.font = gpGUI.font24;
		ctx.textAlign = "center";
		ctx.fillStyle = gpGUI.colWhite;
		ctx.fillText( value.toString(), vs_geo.XC, lPos);

		// leave with the origin reset to the canvas origin
        ctx.restore();
		
		// TESTING ONLY - incr by clicking
		CenterValue+=1;
	}
}





