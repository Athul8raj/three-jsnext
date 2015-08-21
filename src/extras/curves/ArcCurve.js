import { THREE$EllipseCurve } from './EllipseCurve';

/**************************************************************
 *	Arc curve
 **************************************************************/

function THREE$ArcCurve ( aX, aY, aRadius, aStartAngle, aEndAngle, aClockwise ) {
	this.isArcCurve = true;

	THREE$EllipseCurve.call( this, aX, aY, aRadius, aRadius, aStartAngle, aEndAngle, aClockwise );

};

THREE$ArcCurve.prototype = Object.create( THREE$EllipseCurve.prototype );
THREE$ArcCurve.prototype.constructor = THREE$ArcCurve;


export { THREE$ArcCurve };