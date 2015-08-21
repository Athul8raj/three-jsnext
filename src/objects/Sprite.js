import { THREE$Object3D } from '../core/Object3D';
import { THREE$Vector3 } from '../math/Vector3';
import { THREE$SpriteMaterial } from '../materials/SpriteMaterial';
import { THREE$BufferAttribute } from '../core/BufferAttribute';
import { THREE$IndexBufferAttribute } from '../core/IndexBufferAttribute';
import { THREE$BufferGeometry } from '../core/BufferGeometry';

var THREE$Particle;
var THREE$Sprite;

/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 */

THREE$Sprite = ( function () {

	var indices = new Uint16Array( [ 0, 1, 2,  0, 2, 3 ] );
	var vertices = new Float32Array( [ - 0.5, - 0.5, 0,   0.5, - 0.5, 0,   0.5, 0.5, 0,   - 0.5, 0.5, 0 ] );
	var uvs = new Float32Array( [ 0, 0,   1, 0,   1, 1,   0, 1 ] );

	var geometry = new THREE$BufferGeometry();
	geometry.addAttribute( 'index', new THREE$IndexBufferAttribute( indices, 1 ) );
	geometry.addAttribute( 'position', new THREE$BufferAttribute( vertices, 3 ) );
	geometry.addAttribute( 'uv', new THREE$BufferAttribute( uvs, 2 ) );

	return function Sprite( material ) {

		THREE$Object3D.call( this );

		this.type = 'Sprite';

		this.geometry = geometry;
		this.material = ( material !== undefined ) ? material : new THREE$SpriteMaterial();

	};

} )();

THREE$Sprite.prototype = Object.create( THREE$Object3D.prototype );
THREE$Sprite.prototype.constructor = THREE$Sprite;

THREE$Sprite.prototype.raycast = ( function () {

	var matrixPosition = new THREE$Vector3();

	return function raycast( raycaster, intersects ) {

		matrixPosition.setFromMatrixPosition( this.matrixWorld );

		var distanceSq = raycaster.ray.distanceSqToPoint( matrixPosition );
		var guessSizeSq = this.scale.x * this.scale.y;

		if ( distanceSq > guessSizeSq ) {

			return;

		}

		intersects.push( {

			distance: Math.sqrt( distanceSq ),
			point: this.position,
			face: null,
			object: this

		} );

	};

}() );

THREE$Sprite.prototype.clone = function () {

	return new this.constructor( this.material ).copy( this );

};

THREE$Sprite.prototype.toJSON = function ( meta ) {

	var data = THREE$Object3D.prototype.toJSON.call( this, meta );

	// only serialize if not in meta materials cache
	if ( meta.materials[ this.material.uuid ] === undefined ) {

		meta.materials[ this.material.uuid ] = this.material.toJSON();

	}

	data.object.material = this.material.uuid;

	return data;

};

// Backwards compatibility

THREE$Particle = THREE$Sprite;


export { THREE$Particle, THREE$Sprite };