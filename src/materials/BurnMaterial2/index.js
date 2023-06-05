import { Color, Vector3, MeshStandardMaterial } from 'three'


const vertexShader = `
#define STANDARD

varying vec2 vUv;
varying vec3 vViewPosition;
varying vec3 vWorldPositionCustom;

#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif

#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
	vUv = uv;
	vWorldPositionCustom = (modelMatrix * vec4(position, 1.0)).xyz;
}
`
const fragmentShader = `

#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif

varying vec2 vUv;
varying vec3 vWorldPositionCustom;

uniform vec3 u_FlameColor;
uniform float u_FlameIntensity;
uniform sampler2D matcap;
uniform sampler2D t_noise;
uniform sampler2D t_second;
uniform float u_time;
uniform vec3 u_PivotPosition;
uniform float u_AlphaFalloffStart;
uniform float u_AlphaFalloffEnd;
uniform float u_FlameFalloffStart;
uniform float u_FlameFalloffEnd;
uniform float u_segments;
uniform float u_segmentsOffset;

uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>

	//#include <map_fragment>
	#ifdef USE_MAP
		diffuseColor *= texture2D( map, vec2(vMapUv.x / u_segments + u_segmentsOffset, vMapUv.y));

		vec4 secondColor = texture2D( t_second, vMapUv );

		diffuseColor = mix(diffuseColor, secondColor, secondColor.a);
	#endif

	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecular;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometry.clearcoatNormal, geometry.viewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + clearcoatSpecular * material.clearcoat;
	#endif

	float distanceFromPivot = distance(vWorldPositionCustom, u_PivotPosition);
	vec4 tNoise = texture2D(t_noise, vUv+vec2(u_time* -0.2, u_time*0.1));
	float mixValue = distanceFromPivot - 1.0 - tNoise.b;
	float flameFalloff = smoothstep(u_FlameFalloffStart, u_FlameFalloffEnd, mixValue);
	outgoingLight = mix(outgoingLight, u_FlameColor*u_FlameIntensity, 1.0 - flameFalloff);  

	#include <output_fragment>

	float alphaFalloff = smoothstep(u_AlphaFalloffStart, u_AlphaFalloffEnd, mixValue);
	gl_FragColor.a = alphaFalloff;

	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}
`

const BurnMaterial = (shaderContainer, noiseTexture, secondMap) => {
	const material = new MeshStandardMaterial({
		transparent: true,
		//side: DoubleSide,
	})

	material.onBeforeCompile = (shader) => {
		shader.uniforms.u_PivotPosition = { value: new Vector3(0, 0, 0) }
		shader.uniforms.opacity = { value: 1 }
		shader.uniforms.t_noise = { value: noiseTexture }
		shader.uniforms.t_second = { value: secondMap }
		shader.uniforms.u_time = { value: 0 }
		shader.uniforms.u_FlameColor = { value: new Color(1, 0.12, 0.0) }
		shader.uniforms.u_FlameIntensity = { value: 4 }
		shader.uniforms.u_AlphaFalloffStart = { value: 6.1 }
		shader.uniforms.u_AlphaFalloffEnd = { value: 8.0 }
		shader.uniforms.u_FlameFalloffStart = { value: 7.6 }
		shader.uniforms.u_FlameFalloffEnd = { value: 8.3 }
		shader.uniforms.u_segments = { value: 1 }
		shader.uniforms.u_segmentsOffset = { value: 0 }

		shader.fragmentShader = fragmentShader
		shader.vertexShader = vertexShader

		shaderContainer.reference = shader
	}

	return material;
}

export default BurnMaterial;