"use client"
/**
 * HologramMaterial.ts
 * ---------------------------------------------------------------------------
 * A custom THREE.ShaderMaterial subclass. Every color in the final render is
 * generated inside the shader (fresnel / iridescence / rainbow reflection /
 * chromatic aberration / procedural environment) — uMaskTexture only ever
 * supplies alpha (shape), never color, so the original SVG palette never
 * reaches the screen.
 * ---------------------------------------------------------------------------
 */

import * as THREE from 'three';
import { vertexShader, fragmentShader } from './shaders';

export interface HologramMaterialOptions {
  /** Per-instance seed so multiple "split" layers don't animate in lockstep. */
  seed?: number;
  fresnelPower?: number;
  refraction?: number;
  rgbSplit?: number;
  distortion?: number;
  iridescence?: number;
  baseOpacity?: number;
  sweepSpeed?: number;
  noiseSpeed?: number;
  hueSpeed?: number;
}

export class HologramMaterial extends THREE.ShaderMaterial {
  constructor(options: HologramMaterialOptions = {}) {
    const {
      seed = 0,
      fresnelPower = 2.2,
      refraction = 1.0,
      rgbSplit = 1.0,
      distortion = 0.12,
      iridescence = 1.0,
      baseOpacity = 0.82,
      sweepSpeed = 1.0,
      noiseSpeed = 0.06,
      hueSpeed = 1.0,
    } = options;

    super({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      depthTest: true,
      side: THREE.DoubleSide,
      blending: THREE.NormalBlending,
      uniforms: {
        uTime: { value: 0 },
        uHover: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uMaskTexture: { value: null },
        uFresnelPower: { value: fresnelPower },
        uRefraction: { value: refraction },
        uRGBSplit: { value: rgbSplit },
        uDistortion: { value: distortion },
        uIridescence: { value: iridescence },
        uBaseOpacity: { value: baseOpacity },
        uSweepSpeed: { value: sweepSpeed },
        uNoiseSpeed: { value: noiseSpeed },
        uHueSpeed: { value: hueSpeed },
        uSeed: { value: seed },
      },
    });
  }
}

export default HologramMaterial;