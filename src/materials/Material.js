import { EventDispatcher } from '../core/EventDispatcher';
import { FrontSide, NormalBlending, SmoothShading, NoColors, LessEqualDepth, AddEquation, OneMinusSrcAlphaFactor, SrcAlphaFactor } from '../Three';
import { Texture } from '../textures/Texture';
import { Color } from '../math/Color';
import { Vector3 } from '../math/Vector3';
import { _Math } from '../math/Math';

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

function Material () {
	this.isMaterial = true;

	Object.defineProperty( this, 'id', { value: MaterialIdCount() } );

	this.uuid = _Math.generateUUID();

	this.name = '';
	this.type = 'Material';

	this.side = FrontSide;

	this.opacity = 1;
	this.transparent = false;

	this.blending = NormalBlending;

	this.blendSrc = SrcAlphaFactor;
	this.blendDst = OneMinusSrcAlphaFactor;
	this.blendEquation = AddEquation;
	this.blendSrcAlpha = null;
	this.blendDstAlpha = null;
	this.blendEquationAlpha = null;

	this.depthFunc = LessEqualDepth;
	this.depthTest = true;
	this.depthWrite = true;

	this.stencilTest = false;
	this.stencilWrite = false;

	this.colorWrite = true;

	this.precision = null; // override the renderer's default precision for this material

	this.polygonOffset = false;
	this.polygonOffsetFactor = 0;
	this.polygonOffsetUnits = 0;

	this.alphaTest = 0;

	this.overdraw = 0; // Overdrawn pixels (typically between 0 and 1) for fixing antialiasing gaps in CanvasRenderer

	this.visible = true;

	this._needsUpdate = true;

};

Material.prototype = {

	constructor: Material,

	get needsUpdate () {

		return this._needsUpdate;

	},

	set needsUpdate ( value ) {

		if ( value === true ) this.update();

		this._needsUpdate = value;

	},

	setValues: function ( values ) {

		if ( values === undefined ) return;

		for ( var key in values ) {

			var newValue = values[ key ];

			if ( newValue === undefined ) {

				console.warn( "THREE.Material: '" + key + "' parameter is undefined." );
				continue;

			}

			var currentValue = this[ key ];

			if ( currentValue === undefined ) {

				console.warn( "THREE." + this.type + ": '" + key + "' is not a property of this material." );
				continue;

			}

			if ( (currentValue && currentValue.isColor) ) {

				currentValue.set( newValue );

			} else if ( (currentValue && currentValue.isVector3) && (newValue && newValue.isVector3) ) {

				currentValue.copy( newValue );

			} else if ( key === 'overdraw' ) {

				// ensure overdraw is backwards-compatible with legacy boolean type
				this[ key ] = Number( newValue );

			} else {

				this[ key ] = newValue;

			}

		}

	},

	toJSON: function ( meta ) {

		var isRoot = meta === undefined;

		if ( isRoot ) {

			meta = {
				textures: {},
				images: {}
			};

		}

		var data = {
			metadata: {
				version: 4.4,
				type: 'Material',
				generator: 'Material.toJSON'
			}
		};

		// standard Material serialization
		data.uuid = this.uuid;
		data.type = this.type;
		if ( this.name !== '' ) data.name = this.name;

		if ( (this.color && this.color.isColor) ) data.color = this.color.getHex();

		if ( this.roughness !== 0.5 ) data.roughness = this.roughness;
		if ( this.metalness > 0 ) data.metalness = this.metalness;

		if ( (this.emissive && this.emissive.isColor) ) data.emissive = this.emissive.getHex();
		if ( (this.specular && this.specular.isColor) ) data.specular = this.specular.getHex();
		if ( this.shininess !== undefined ) data.shininess = this.shininess;

		if ( (this.map && this.map.isTexture) ) data.map = this.map.toJSON( meta ).uuid;
		if ( (this.alphaMap && this.alphaMap.isTexture) ) data.alphaMap = this.alphaMap.toJSON( meta ).uuid;
		if ( (this.lightMap && this.lightMap.isTexture) ) data.lightMap = this.lightMap.toJSON( meta ).uuid;
		if ( (this.bumpMap && this.bumpMap.isTexture) ) {

			data.bumpMap = this.bumpMap.toJSON( meta ).uuid;
			data.bumpScale = this.bumpScale;

		}
		if ( (this.normalMap && this.normalMap.isTexture) ) {

			data.normalMap = this.normalMap.toJSON( meta ).uuid;
			data.normalScale = this.normalScale.toArray();

		}
		if ( (this.displacementMap && this.displacementMap.isTexture) ) {

			data.displacementMap = this.displacementMap.toJSON( meta ).uuid;
			data.displacementScale = this.displacementScale;
			data.displacementBias = this.displacementBias;

		}
		if ( (this.roughnessMap && this.roughnessMap.isTexture) ) data.roughnessMap = this.roughnessMap.toJSON( meta ).uuid;
		if ( (this.metalnessMap && this.metalnessMap.isTexture) ) data.metalnessMap = this.metalnessMap.toJSON( meta ).uuid;

		if ( (this.emissiveMap && this.emissiveMap.isTexture) ) data.emissiveMap = this.emissiveMap.toJSON( meta ).uuid;
		if ( (this.specularMap && this.specularMap.isTexture) ) data.specularMap = this.specularMap.toJSON( meta ).uuid;

		if ( (this.envMap && this.envMap.isTexture) ) {

			data.envMap = this.envMap.toJSON( meta ).uuid;
			data.reflectivity = this.reflectivity; // Scale behind envMap

		}

		if ( this.size !== undefined ) data.size = this.size;
		if ( this.sizeAttenuation !== undefined ) data.sizeAttenuation = this.sizeAttenuation;

		if ( this.vertexColors !== undefined && this.vertexColors !== NoColors ) data.vertexColors = this.vertexColors;
		if ( this.shading !== undefined && this.shading !== SmoothShading ) data.shading = this.shading;
		if ( this.blending !== undefined && this.blending !== NormalBlending ) data.blending = this.blending;
		if ( this.side !== undefined && this.side !== FrontSide ) data.side = this.side;

		if ( this.opacity < 1 ) data.opacity = this.opacity;
		if ( this.transparent === true ) data.transparent = this.transparent;
		if ( this.alphaTest > 0 ) data.alphaTest = this.alphaTest;
		if ( this.wireframe === true ) data.wireframe = this.wireframe;
		if ( this.wireframeLinewidth > 1 ) data.wireframeLinewidth = this.wireframeLinewidth;

		// TODO: Copied from Object3D.toJSON

		function extractFromCache ( cache ) {

			var values = [];

			for ( var key in cache ) {

				var data = cache[ key ];
				delete data.metadata;
				values.push( data );

			}

			return values;

		}

		if ( isRoot ) {

			var textures = extractFromCache( meta.textures );
			var images = extractFromCache( meta.images );

			if ( textures.length > 0 ) data.textures = textures;
			if ( images.length > 0 ) data.images = images;

		}

		return data;

	},

	clone: function () {

		return new this.constructor().copy( this );

	},

	copy: function ( source ) {

		this.name = source.name;

		this.side = source.side;

		this.opacity = source.opacity;
		this.transparent = source.transparent;

		this.blending = source.blending;

		this.blendSrc = source.blendSrc;
		this.blendDst = source.blendDst;
		this.blendEquation = source.blendEquation;
		this.blendSrcAlpha = source.blendSrcAlpha;
		this.blendDstAlpha = source.blendDstAlpha;
		this.blendEquationAlpha = source.blendEquationAlpha;

		this.depthFunc = source.depthFunc;
		this.depthTest = source.depthTest;
		this.depthWrite = source.depthWrite;

		this.stencilTest = source.stencilTest;
		this.stencilWrite = source.stencilWrite;

		this.colorWrite = source.colorWrite;

		this.precision = source.precision;

		this.polygonOffset = source.polygonOffset;
		this.polygonOffsetFactor = source.polygonOffsetFactor;
		this.polygonOffsetUnits = source.polygonOffsetUnits;

		this.alphaTest = source.alphaTest;

		this.overdraw = source.overdraw;

		this.visible = source.visible;

		return this;

	},

	update: function () {

		this.dispatchEvent( { type: 'update' } );

	},

	dispose: function () {

		this.dispatchEvent( { type: 'dispose' } );

	}

};

EventDispatcher.prototype.apply( Material.prototype );

var count = 0;
function MaterialIdCount () { return count++; };


export { MaterialIdCount, Material };