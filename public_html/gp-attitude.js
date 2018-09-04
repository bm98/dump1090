// JavaScript Document
// Glas Panel Attitude display
// GP assumes a 1000x1000 canvas - sould be possible to scale it down
// Expects a Canvas wtih ID  'GlasPanel'
"use strict";


// Panel geometries
function At_geo()
{
	// absolute pix in the canvas
	this.X    = gp_geo.X;   // X pos
	this.Y    = gp_geo.Y;  // Y pos
	this.W    = gp_geo.W;  // width
	this.H    = gp_geo.H;  // height
	// relative pix in the rect
	this.XC = this.W / 2; // rel center X
	this.YC = this.H / 2; // rel center Y
	//
	this.RollXC = gp_geo.RollXC;    // Roll Center X
	this.RollYC = gp_geo.RollYC;    // Roll Center Y
	
	this.HeadH = gp_geo.HeadH;  // Headline heigt
	this.FootH = gp_geo.FootH;
	//
	
	// plane fixup
	this.FixX = 420; this.FixY = 373; 
	this.FixW = 200; this.FixH = 80;
	
	this.TIndX = this.RollXC; this.TIndY = 128; 
	
	this.DegOffset = 10;  // pixel offset per degree vertical
	
	this.DegScaleMax = +20; // max angle show at level
	this.DegScaleMin = -15; // min angle show at level
	this.DegShownMax = +50; // max angle of the plane to show
	this.DegShownMin = -50; // min angle of the plane to show
}

const at_geo = new At_geo();

const at_obj = {
	// calc the ascent, descent angle in Rad
	ad_angleRad : function(GS, VR){ // GroundSpeed [KN], vert.rate [ft/min]
		const ftPerNM = 6078.1;
		/*
			atan ( VR / ( GS*ftPerKN / 60 ) )
		*/
		return Math.atan2( (VR * 60.0), (GS * ftPerNM) );
	},
	// as above in Deg
	ad_angleDeg : function(GS, VR){ // GroundSpeed [KN], vert.rate [ft/min]
		return (this.ad_angleRad(GS, VR) * 180 / Math.PI );
	},
	
	// background - sky and ground
	drawBack : function(ROLL, GS, VR)
	{
		// some preCalc
		// defaults at plane -> level (or data not available)
		var rollAngle = 0;
		var canRoll = false;
		if ( ROLL != null ){
			rollAngle = ROLL;
			canRoll = true;
		}
		
		var adAngleDeg = 0;
		var maxAngle  = at_geo.DegScaleMax;
		var minAngle  = at_geo.DegScaleMin;
		var canAD = false;
		if ( GS != null && VR != null){
			adAngleDeg = this.ad_angleDeg(GS, VR);
			adAngleDeg = (adAngleDeg > at_geo.DegShownMax) ? at_geo.DegShownMax : adAngleDeg ; // limit to not kill the display
			adAngleDeg = (adAngleDeg < at_geo.DegShownMin) ? at_geo.DegShownMin : adAngleDeg ; // limit to not kill the display
			maxAngle += adAngleDeg; minAngle += adAngleDeg; // new scale adjusted to current AD angle
			maxAngle = Math.floor(maxAngle / 5) * 5;
			minAngle = Math.ceil(minAngle / 5) * 5;
			canAD = true;
		}
		const adOffset = adAngleDeg * at_geo.DegOffset; // pos angle -> pos offset (shifts the background down)

		// use a second canvas to draw the background with roll 
		// then blit it into our master canvas
		var canvasL = document.createElement('canvas');
		canvasL.width = 1800; canvasL.height = 1800; // big enough to not clip at turns
		canvasL.style.zIndex = 8;
		canvasL.style.position = "absolute";
		canvasL.style.border = "0px solid";
		var ctxL = canvasL.getContext("2d");
		// set center of roll to 0/0
		ctxL.translate(canvasL.width/2, canvasL.height/2);
		// -rot around the roll rate (to draw upright)
		ctxL.rotate(-rollAngle*Math.PI/180);
		ctxL.translate(0, +adOffset); // shift correct
		
		// paint with center of the canvas = 0/0
		// gradients are made of plane size to not bleed out the middle section
		var sky_gradient = ctxL.createLinearGradient(-canvasL.width/2, -canvasL.height/2, -canvasL.width/2, canvasL.height*0.75);
		sky_gradient.addColorStop(0, gpGUI.colSky);
		sky_gradient.addColorStop(1, gpGUI.colSmoke);
		var ground_gradient = ctxL.createLinearGradient(-canvasL.width/2, -canvasL.height/2, -canvasL.width/2, canvasL.height );
		ground_gradient.addColorStop(0, gpGUI.colSmoke);
		ground_gradient.addColorStop(1, gpGUI.colGround);
		// fill sky half
		ctxL.fillStyle=sky_gradient;
		ctxL.fillRect(-canvasL.width/2, -canvasL.height/2, canvasL.width, canvasL.height/2);
		// fill ground half
		ctxL.fillStyle=ground_gradient;
		ctxL.fillRect(-canvasL.width/2, 0, canvasL.width, canvasL.height/2);

		// horizon line
		ctxL.strokeStyle = gpGUI.colSmoke;
		ctxL.lineWidth=3;
		ctxL.beginPath();
		ctxL.moveTo(-canvasL.width/2, 0); ctxL.lineTo(canvasL.width/2, 0);
		ctxL.stroke();

		// turn scale
		if (canRoll===true) {
			ctxL.save();
				ctxL.translate(0, -adOffset); // shift correct
				const rollYC = at_geo.RollYC; 
				// marker triangle
				ctxL.fillStyle = gpGUI.colSmoke;
				ctxL.beginPath();
				ctxL.moveTo(0,at_geo.TIndY-rollYC); // point bottom
				ctxL.lineTo(-15, at_geo.TIndY-rollYC-26); ctxL.lineTo(+15, at_geo.TIndY-rollYC-26);  
				ctxL.closePath();
				ctxL.fill();
				// circle
				ctxL.lineWidth = 3;
				ctxL.strokeStyle = gpGUI.colSmoke;
				ctxL.beginPath(); 
					ctxL.arc(0, 0, rollYC-at_geo.TIndY, (-90-60)*Math.PI/180, (-90+60)*Math.PI/180 );
				ctxL.stroke();
				// Scale markers at -60,-45,-30,-20,-10, +10,+20,+30,+45,+60
				ctxL.rotate(-60.0*Math.PI/180);
				ctxL.beginPath();ctxL.moveTo(0,at_geo.TIndY-rollYC); ctxL.lineTo(0, at_geo.TIndY-rollYC-26); 
				ctxL.stroke();
				ctxL.rotate(15.0*Math.PI/180); // -45
				ctxL.beginPath(); ctxL.moveTo(0,at_geo.TIndY-rollYC); ctxL.lineTo(0, at_geo.TIndY-rollYC-13); 
				ctxL.stroke();
				ctxL.rotate(15.0*Math.PI/180); // -30
				ctxL.beginPath(); ctxL.moveTo(0,at_geo.TIndY-rollYC); ctxL.lineTo(0, at_geo.TIndY-rollYC-26); 
				ctxL.stroke();
				ctxL.rotate(10.0*Math.PI/180); // -20
				ctxL.beginPath(); ctxL.moveTo(0,at_geo.TIndY-rollYC); ctxL.lineTo(0, at_geo.TIndY-rollYC-13); 
				ctxL.stroke();
				ctxL.rotate(10.0*Math.PI/180); // -10
				ctxL.beginPath(); ctxL.moveTo(0,at_geo.TIndY-rollYC); ctxL.lineTo(0, at_geo.TIndY-rollYC-13); 
				ctxL.stroke();
	
				ctxL.rotate(10.0*Math.PI/180); // at N
				
				ctxL.rotate(10.0*Math.PI/180); // +10 
				ctxL.beginPath(); ctxL.moveTo(0,at_geo.TIndY-rollYC); ctxL.lineTo(0, at_geo.TIndY-rollYC-13); 
				ctxL.stroke();
				ctxL.rotate(10.0*Math.PI/180); // +20
				ctxL.beginPath(); ctxL.moveTo(0,at_geo.TIndY-rollYC); ctxL.lineTo(0, at_geo.TIndY-rollYC-13); 
				ctxL.stroke();
				ctxL.rotate(10.0*Math.PI/180); // +30
				ctxL.beginPath(); ctxL.moveTo(0,at_geo.TIndY-rollYC); ctxL.lineTo(0, at_geo.TIndY-rollYC-26); 
				ctxL.stroke();
				ctxL.rotate(15.0*Math.PI/180); // +45
				ctxL.beginPath(); ctxL.moveTo(0,at_geo.TIndY-rollYC); ctxL.lineTo(0, at_geo.TIndY-rollYC-13); 
				ctxL.stroke();
				ctxL.rotate(15.0*Math.PI/180); // +60
				ctxL.beginPath();ctxL.moveTo(0,at_geo.TIndY-rollYC); ctxL.lineTo(0, at_geo.TIndY-rollYC-26); 
				ctxL.stroke();
			ctxL.restore();
		}

		// the vertical scale ad angle
		if ( canAD === true ) {
			ctxL.font = gpGUI.font24s;
			ctxL.textBaseline="middle";
			ctxL.fillStyle = gpGUI.colSmoke;
	
			ctxL.lineWidth = 3;
			ctxL.strokeStyle = gpGUI.colSmoke;
			ctxL.beginPath();
			var i;
			for (i=minAngle; i<=maxAngle; i+=5){
				if ( (i%10)==0 ) {
					ctxL.moveTo(-50, -i*at_geo.DegOffset); ctxL.lineTo(50, -i*at_geo.DegOffset);
					ctxL.textAlign = "right"; ctxL.fillText(i.toString(), -55, -i*at_geo.DegOffset );
					ctxL.textAlign = "left"; ctxL.fillText(i.toString(), +55, -i*at_geo.DegOffset );
				} else {
					ctxL.moveTo(-25, -i*at_geo.DegOffset); ctxL.lineTo(25, -i*at_geo.DegOffset);
				}
			}
			ctxL.stroke();
		}
		
		// blit it into our canvas with center of our center of rotation
		var ctx = gp_geo.Canvas.getContext("2d");
	    ctx.save();
			ctx.rect(at_geo.X, at_geo.Y+at_geo.HeadH, at_geo.W, at_geo.H-at_geo.HeadH-at_geo.FootH ); // inner part only
			ctx.clip(); // clip usable area
			// copy drawn canvas center adjusted to AD and Roll into our used canvas
			const xcorr = Math.tan(rollAngle*Math.PI/180)*adOffset;
//			ctx.drawImage(canvasL, canvasL.width/2-at_geo.RollXC-xcorr, canvasL.height/2-at_geo.RollYC-adOffset, at_geo.W, at_geo.H, 0, 0, at_geo.W, at_geo.H);
			ctx.drawImage(canvasL, canvasL.width/2-at_geo.RollXC, canvasL.height/2-at_geo.RollYC, at_geo.W, at_geo.H, 0, 0, at_geo.W, at_geo.H);
	    ctx.restore();
	},

	// fixed plane horizon
	drawFixup : function()
	{
		var ctx = gp_geo.Canvas.getContext("2d");
	    ctx.save();
			ctx.translate(at_geo.FixX, at_geo.FixY);

			var gradient = ctx.createLinearGradient(0,0,0,at_geo.FixH*2);
			gradient.addColorStop(0, gpGUI.colYellow);
			gradient.addColorStop(1, gpGUI.colBlack);
		
			ctx.fillStyle = gradient;
			ctx.beginPath();
			ctx.moveTo(0,0);
			ctx.lineTo(-at_geo.FixW/2, at_geo.FixH); ctx.lineTo(-at_geo.FixW/2+10, at_geo.FixH); 
			ctx.lineTo(0, at_geo.FixH/3);
			ctx.lineTo(+at_geo.FixW/2-10, at_geo.FixH); ctx.lineTo(+at_geo.FixW/2, at_geo.FixH); 
			ctx.closePath();
			ctx.fill();
			
			gradient.addColorStop(0.03, gpGUI.colBlack);
			ctx.strokeStyle = gradient;
			// left side			
			ctx.beginPath();
			ctx.moveTo(-at_geo.FixW, -3); ctx.lineTo(-at_geo.FixW/2, -3); 
			ctx.lineTo(-at_geo.FixW/2+5, 0);
			ctx.lineTo(-at_geo.FixW/2, +3); ctx.lineTo(-at_geo.FixW, +3);
			ctx.closePath();
			ctx.fill();
			// right side
			ctx.beginPath();
			ctx.moveTo(+at_geo.FixW, -3); ctx.lineTo(+at_geo.FixW/2, -3); 
			ctx.lineTo(+at_geo.FixW/2-5, 0);
			ctx.lineTo(+at_geo.FixW/2, +3); ctx.lineTo(+at_geo.FixW, +3);
			ctx.closePath();
			ctx.fill();
	    ctx.restore();
	},
	
	// Turn Indicator 
	drawTurnIndicator : function()
	{
		var ctx = gp_geo.Canvas.getContext("2d");
		// turn indicator
	    ctx.save();
			// turn center
			ctx.translate(at_geo.RollXC, at_geo.RollYC); 
			// turn to draw upright
			// turn triangle
			ctx.fillStyle = gpGUI.colSmoke;
			ctx.beginPath();
			ctx.moveTo(0,at_geo.TIndY-at_geo.RollYC); // point top
			ctx.lineTo(-15, at_geo.TIndY-at_geo.RollYC+26); ctx.lineTo(+15, at_geo.TIndY-at_geo.RollYC+26);  
			ctx.closePath();
			ctx.fill();
	    ctx.restore();
	},
	
	// Draw all of this
	drawAttitude : function(ROLL, GS, VR) // roll , ground speed, vertical_rate
	{
		this.drawBack(ROLL, GS, VR);
		this.drawFixup();
		this.drawTurnIndicator();
	},
}

