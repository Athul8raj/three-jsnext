import { Object3D } from '../core/Object3D';
import { Group } from '../objects/Group';
import { Sprite } from '../objects/Sprite';
import { Points } from '../objects/Points';
import { Line } from '../objects/Line';
import { LOD } from '../objects/LOD';
import { Mesh } from '../objects/Mesh';
import { SkinnedMesh } from '../objects/SkinnedMesh';
import { HemisphereLight } from '../lights/HemisphereLight';
import { SpotLight } from '../lights/SpotLight';
import { PointLight } from '../lights/PointLight';
import { DirectionalLight } from '../lights/DirectionalLight';
import { AmbientLight } from '../lights/AmbientLight';
import { OrthographicCamera } from '../cameras/OrthographicCamera';
import { PerspectiveCamera } from '../cameras/PerspectiveCamera';
import { Scene } from '../scenes/Scene';
import { Matrix4 } from '../math/Matrix4';
import { Vector2 } from '../math/Vector2';
import { Texture } from '../textures/Texture';
import { ImageLoader } from './ImageLoader';
import { LoadingManager, DefaultLoadingManager } from './LoadingManager';
import { AnimationClip } from '../animation/AnimationClip';
import { MaterialLoader } from './MaterialLoader';
import { TorusKnotGeometry } from '../extras/geometries/TorusKnotGeometry';
import { TorusGeometry } from '../extras/geometries/TorusGeometry';
import { RingGeometry } from '../extras/geometries/RingGeometry';
import { TetrahedronGeometry } from '../extras/geometries/TetrahedronGeometry';
import { OctahedronGeometry } from '../extras/geometries/OctahedronGeometry';
import { IcosahedronGeometry } from '../extras/geometries/IcosahedronGeometry';
import { DodecahedronGeometry } from '../extras/geometries/DodecahedronGeometry';
import { SphereBufferGeometry } from '../extras/geometries/SphereBufferGeometry';
import { SphereGeometry } from '../extras/geometries/SphereGeometry';
import { CylinderGeometry } from '../extras/geometries/CylinderGeometry';
import { CircleGeometry } from '../extras/geometries/CircleGeometry';
import { CircleBufferGeometry } from '../extras/geometries/CircleBufferGeometry';
import { BoxGeometry } from '../extras/geometries/BoxGeometry';
import { BufferGeometryLoader } from './BufferGeometryLoader';
import { JSONLoader } from './JSONLoader';
import { XHRLoader } from './XHRLoader';

/**
 * @author mrdoob / http://mrdoob.com/
 */

function ObjectLoader ( manager ) {
	this.isObjectLoader = true;

	this.manager = ( manager !== undefined ) ? manager : DefaultLoadingManager;
	this.texturePath = '';

};

ObjectLoader.prototype = {

	constructor: ObjectLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		if ( this.texturePath === '' ) {

			this.texturePath = url.substring( 0, url.lastIndexOf( '/' ) + 1 );

		}

		var scope = this;

		var loader = new XHRLoader( scope.manager );
		loader.load( url, function ( text ) {

			scope.parse( JSON.parse( text ), onLoad );

		}, onProgress, onError );

	},

	setTexturePath: function ( value ) {

		this.texturePath = value;

	},

	setCrossOrigin: function ( value ) {

		this.crossOrigin = value;

	},

	parse: function ( json, onLoad ) {

		var geometries = this.parseGeometries( json.geometries );

		var images = this.parseImages( json.images, function () {

			if ( onLoad !== undefined ) onLoad( object );

		} );

		var textures  = this.parseTextures( json.textures, images );
		var materials = this.parseMaterials( json.materials, textures );

		var object = this.parseObject( json.object, geometries, materials );

		if ( json.animations ) {

			object.animations = this.parseAnimations( json.animations );

		}

		if ( json.images === undefined || json.images.length === 0 ) {

			if ( onLoad !== undefined ) onLoad( object );

		}

		return object;

	},

	parseGeometries: function ( json ) {

		var geometries = {};

		if ( json !== undefined ) {

			var geometryLoader = new JSONLoader();
			var bufferGeometryLoader = new BufferGeometryLoader();

			for ( var i = 0, l = json.length; i < l; i ++ ) {

				var geometry;
				var data = json[ i ];

				switch ( data.type ) {

					case 'PlaneGeometry':
					case 'PlaneBufferGeometry':

						geometry = new THREE[ data.type ](
							data.width,
							data.height,
							data.widthSegments,
							data.heightSegments
						);

						break;

					case 'BoxGeometry':
					case 'CubeGeometry': // backwards compatible

						geometry = new BoxGeometry(
							data.width,
							data.height,
							data.depth,
							data.widthSegments,
							data.heightSegments,
							data.depthSegments
						);

						break;

					case 'CircleBufferGeometry':

						geometry = new CircleBufferGeometry(
							data.radius,
							data.segments,
							data.thetaStart,
							data.thetaLength
						);

						break;

					case 'CircleGeometry':

						geometry = new CircleGeometry(
							data.radius,
							data.segments,
							data.thetaStart,
							data.thetaLength
						);

						break;

					case 'CylinderGeometry':

						geometry = new CylinderGeometry(
							data.radiusTop,
							data.radiusBottom,
							data.height,
							data.radialSegments,
							data.heightSegments,
							data.openEnded,
							data.thetaStart,
							data.thetaLength
						);

						break;

					case 'SphereGeometry':

						geometry = new SphereGeometry(
							data.radius,
							data.widthSegments,
							data.heightSegments,
							data.phiStart,
							data.phiLength,
							data.thetaStart,
							data.thetaLength
						);

						break;

					case 'SphereBufferGeometry':

						geometry = new SphereBufferGeometry(
							data.radius,
							data.widthSegments,
							data.heightSegments,
							data.phiStart,
							data.phiLength,
							data.thetaStart,
							data.thetaLength
						);

						break;

					case 'DodecahedronGeometry':

						geometry = new DodecahedronGeometry(
							data.radius,
							data.detail
						);

						break;

					case 'IcosahedronGeometry':

						geometry = new IcosahedronGeometry(
							data.radius,
							data.detail
						);

						break;

					case 'OctahedronGeometry':

						geometry = new OctahedronGeometry(
							data.radius,
							data.detail
						);

						break;

					case 'TetrahedronGeometry':

						geometry = new TetrahedronGeometry(
							data.radius,
							data.detail
						);

						break;

					case 'RingGeometry':

						geometry = new RingGeometry(
							data.innerRadius,
							data.outerRadius,
							data.thetaSegments,
							data.phiSegments,
							data.thetaStart,
							data.thetaLength
						);

						break;

					case 'TorusGeometry':

						geometry = new TorusGeometry(
							data.radius,
							data.tube,
							data.radialSegments,
							data.tubularSegments,
							data.arc
						);

						break;

					case 'TorusKnotGeometry':

						geometry = new TorusKnotGeometry(
							data.radius,
							data.tube,
							data.radialSegments,
							data.tubularSegments,
							data.p,
							data.q,
							data.heightScale
						);

						break;

					case 'BufferGeometry':

						geometry = bufferGeometryLoader.parse( data );

						break;

					case 'Geometry':

						geometry = geometryLoader.parse( data.data, this.texturePath ).geometry;

						break;

					default:

						console.warn( 'THREE.ObjectLoader: Unsupported geometry type "' + data.type + '"' );

						continue;

				}

				geometry.uuid = data.uuid;

				if ( data.name !== undefined ) geometry.name = data.name;

				geometries[ data.uuid ] = geometry;

			}

		}

		return geometries;

	},

	parseMaterials: function ( json, textures ) {

		var materials = {};

		if ( json !== undefined ) {

			var loader = new MaterialLoader();
			loader.setTextures( textures );

			for ( var i = 0, l = json.length; i < l; i ++ ) {

				var material = loader.parse( json[ i ] );
				materials[ material.uuid ] = material;

			}

		}

		return materials;

	},

	parseAnimations: function ( json ) {

		var animations = [];

		for ( var i = 0; i < json.length; i ++ ) {

			var clip = AnimationClip.parse( json[ i ] );

			animations.push( clip );

		}

		return animations;

	},

	parseImages: function ( json, onLoad ) {

		var scope = this;
		var images = {};

		function loadImage( url ) {

			scope.manager.itemStart( url );

			return loader.load( url, function () {

				scope.manager.itemEnd( url );

			} );

		}

		if ( json !== undefined && json.length > 0 ) {

			var manager = new LoadingManager( onLoad );

			var loader = new ImageLoader( manager );
			loader.setCrossOrigin( this.crossOrigin );

			for ( var i = 0, l = json.length; i < l; i ++ ) {

				var image = json[ i ];
				var path = /^(\/\/)|([a-z]+:(\/\/)?)/i.test( image.url ) ? image.url : scope.texturePath + image.url;

				images[ image.uuid ] = loadImage( path );

			}

		}

		return images;

	},

	parseTextures: function ( json, images ) {

		function parseConstant( value ) {

			if ( typeof( value ) === 'number' ) return value;

			console.warn( 'THREE.ObjectLoader.parseTexture: Constant should be in numeric form.', value );

			return THREE[ value ];

		}

		var textures = {};

		if ( json !== undefined ) {

			for ( var i = 0, l = json.length; i < l; i ++ ) {

				var data = json[ i ];

				if ( data.image === undefined ) {

					console.warn( 'THREE.ObjectLoader: No "image" specified for', data.uuid );

				}

				if ( images[ data.image ] === undefined ) {

					console.warn( 'THREE.ObjectLoader: Undefined image', data.image );

				}

				var texture = new Texture( images[ data.image ] );
				texture.needsUpdate = true;

				texture.uuid = data.uuid;

				if ( data.name !== undefined ) texture.name = data.name;
				if ( data.mapping !== undefined ) texture.mapping = parseConstant( data.mapping );
				if ( data.offset !== undefined ) texture.offset = new Vector2( data.offset[ 0 ], data.offset[ 1 ] );
				if ( data.repeat !== undefined ) texture.repeat = new Vector2( data.repeat[ 0 ], data.repeat[ 1 ] );
				if ( data.minFilter !== undefined ) texture.minFilter = parseConstant( data.minFilter );
				if ( data.magFilter !== undefined ) texture.magFilter = parseConstant( data.magFilter );
				if ( data.anisotropy !== undefined ) texture.anisotropy = data.anisotropy;
				if ( Array.isArray( data.wrap ) ) {

					texture.wrapS = parseConstant( data.wrap[ 0 ] );
					texture.wrapT = parseConstant( data.wrap[ 1 ] );

				}

				textures[ data.uuid ] = texture;

			}

		}

		return textures;

	},

	parseObject: function () {

		var matrix = new Matrix4();

		return function ( data, geometries, materials ) {

			var object;

			function getGeometry( name ) {

				if ( geometries[ name ] === undefined ) {

					console.warn( 'THREE.ObjectLoader: Undefined geometry', name );

				}

				return geometries[ name ];

			}

			function getMaterial( name ) {

				if ( name === undefined ) return undefined;

				if ( materials[ name ] === undefined ) {

					console.warn( 'THREE.ObjectLoader: Undefined material', name );

				}

				return materials[ name ];

			}

			switch ( data.type ) {

				case 'Scene':

					object = new Scene();

					break;

				case 'PerspectiveCamera':

					object = new PerspectiveCamera( data.fov, data.aspect, data.near, data.far );

					break;

				case 'OrthographicCamera':

					object = new OrthographicCamera( data.left, data.right, data.top, data.bottom, data.near, data.far );

					break;

				case 'AmbientLight':

					object = new AmbientLight( data.color, data.intensity );

					break;

				case 'DirectionalLight':

					object = new DirectionalLight( data.color, data.intensity );

					break;

				case 'PointLight':

					object = new PointLight( data.color, data.intensity, data.distance, data.decay );

					break;

				case 'SpotLight':

					object = new SpotLight( data.color, data.intensity, data.distance, data.angle, data.exponent, data.decay );

					break;

				case 'HemisphereLight':

					object = new HemisphereLight( data.color, data.groundColor, data.intensity );

					break;

				case 'Mesh':

					var geometry = getGeometry( data.geometry );
					var material = getMaterial( data.material );

					if ( geometry.bones && geometry.bones.length > 0 ) {

						object = new SkinnedMesh( geometry, material );

					} else {

						object = new Mesh( geometry, material );

					}

					break;

				case 'LOD':

					object = new LOD();

					break;

				case 'Line':

					object = new Line( getGeometry( data.geometry ), getMaterial( data.material ), data.mode );

					break;

				case 'PointCloud':
				case 'Points':

					object = new Points( getGeometry( data.geometry ), getMaterial( data.material ) );

					break;

				case 'Sprite':

					object = new Sprite( getMaterial( data.material ) );

					break;

				case 'Group':

					object = new Group();

					break;

				default:

					object = new Object3D();

			}

			object.uuid = data.uuid;

			if ( data.name !== undefined ) object.name = data.name;
			if ( data.matrix !== undefined ) {

				matrix.fromArray( data.matrix );
				matrix.decompose( object.position, object.quaternion, object.scale );

			} else {

				if ( data.position !== undefined ) object.position.fromArray( data.position );
				if ( data.rotation !== undefined ) object.rotation.fromArray( data.rotation );
				if ( data.scale !== undefined ) object.scale.fromArray( data.scale );

			}

			if ( data.castShadow !== undefined ) object.castShadow = data.castShadow;
			if ( data.receiveShadow !== undefined ) object.receiveShadow = data.receiveShadow;

			if ( data.visible !== undefined ) object.visible = data.visible;
			if ( data.userData !== undefined ) object.userData = data.userData;

			if ( data.children !== undefined ) {

				for ( var child in data.children ) {

					object.add( this.parseObject( data.children[ child ], geometries, materials ) );

				}

			}

			if ( data.type === 'LOD' ) {

				var levels = data.levels;

				for ( var l = 0; l < levels.length; l ++ ) {

					var level = levels[ l ];
					var child = object.getObjectByProperty( 'uuid', level.object );

					if ( child !== undefined ) {

						object.addLevel( child, level.distance );

					}

				}

			}

			return object;

		}

	}()

};


export { ObjectLoader };