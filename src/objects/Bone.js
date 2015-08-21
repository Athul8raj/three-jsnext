import { THREE$Object3D } from '../core/Object3D';

/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 * @author ikerr / http://verold.com
 */

function THREE$Bone ( skin ) {
	this.isBone = true;

	THREE$Object3D.call( this );

	this.type = 'Bone';

	this.skin = skin;

};

THREE$Bone.prototype = Object.create( THREE$Object3D.prototype );
THREE$Bone.prototype.constructor = THREE$Bone;

THREE$Bone.prototype.copy = function ( source ) {
	
	THREE$Object3D.prototype.copy.call( this, source );
	
	this.skin = source.skin;
	
	return this;

};


export { THREE$Bone };