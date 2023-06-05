import { Color, Vector3, ShaderMaterial, DoubleSide } from 'three'

const vertexShader = `
varying vec3 vViewPosition;
varying vec3 vWorldPosition;
varying vec2 vUv;

#include <normal_pars_vertex>

void main() {
  #include <beginnormal_vertex>
  #include <defaultnormal_vertex>
  #include <normal_vertex>

  #include <begin_vertex>
  #include <project_vertex>

  vUv = uv;
  vViewPosition = -mvPosition.xyz;
  vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
}
`

const fragmentShader = `
varying vec2 vUv;
varying vec3 vViewPosition;
varying vec3 vWorldPosition;

uniform vec3 diffuse;
uniform vec3 u_FlameColor;
uniform float opacity;
uniform sampler2D matcap;
uniform sampler2D t_noise;
uniform float u_time;
uniform vec3 u_PivotPosition;
uniform float u_AlphaFalloffStart;
uniform float u_AlphaFalloffEnd;
uniform float u_FlameFalloffStart;
uniform float u_FlameFalloffEnd;

#include <normal_pars_fragment>

void main() {
  vec4 diffuseColor = vec4(diffuse, opacity);

  #include <normal_fragment_begin>

  vec4 matcapColor = texture2D(matcap, vUv);
  vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;

  float distanceFromPivot = distance(vWorldPosition, u_PivotPosition);

  vec4 tNoise = texture2D(t_noise, vUv+vec2(u_time* -0.2, u_time*0.1));

  float mixValue = distanceFromPivot - 1.0 - tNoise.b;

  float flameFalloff = smoothstep(u_FlameFalloffStart, u_FlameFalloffEnd, mixValue);
  outgoingLight = mix(outgoingLight, u_FlameColor+u_FlameColor, 1.0 - flameFalloff);

  #include <output_fragment>

  float alphaFalloff = smoothstep(u_AlphaFalloffStart, u_AlphaFalloffEnd, mixValue);
  gl_FragColor.a = alphaFalloff;
}
`

const BurnMaterial = new ShaderMaterial({
  vertexShader,
  fragmentShader,
  transparent: true,
  side: DoubleSide,
  uniforms: {
    u_PivotPosition: { value: new Vector3() },
    diffuse: { value: new Color(0xffffff) },
    opacity: { value: 1 },
    matcap: { value: null },
    t_noise: { value: null },
    u_time: { value: 0 },
    u_FlameColor: { value: new Color(1, 0.62, 0.2) },
    u_AlphaFalloffStart: { value: 4.1 },
    u_AlphaFalloffEnd: { value: 8.5 },
    u_FlameFalloffStart: { value: 6.0 },
    u_FlameFalloffEnd: { value: 8.0 }
  }
})

export default BurnMaterial;