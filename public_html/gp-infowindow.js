// JavaScript Document
// Glas Panel Base
// GP assumes a 1000x1000 canvas - sould be possible to scale it down
// Expects a Canvas wtih ID  'GlasPanel'
"use strict";

// Panel geometries
function Iw_geo()
{
	// absolute pix in the canvas
	this.W    = 330; this.H    = 160;  // height
	this.X    = gp_geo.X+gp_geo.W-this.W-1;  // 1 from the right 
	this.Y    = gp_geo.UtcY-this.H-1; 

	// relative pix in the rect
	this.XC = this.W / 2; // rel center X
	this.YC = this.H / 2; // rel center Y
	// relative to the window above
	this.LblX = 8; this.LblW = this.XC-this.LblX*2; this.LblH = 30;
	this.LblY = 8;
	this.FldX = this.LblX+this.LblW+8; this.FldW = this.LblW; // hight from Label
	this.FldY = this.LblY;
	
	this.offset     = this.LblH+5; // offset of the items
}

const iw_geo = new Iw_geo();

const iw_obj = {
// Draw the Infowindow contents
	dataSource : function(selPlane)
	{
        if (selPlane.getDataSource() === "adsb_icao") {
        	return "ADS-B";
        } else if (selPlane.getDataSource() === "tisb_trackfile" || selPlane.getDataSource() === "tisb_icao" || selPlane.getDataSource() === "tisb_other") {
        	return "TIS-B";
        } else if (selPlane.getDataSource() === "mlat") {
        	return "MLAT";
        } else {
        	return"Other";
        }	
	},
	
	instrument : function(selPlane)
	{
        if (selPlane.version == null) {
        	return 'none';
        } else if (selPlane.version == 0) {
            return 'v0 (DO-260)';
        } else if (selPlane.version == 1) {
            return 'v1 (DO-260A)';
        } else if (selPlane.version == 2) {
            return 'v2 (DO-260B)';
        } else {
            return 'v' + selPlane.version;
        }
	},

	lastSeen : function(selPlane)
	{
        if (selPlane.seen<0.2) {
        	return 'now';
        } else {
            return selPlane.seen.toFixed(1) + "s";
        }
	},

	drawInfowindow : function(selPlane)
	{
		// top
		var ctx = gp_geo.Canvas.getContext("2d");
		
		ctx.save();
			ctx.translate(iw_geo.X, iw_geo.Y); // locate window
			// draw window
			ctx.strokeStyle = gpGUI.colFrame; ctx.fillStyle = gpGUI.colBGLabel; ctx.lineWidth = 2;
			ctx.fillRect(0,0, iw_geo.W, iw_geo.H);
			ctx.strokeRect(0,0, iw_geo.W, iw_geo.H);
						
			// Labels and content
			ctx.font = gpGUI.font18;
			ctx.fillStyle = gpGUI.colWhite;
			ctx.textAlign = "left";
			ctx.textBaseline="bottom";
			var i = 0;
			ctx.fillText("Contact", iw_geo.LblX, iw_geo.LblY+iw_geo.LblH+i*iw_geo.offset); i++;
			ctx.fillText("RSSI", iw_geo.LblX, iw_geo.LblY+iw_geo.LblH+i*iw_geo.offset); i++;
			ctx.fillText("Source", iw_geo.LblX, iw_geo.LblY+iw_geo.LblH+i*iw_geo.offset); i++;
			ctx.fillText("Instrument", iw_geo.LblX, iw_geo.LblY+iw_geo.LblH+i*iw_geo.offset); i++;
			// label contents
			i = 0;
			ctx.font = gpGUI.font24;
			if ( selPlane.seen > 15 ){
				ctx.fillStyle = gpGUI.colAlarm;
			} else if ( selPlane.seen > 7 ){
				ctx.fillStyle = gpGUI.colWarn;
			} else {
				ctx.fillStyle = gpGUI.colNav;
			}
			ctx.fillText(this.lastSeen(selPlane).toString(), iw_geo.FldX, iw_geo.LblY+iw_geo.LblH+i*iw_geo.offset); i++; // next field

			// TODO !!!! RSSI may change and not apply to all receivers the same...
			if ( selPlane.rssi < -25.0 ){
				ctx.fillStyle = gpGUI.colAlarm;
			} else if ( selPlane.rssi < -20.0 ){
				ctx.fillStyle = gpGUI.colWarn;
			} else {
				ctx.fillStyle = gpGUI.colNav;
			}
			ctx.fillText(selPlane.rssi.toString(), iw_geo.FldX, iw_geo.LblY+iw_geo.LblH+i*iw_geo.offset); i++; // next field
			// the rest is untagged
			ctx.fillStyle = gpGUI.colNav;
			ctx.fillText(this.dataSource(selPlane).toString(), iw_geo.FldX, iw_geo.LblY+iw_geo.LblH+i*iw_geo.offset); i++; // next field
			ctx.fillText(this.instrument(selPlane).toString(), iw_geo.FldX, iw_geo.LblY+iw_geo.LblH+i*iw_geo.offset); i++; // next field

		ctx.restore();		
	},
}

