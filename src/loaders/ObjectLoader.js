import { THREE$Object3D } from '../core/Object3D';
import { THREE$Group } from '../objects/Group';
import { THREE$Sprite } from '../objects/Sprite';
import { THREE$PointCloud } from '../objects/PointCloud';
import { THREE$Line } from '../objects/Line';
import { THREE$Mesh } from '../objects/Mesh';
import { THREE$HemisphereLight } from '../lights/HemisphereLight';
import { THREE$SpotLight } from '../lights/SpotLight';
import { THREE$PointLight } from '../lights/PointLight';
import { THREE$DirectionalLight } from '../lights/DirectionalLight';
import { THREE$AreaLight } from '../lights/AreaLight';
import { THREE$AmbientLight } from '../lights/AmbientLight';
import { THREE$OrthographicCamera } from '../cameras/OrthographicCamera';
import { THREE$PerspectiveCamera } from '../cameras/PerspectiveCamera';
import { THREE$Scene } from '../scenes/Scene';
import { THREE$Matrix4 } from '../math/Matrix4';
import { THREE$Vector2 } from '../math/Vector2';
import { THREE$Texture } from '../textures/Texture';
import { THREE$ImageLoader } from './ImageLoader';
import { THREE$LoadingManager, THREE$DefaultLoadingManager } from './LoadingManager';
import { THREE$MultiplyOperation } from '../Three';
import { THREE$MaterialLoader } from './MaterialLoader';
import { THREE$TextGeometry } from '../extras/geometries/TextGeometry';
import { THREE$TorusKnotGeometry } from '../extras/geometries/TorusKnotGeometry';
import { THREE$TorusGeometry } from '../extras/geometries/TorusGeometry';
import { THREE$RingGeometry } from '../extras/geometries/RingGeometry';
import { THREE$TetrahedronGeometry } from '../extras/geometries/TetrahedronGeometry';
import { THREE$OctahedronGeometry } from '../extras/geometries/OctahedronGeometry';
import { THREE$IcosahedronGeometry } from '../extras/geometries/IcosahedronGeometry';
import { THREE$DodecahedronGeometry } from '../extras/geometries/DodecahedronGeometry';
import { THREE$SphereBufferGeometry } from '../extras/geometries/SphereBufferGeometry';
import { THREE$SphereGeometry } from '../extras/geometries/SphereGeometry';
import { THREE$CylinderGeometry } from '../extras/geometries/CylinderGeometry';
import { THREE$CircleGeometry } from '../extras/geometries/CircleGeometry';
import { THREE$CircleBufferGeometry } from '../extras/geometries/CircleBufferGeometry';
import { THREE$BoxGeometry } from '../extras/geometries/BoxGeometry';
import { THREE$BufferGeometryLoader } from './BufferGeometryLoader';
import { THREE$JSONLoader } from './JSONLoader';
import { THREE$XHRLoader } from './XHRLoader';

/**
 * @author mrdoob / http://mrdoob.com/
 */

function THREE$ObjectLoader ( manager ) {
	this.isObjectLoader = true;

	this.manager = ( manager !== undefined ) ? manager : THREE$DefaultLoadingManager;
	this.texturePath = '';

};

THREE$ObjectLoader.prototype = {

	constructor: THREE$ObjectLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		if ( this.texturePath === '' ) {

			this.texturePath = url.substring( 0, url.lastIndexOf( '/' ) + 1 );

		}

		var scope = this;

		var loader = new THREE$XHRLoader( scope.manager );
		loader.setCrossOrigin( this.crossOrigin );
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

		if ( json.images === undefined || json.images.length === 0 ) {

			if ( onLoad !== undefined ) onLoad( object );

		}

		return object;

	},

	parseGeometries: function ( json ) {

		var geometries = {};

		if ( json !== undefined ) {

			var geometryLoader = new THREE$JSONLoader();
			var bufferGeometryLoader = new THREE$BufferGeometryLoader();

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

						geometry = new THREE$BoxGeometry(
							data.width,
							data.height,
							data.depth,
							data.widthSegments,
							data.heightSegments,
							data.depthSegments
						);

						break;

					case 'CircleBufferGeometry':

						geometry = new THREE$CircleBufferGeometry(
							data.radius,
							data.segments,
							data.thetaStart,
							data.thetaLength
						);

						break;

					case 'CircleGeometry':

						geometry = new THREE$CircleGeometry(
							data.radius,
							data.segments,
							data.thetaStart,
							data.thetaLength
						);

						break;

					case 'CylinderGeometry':

						geometry = new THREE$CylinderGeometry(
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

						geometry = new THREE$SphereGeometry(
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

						geometry = new THREE$SphereBufferGeometry(
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

						geometry = new THREE$DodecahedronGeometry(
							data.radius,
							data.detail
						);

						break;

					case 'IcosahedronGeometry':

						geometry = new THREE$IcosahedronGeometry(
							data.radius,
							data.detail
						);

						break;

					case 'OctahedronGeometry':

						geometry = new THREE$OctahedronGeometry(
							data.radius,
							data.detail
						);

						break;

					case 'TetrahedronGeometry':

						geometry = new THREE$TetrahedronGeometry(
							data.radius,
							data.detail
						);

						break;

					case 'RingGeometry':

						geometry = new THREE$RingGeometry(
							data.innerRadius,
							data.outerRadius,
							data.thetaSegments,
							data.phiSegments,
							data.thetaStart,
							data.thetaLength
						);

						break;

					case 'TorusGeometry':

						geometry = new THREE$TorusGeometry(
							data.radius,
							data.tube,
							data.radialSegments,
							data.tubularSegments,
							data.arc
						);

						break;

					case 'TorusKnotGeometry':

						geometry = new THREE$TorusKnotGeometry(
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

					case 'TextGeometry':

						geometry = new THREE$TextGeometry(
							data.text,
							data.data
						);

						break;

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

			var getTexture = function ( name ) {

				if ( textures[ name ] === undefined ) {

					console.warn( 'THREE.ObjectLoader: Undefined texture', name );

				}

				return textures[ name ];

			};

			var loader = new THREE$MaterialLoader();

			for ( var i = 0, l = json.length; i < l; i ++ ) {

				var data = json[ i ];
				var material = loader.parse( data );

				material.uuid = data.uuid;

				if ( data.depthTest !== undefined ) material.depthTest = data.depthTest;
				if ( data.depthWrite !== undefined ) material.depthWrite = data.depthWrite;

				if ( data.name !== undefined ) material.name = data.name;

				if ( data.map !== undefined ) material.map = getTexture( data.map );

				if ( data.alphaMap !== undefined ) {

					material.alphaMap = getTexture( data.alphaMap );
					material.transparent = true;

				}

				if ( data.bumpMap !== undefined ) material.bumpMap = getTexture( data.bumpMap );
				if ( data.bumpScale !== undefined ) material.bumpScale = data.bumpScale;

				if ( data.normalMap !== undefined ) material.normalMap = getTexture( data.normalMap );
				if ( data.normalScale )	material.normalScale = new THREE$Vector2( data.normalScale, data.normalScale );

				if ( data.specularMap !== undefined ) material.specularMap = getTexture( data.specularMap );

				if ( data.envMap !== undefined ) {

					material.envMap = getTexture( data.envMap );
					material.combine = THREE$MultiplyOperation;

				}

				if ( data.reflectivity ) material.reflectivity = data.reflectivity;

				if ( data.lightMap !== undefined ) material.lightMap = getTexture( data.lightMap );
				if ( data.lightMapIntensity !== undefined ) material.lightMapIntensity = data.lightMapIntensity;

				if ( data.aoMap !== undefined ) material.aoMap = getTexture( data.aoMap );
				if ( data.aoMapIntensity !== undefined ) material.aoMapIntensity = data.aoMapIntensity;

				materials[ data.uuid ] = material;

			}

		}

		return materials;

	},

	parseImages: function ( json, onLoad ) {

		var scope = this;
		var images = {};

		if ( json !== undefined && json.length > 0 ) {

			var manager = new THREE$LoadingManager( onLoad );

			var loader = new THREE$ImageLoader( manager );
			loader.setCrossOrigin( this.crossOrigin );

			var loadImage = function ( url ) {

				url = scope.texturePath + url;

				scope.manager.itemStart( url );

				return loader.load( url, function () {

					scope.manager.itemEnd( url );

				} );

			};

			for ( var i = 0, l = json.length; i < l; i ++ ) {

				var image = json[ i ];
				images[ image.uuid ] = loadImage( image.url );

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

				var texture = new THREE$Texture( images[ data.image ] );
				texture.needsUpdate = true;

				texture.uuid = data.uuid;

				if ( data.name !== undefined ) texture.name = data.name;
				if ( data.mapping !== undefined ) texture.mapping = parseConstant( data.mapping );
				if ( data.repeat !== undefined ) texture.repeat = new THREE$Vector2( data.repeat[ 0 ], data.repeat[ 1 ] );
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

		var matrix = new THREE$Matrix4();

		return function ( data, geometries, materials ) {

			var object;

			var getGeometry = function ( name ) {

				if ( geometries[ name ] === undefined ) {

					console.warn( 'THREE.ObjectLoader: Undefined geometry', name );

				}

				return geometries[ name ];

			};

			var getMaterial = function ( name ) {

				if ( materials[ name ] === undefined ) {

					console.warn( 'THREE.ObjectLoader: Undefined material', name );

				}

				return materials[ name ];

			};

			switch ( data.type ) {

				case 'Scene':

					object = new THREE$Scene();

					break;

				case 'PerspectiveCamera':

					object = new THREE$PerspectiveCamera( data.fov, data.aspect, data.near, data.far );

					break;

				case 'OrthographicCamera':

					object = new THREE$OrthographicCamera( data.left, data.right, data.top, data.bottom, data.near, data.far );

					break;

				case 'AmbientLight':

					object = new THREE$AmbientLight( data.color );

					break;


				case 'AreaLight':

					object = new THREE$AreaLight( data.color, data.intensity );

					break;

				case 'DirectionalLight':

					object = new THREE$DirectionalLight( data.color, data.intensity );

					break;

				case 'PointLight':

					object = new THREE$PointLight( data.color, data.intensity, data.distance, data.decay );

					break;

				case 'SpotLight':

					object = new THREE$SpotLight( data.color, data.intensity, data.distance, data.angle, data.exponent, data.decay );

					break;

				case 'HemisphereLight':

					object = new THREE$HemisphereLight( data.color, data.groundColor, data.intensity );

					break;

				case 'Mesh':

					object = new THREE$Mesh( getGeometry( data.geometry ), getMaterial( data.material ) );

					break;

				case 'Line':

					object = new THREE$Line( getGeometry( data.geometry ), getMaterial( data.material ), data.mode );

					break;

				case 'PointCloud':

					object = new THREE$PointCloud( getGeometry( data.geometry ), getMaterial( data.material ) );

					break;

				case 'Sprite':

					object = new THREE$Sprite( getMaterial( data.material ) );

					break;

				case 'Group':

					object = new THREE$Group();

					break;

				default:

					object = new THREE$Object3D();

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

			return object;

		}

	}()

};


export { THREE$ObjectLoader };