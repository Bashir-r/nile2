import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { ChevronDown, ChevronUp, Layers, RotateCw } from 'lucide-react';
import type { DepartmentSlug, Locale } from '../shared/types.ts';

type CameraPresetId = 'studio' | 'front' | 'top';

interface Product3DShowcaseProps {
  department: DepartmentSlug;
  title: string;
  colorHex?: string;
  locale: Locale;
}

interface ExplodablePart {
  obj: THREE.Object3D;
  basePos: THREE.Vector3;
  explodeDir: THREE.Vector3;
}

const CAMERA_PRESETS: Record<CameraPresetId, { pos: [number, number, number]; target: [number, number, number] }> = {
  studio: { pos: [2.75, 2.05, 3.1], target: [0, 0.85, 0] },
  front: { pos: [0, 1.05, 3.8], target: [0, 0.85, 0] },
  top: { pos: [0.01, 4.15, 0.65], target: [0, 0.75, 0] },
};

// Module-scope reusable math objects for zero-GC updates in render frames
const _desiredPos = new THREE.Vector3();
const _desiredTarget = new THREE.Vector3();
const _targetPartPos = new THREE.Vector3();

function detectSoftwareWebGL(): { supported: boolean; isSoftwareGl: boolean } {
  const probeCanvas = document.createElement('canvas');
  const gl = probeCanvas.getContext('webgl2') as WebGL2RenderingContext | null;
  if (!gl) {
    return { supported: false, isSoftwareGl: true };
  }
  const ext = gl.getExtension('WEBGL_debug_renderer_info');
  const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
  const rendererName = String(gl.getParameter(param) || '');
  gl.getExtension('WEBGL_lose_context')?.loseContext();
  const isSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(rendererName);
  return { supported: true, isSoftwareGl };
}

function createRadialShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 122);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
  grad.addColorStop(0.55, 'rgba(0, 0, 0, 0.25)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createSurfaceFinishTexture(
  kind: 'weave' | 'grain' | 'dial',
  baseColorHex: string,
  maxAnisotropy: number
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  if (kind === 'dial') {
    ctx.fillStyle = '#0F1115';
    ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = 'rgba(217, 78, 40, 0.85)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(256, 256, 210, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(244, 241, 234, 0.5)';
    for (let i = 0; i < 48; i++) {
      const a = (i / 48) * Math.PI * 2;
      const r0 = i % 4 === 0 ? 170 : 186;
      const r1 = 202;
      ctx.lineWidth = i % 4 === 0 ? 4 : 2;
      ctx.beginPath();
      ctx.moveTo(256 + Math.cos(a) * r0, 256 + Math.sin(a) * r0);
      ctx.lineTo(256 + Math.cos(a) * r1, 256 + Math.sin(a) * r1);
      ctx.stroke();
    }
    ctx.fillStyle = '#2C7A5B';
    ctx.font = 'bold 34px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('NILELINK SPEC', 256, 242);
    ctx.fillStyle = '#F4F1EA';
    ctx.font = '22px monospace';
    ctx.fillText('CALIBRATED LB', 256, 286);
  } else if (kind === 'weave') {
    ctx.fillStyle = baseColorHex || '#2A2C32';
    ctx.fillRect(0, 0, 512, 512);
    for (let y = 0; y < 512; y += 8) {
      ctx.fillStyle = y % 16 === 0 ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)';
      ctx.fillRect(0, y, 512, 4);
    }
    for (let x = 0; x < 512; x += 8) {
      ctx.fillStyle = x % 16 === 0 ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)';
      ctx.fillRect(x, 0, 4, 512);
    }
  } else {
    ctx.fillStyle = baseColorHex || '#3B2B22';
    ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = 'rgba(0,0,0,0.16)';
    for (let i = 0; i < 64; i++) {
      ctx.lineWidth = 1 + (i % 3);
      ctx.beginPath();
      const yBase = i * 8;
      ctx.moveTo(0, yBase);
      ctx.bezierCurveTo(170, yBase + (i % 2 === 0 ? 10 : -10), 340, yBase - 8, 512, yBase + 4);
      ctx.stroke();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

function createRoundedRectShape(w: number, h: number, r: number): THREE.Shape {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

function buildCompositeProductModel(
  department: DepartmentSlug,
  variantColorHex: string,
  isSoftwareGl: boolean,
  maxAnisotropy: number,
  disposables: { geometries: THREE.BufferGeometry[]; materials: THREE.Material[]; textures: THREE.Texture[] }
): { root: THREE.Group; parts: ExplodablePart[]; accentMaterials: THREE.MeshStandardMaterial[] } {
  const root = new THREE.Group();
  const parts: ExplodablePart[] = [];
  const accentMaterials: THREE.MeshStandardMaterial[] = [];

  const registerPart = (obj: THREE.Object3D, explodeDir: THREE.Vector3) => {
    obj.traverse((c) => {
      if ((c as THREE.Mesh).isMesh) {
        c.castShadow = !isSoftwareGl;
        c.receiveShadow = !isSoftwareGl;
      }
    });
    root.add(obj);
    parts.push({ obj, basePos: obj.position.clone(), explodeDir });
  };

  const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
    disposables.geometries.push(g);
    return g;
  };
  const trackMat = <T extends THREE.Material>(m: T): T => {
    disposables.materials.push(m);
    return m;
  };
  const trackTex = <T extends THREE.Texture>(t: T): T => {
    disposables.textures.push(t);
    return t;
  };

  const primaryColor = new THREE.Color(variantColorHex || '#D94E28');

  const brushedMetalMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0xcfd4dc,
      metalness: 0.92,
      roughness: 0.2,
      anisotropy: 0.75,
      clearcoat: 0.2,
    })
  );
  const darkAnodizedMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x22252b,
      metalness: 0.72,
      roughness: 0.42,
    })
  );
  const brassMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0xc99c52,
      metalness: 0.94,
      roughness: 0.18,
      anisotropy: 0.7,
    })
  );
  const glassMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0xeaf4ff,
      roughness: 0.08,
      metalness: 0.05,
      transmission: isSoftwareGl ? 0 : 0.92,
      transparent: true,
      opacity: isSoftwareGl ? 0.34 : 1,
      ior: 1.52,
      thickness: 0.85,
      clearcoat: 1,
      depthWrite: false,
    })
  );

  if (department === 'electronics') {
    const bodyTintMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: primaryColor,
        metalness: 0.65,
        roughness: 0.34,
      })
    );
    accentMaterials.push(bodyTintMat);

    const dialTex = trackTex(createSurfaceFinishTexture('dial', '#0f1115', maxAnisotropy));
    const dialMat = trackMat(
      new THREE.MeshStandardMaterial({
        map: dialTex,
        roughness: 0.28,
        metalness: 0.15,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1,
      })
    );
    const rubberFootMat = trackMat(
      new THREE.MeshStandardMaterial({ color: 0x151618, metalness: 0.05, roughness: 0.9 })
    );

    // 1. Isolation rubber feet
    const feetGroup = new THREE.Group();
    const footGeo = trackGeo(new THREE.CylinderGeometry(0.11, 0.13, 0.08, 24));
    for (const [fx, fz] of [
      [-0.72, -0.42],
      [0.72, -0.42],
      [-0.72, 0.42],
      [0.72, 0.42],
    ]) {
      const foot = new THREE.Mesh(footGeo, rubberFootMat);
      foot.position.set(fx, 0.04, fz);
      feetGroup.add(foot);
    }
    registerPart(feetGroup, new THREE.Vector3(0, -0.25, 0));

    // 2. Machined main lower chassis
    const hullShape = createRoundedRectShape(1.78, 1.12, 0.14);
    const hullGeo = trackGeo(
      new THREE.ExtrudeGeometry(hullShape, {
        depth: 0.38,
        bevelEnabled: true,
        bevelThickness: 0.04,
        bevelSize: 0.04,
        bevelSegments: 4,
      })
    );
    hullGeo.rotateX(Math.PI / 2);
    const hullMesh = new THREE.Mesh(hullGeo, bodyTintMat);
    hullMesh.position.set(0, 0.5, 0);
    registerPart(hullMesh, new THREE.Vector3(0, 0, 0));

    // 3. Top brushed alloy deck plate
    const plateShape = createRoundedRectShape(1.64, 0.98, 0.1);
    const plateGeo = trackGeo(
      new THREE.ExtrudeGeometry(plateShape, {
        depth: 0.06,
        bevelEnabled: true,
        bevelThickness: 0.015,
        bevelSize: 0.015,
        bevelSegments: 3,
      })
    );
    plateGeo.rotateX(Math.PI / 2);
    const plateMesh = new THREE.Mesh(plateGeo, brushedMetalMat);
    plateMesh.position.set(0, 0.62, 0);
    registerPart(plateMesh, new THREE.Vector3(0, 0.35, 0));

    // 4. Internal copper acoustic/induction core ring
    const coilGeo = trackGeo(new THREE.TorusGeometry(0.28, 0.045, 20, 48));
    coilGeo.rotateX(Math.PI / 2);
    const coilMesh = new THREE.Mesh(coilGeo, brassMat);
    coilMesh.position.set(-0.22, 0.54, 0);
    registerPart(coilMesh, new THREE.Vector3(-0.32, 0.24, 0));

    // 5. Recessed telemetry OLED dial
    const dialGeo = trackGeo(new THREE.CylinderGeometry(0.32, 0.32, 0.03, 40));
    const dialMesh = new THREE.Mesh(dialGeo, dialMat);
    dialMesh.position.set(-0.22, 0.64, 0);
    registerPart(dialMesh, new THREE.Vector3(-0.18, 0.52, 0));

    // 6. Optical sapphire lens dome
    const lensGeo = trackGeo(new THREE.CylinderGeometry(0.33, 0.34, 0.06, 40));
    const lensMesh = new THREE.Mesh(lensGeo, glassMat);
    lensMesh.renderOrder = 2;
    lensMesh.position.set(-0.22, 0.69, 0);
    registerPart(lensMesh, new THREE.Vector3(-0.18, 0.78, 0));

    // 7. Twin rotary encoder control knobs (LatheGeometry)
    const knobPts = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(0.15, 0),
      new THREE.Vector2(0.15, 0.14),
      new THREE.Vector2(0.13, 0.18),
      new THREE.Vector2(0.02, 0.18),
      new THREE.Vector2(0, 0.18),
    ];
    const knobGeo = trackGeo(new THREE.LatheGeometry(knobPts, 32));
    const knobsGroup = new THREE.Group();
    knobsGroup.position.set(0.46, 0.62, 0);
    const knobA = new THREE.Mesh(knobGeo, darkAnodizedMat);
    knobA.position.set(0, 0, -0.2);
    const knobB = new THREE.Mesh(knobGeo, brassMat);
    knobB.position.set(0, 0, 0.22);
    knobB.scale.set(0.84, 0.85, 0.84);
    knobsGroup.add(knobA, knobB);
    registerPart(knobsGroup, new THREE.Vector3(0.42, 0.48, 0));

    // 8. Rear cooling fins (InstancedMesh > 10 fins)
    const finGeo = trackGeo(new THREE.BoxGeometry(0.035, 0.28, 0.12));
    const finCount = 12;
    const finInst = new THREE.InstancedMesh(finGeo, darkAnodizedMat, finCount);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < finCount; i++) {
      dummy.position.set(-0.66 + i * 0.12, 0.34, -0.58);
      dummy.updateMatrix();
      finInst.setMatrixAt(i, dummy.matrix);
    }
    finInst.computeBoundingSphere();
    registerPart(finInst, new THREE.Vector3(0, 0.1, -0.45));
  } else if (department === 'fashion') {
    const weaveTex = trackTex(createSurfaceFinishTexture('weave', primaryColor.getStyle(), maxAnisotropy));
    const leatherMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: primaryColor,
        map: weaveTex,
        roughness: 0.72,
        metalness: 0.06,
      })
    );
    accentMaterials.push(leatherMat);
    const trimLeatherMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x1b1918,
        roughness: 0.55,
        metalness: 0.1,
      })
    );

    // 1. Protective brass base studs
    const studGeo = trackGeo(new THREE.CylinderGeometry(0.055, 0.07, 0.06, 16));
    const studsGroup = new THREE.Group();
    for (const [sx, sz] of [
      [-0.54, -0.24],
      [0.54, -0.24],
      [-0.54, 0.24],
      [0.54, 0.24],
    ]) {
      const st = new THREE.Mesh(studGeo, brassMat);
      st.position.set(sx, 0.03, sz);
      studsGroup.add(st);
    }
    registerPart(studsGroup, new THREE.Vector3(0, -0.22, 0));

    // 2. Sculpted structured atelier bag silhouette
    const bagShape = new THREE.Shape();
    bagShape.moveTo(-0.68, 0);
    bagShape.lineTo(0.68, 0);
    bagShape.lineTo(0.58, 1.05);
    bagShape.quadraticCurveTo(0, 1.12, -0.58, 1.05);
    bagShape.closePath();
    const bagGeo = trackGeo(
      new THREE.ExtrudeGeometry(bagShape, {
        depth: 0.48,
        bevelEnabled: true,
        bevelThickness: 0.05,
        bevelSize: 0.04,
        bevelSegments: 4,
      })
    );
    bagGeo.translate(0, 0, -0.24);
    const bagBody = new THREE.Mesh(bagGeo, leatherMat);
    bagBody.position.set(0, 0.06, 0);
    registerPart(bagBody, new THREE.Vector3(0, 0, 0));

    // 3. Contrast stitched top flap
    const flapShape = createRoundedRectShape(1.14, 0.46, 0.08);
    const flapGeo = trackGeo(
      new THREE.ExtrudeGeometry(flapShape, {
        depth: 0.08,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.02,
        bevelSegments: 3,
      })
    );
    const flapMesh = new THREE.Mesh(flapGeo, trimLeatherMat);
    flapMesh.position.set(0, 0.88, 0.26);
    registerPart(flapMesh, new THREE.Vector3(0, 0.35, 0.36));

    // 4. Engraved brass turn-lock clasp
    const claspGroup = new THREE.Group();
    const plate = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.24, 0.16, 0.04)), brassMat);
    const lockPin = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.035, 0.035, 0.07, 20)), brassMat);
    lockPin.rotation.x = Math.PI / 2;
    lockPin.position.z = 0.03;
    claspGroup.add(plate, lockPin);
    claspGroup.position.set(0, 0.72, 0.34);
    registerPart(claspGroup, new THREE.Vector3(0, 0.2, 0.62));

    // 5. Front & rear braided handles (TubeGeometry)
    const handleCurveFront = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.34, 1.08, 0.18),
      new THREE.Vector3(-0.26, 1.48, 0.22),
      new THREE.Vector3(0, 1.56, 0.22),
      new THREE.Vector3(0.26, 1.48, 0.22),
      new THREE.Vector3(0.34, 1.08, 0.18),
    ]);
    const handleGeoFront = trackGeo(new THREE.TubeGeometry(handleCurveFront, 32, 0.042, 14, false));
    const handleFront = new THREE.Mesh(handleGeoFront, trimLeatherMat);
    registerPart(handleFront, new THREE.Vector3(0, 0.48, 0.2));

    const handleCurveBack = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.34, 1.08, -0.18),
      new THREE.Vector3(-0.26, 1.48, -0.22),
      new THREE.Vector3(0, 1.56, -0.22),
      new THREE.Vector3(0.26, 1.48, -0.22),
      new THREE.Vector3(0.34, 1.08, -0.18),
    ]);
    const handleGeoBack = trackGeo(new THREE.TubeGeometry(handleCurveBack, 32, 0.042, 14, false));
    const handleBack = new THREE.Mesh(handleGeoBack, trimLeatherMat);
    registerPart(handleBack, new THREE.Vector3(0, 0.48, -0.2));

    // 6. Side D-ring strap mounts
    const ringGeo = trackGeo(new THREE.TorusGeometry(0.085, 0.018, 12, 24));
    const ringsGroup = new THREE.Group();
    const ringL = new THREE.Mesh(ringGeo, brassMat);
    ringL.rotation.y = Math.PI / 2;
    ringL.position.set(-0.68, 0.94, 0);
    const ringR = new THREE.Mesh(ringGeo, brassMat);
    ringR.rotation.y = Math.PI / 2;
    ringR.position.set(0.68, 0.94, 0);
    ringsGroup.add(ringL, ringR);
    registerPart(ringsGroup, new THREE.Vector3(0, 0.18, 0));
  } else {
    // home-gadgets: Architectural Brass & Borosilicate Atelier Pour-Over Brewer / Lamp
    const grainTex = trackTex(createSurfaceFinishTexture('grain', primaryColor.getStyle(), maxAnisotropy));
    const woodBaseMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: primaryColor,
        map: grainTex,
        roughness: 0.65,
        metalness: 0.08,
      })
    );
    accentMaterials.push(woodBaseMat);

    // 1. Stepped architectural plinth base (LatheGeometry)
    const plinthPts = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(0.66, 0),
      new THREE.Vector2(0.64, 0.14),
      new THREE.Vector2(0.56, 0.18),
      new THREE.Vector2(0, 0.18),
    ];
    const plinthGeo = trackGeo(new THREE.LatheGeometry(plinthPts, 40));
    const plinthMesh = new THREE.Mesh(plinthGeo, woodBaseMat);
    plinthMesh.position.set(0, 0, 0);
    registerPart(plinthMesh, new THREE.Vector3(0, -0.22, 0));

    // 2. Brushed brass heating / calibration ring
    const ringMesh = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.49, 0.52, 0.08, 40)),
      brassMat
    );
    ringMesh.position.set(0, 0.22, 0);
    registerPart(ringMesh, new THREE.Vector3(0, 0.05, 0));

    // 3. Borosilicate optical glass carafe (LatheGeometry)
    const carafePts = [
      new THREE.Vector2(0.02, 0),
      new THREE.Vector2(0.46, 0),
      new THREE.Vector2(0.54, 0.25),
      new THREE.Vector2(0.32, 0.68),
      new THREE.Vector2(0.36, 0.96),
      new THREE.Vector2(0.34, 0.98),
      new THREE.Vector2(0.29, 0.68),
      new THREE.Vector2(0.49, 0.25),
      new THREE.Vector2(0.41, 0.04),
      new THREE.Vector2(0.02, 0.04),
    ];
    const carafeGeo = trackGeo(new THREE.LatheGeometry(carafePts, 44));
    const carafeMesh = new THREE.Mesh(carafeGeo, glassMat);
    carafeMesh.renderOrder = 2;
    carafeMesh.position.set(0, 0.26, 0);
    registerPart(carafeMesh, new THREE.Vector3(0, 0.22, 0));

    // 4. Internal matte ceramic dripper cone
    const conePts = [
      new THREE.Vector2(0.06, 0),
      new THREE.Vector2(0.35, 0.34),
      new THREE.Vector2(0.31, 0.34),
      new THREE.Vector2(0.04, 0.02),
    ];
    const coneMesh = new THREE.Mesh(trackGeo(new THREE.LatheGeometry(conePts, 32)), darkAnodizedMat);
    coneMesh.position.set(0, 0.96, 0);
    registerPart(coneMesh, new THREE.Vector3(0, 0.55, 0));

    // 5. Gooseneck brass pour spout (TubeGeometry)
    const spoutCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.42, 0.52, 0),
      new THREE.Vector3(0.7, 0.64, 0),
      new THREE.Vector3(0.76, 1.05, 0),
      new THREE.Vector3(0.88, 1.18, 0),
    ]);
    const spoutMesh = new THREE.Mesh(
      trackGeo(new THREE.TubeGeometry(spoutCurve, 32, 0.045, 16, false)),
      brassMat
    );
    registerPart(spoutMesh, new THREE.Vector3(0.38, 0.24, 0));

    // 6. Sculpted walnut handle (TubeGeometry)
    const handleCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.34, 1.1, 0),
      new THREE.Vector3(-0.68, 1.04, 0),
      new THREE.Vector3(-0.72, 0.66, 0),
      new THREE.Vector3(-0.48, 0.45, 0),
    ]);
    const handleMesh = new THREE.Mesh(
      trackGeo(new THREE.TubeGeometry(handleCurve, 28, 0.055, 16, false)),
      woodBaseMat
    );
    registerPart(handleMesh, new THREE.Vector3(-0.38, 0.24, 0));

    // 7. Brass lid & stepped finial cap
    const lidGroup = new THREE.Group();
    const lidDisc = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.37, 0.35, 0.05, 36)), brassMat);
    const finial = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.07, 0.09, 0.14, 24)), woodBaseMat);
    finial.position.y = 0.09;
    lidGroup.add(lidDisc, finial);
    lidGroup.position.set(0, 1.32, 0);
    registerPart(lidGroup, new THREE.Vector3(0, 0.85, 0));
  }

  return { root, parts, accentMaterials };
}

export function Product3DShowcase({
  department,
  title,
  colorHex = '#D94E28',
  locale,
}: Product3DShowcaseProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webglUnavailable, setWebglUnavailable] = useState(false);
  const [preset, setPreset] = useState<CameraPresetId>('studio');
  const [explodeFactor, setExplodeFactor] = useState(0);
  const [autoRotate, setAutoRotate] = useState(false);
  const [controlsExpanded, setControlsExpanded] = useState(true);

  const stateRef = useRef({
    explodeTarget: 0,
    explodeCurrent: 0,
    autoRotate: false,
    cameraPresetPending: false,
    presetTarget: CAMERA_PRESETS.studio,
    requestRender: () => {},
    updateColorHex: (_hex: string) => {},
  });

  stateRef.current.explodeTarget = explodeFactor;
  stateRef.current.autoRotate = autoRotate;

  useEffect(() => {
    stateRef.current.updateColorHex(colorHex);
    stateRef.current.requestRender();
  }, [colorHex]);

  useEffect(() => {
    stateRef.current.requestRender();
  }, [explodeFactor, autoRotate]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const probe = detectSoftwareWebGL();
    if (!probe.supported) {
      setWebglUnavailable(true);
      return;
    }

    const isSoftwareGl = probe.isSoftwareGl;
    const width = Math.max(container.clientWidth, 320);
    const height = Math.max(container.clientHeight, 320);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x141518);
    scene.fog = new THREE.FogExp2(0x141518, 0.032);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 60);
    camera.position.set(...CAMERA_PRESETS.studio.pos);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.07;
    controls.enablePan = false;
    controls.minDistance = 2.0;
    controls.maxDistance = 6.5;
    controls.maxPolarAngle = Math.PI * 0.48;
    controls.target.set(...CAMERA_PRESETS.studio.target);

    // Warm Key + Cool Hemisphere Fill + Rim Light (<= 3 shadow casters)
    const keyLight = new THREE.DirectionalLight(0xfff1dc, 2.25);
    keyLight.position.set(3.8, 5.2, 3.6);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 16;
    const d = 3.2;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const hemiLight = new THREE.HemisphereLight(0x8bb6db, 0x202226, 0.95);
    scene.add(hemiLight);

    const rimLight = new THREE.DirectionalLight(0xd9e8ff, 0.72);
    rimLight.position.set(-3.5, 2.8, -3.2);
    scene.add(rimLight);

    if (!isSoftwareGl) {
      RectAreaLightUniformsLib.init();
      const softbox = new THREE.RectAreaLight(0xfff8ee, 2.4, 3.2, 1.4);
      softbox.position.set(-2.6, 2.8, 2.2);
      softbox.lookAt(0, 0.85, 0);
      scene.add(softbox);
    }

    const disposables = {
      geometries: [] as THREE.BufferGeometry[],
      materials: [] as THREE.Material[],
      textures: [] as THREE.Texture[],
    };

    // Studio grounded plinth + radial contact shadow (offset Y by >= 0.02)
    const shadowTex = createRadialShadowTexture();
    disposables.textures.push(shadowTex);
    const contactMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.52,
    });
    disposables.materials.push(contactMat);
    const contactGeo = new THREE.PlaneGeometry(3.8, 3.8);
    contactGeo.rotateX(-Math.PI / 2);
    disposables.geometries.push(contactGeo);
    const contactPlane = new THREE.Mesh(contactGeo, contactMat);
    contactPlane.position.y = -0.02;
    scene.add(contactPlane);

    const plinthGeo = new THREE.CylinderGeometry(1.55, 1.62, 0.06, 64);
    disposables.geometries.push(plinthGeo);
    const plinthMat = new THREE.MeshStandardMaterial({
      color: 0x1c1d21,
      roughness: 0.78,
      metalness: 0.18,
    });
    disposables.materials.push(plinthMat);
    const studioPlinth = new THREE.Mesh(plinthGeo, plinthMat);
    studioPlinth.position.y = -0.05;
    studioPlinth.receiveShadow = !isSoftwareGl;
    scene.add(studioPlinth);

    const maxAniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    const { root, parts, accentMaterials } = buildCompositeProductModel(
      department,
      colorHex,
      isSoftwareGl,
      maxAniso,
      disposables
    );
    scene.add(root);

    stateRef.current.updateColorHex = (nextHex: string) => {
      for (const mat of accentMaterials) {
        mat.color.set(nextHex || '#D94E28');
      }
    };

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    let frameId = 0;
    let renderBusy = false;
    let renderDirty = false;
    let disposed = false;
    let lastTime = performance.now();

    const afterDraw = (cb: () => void) => {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) {
          if (sync) gl.deleteSync(sync);
          return;
        }
        const status = sync ? gl.getSyncParameter(sync, gl.SYNC_STATUS) : gl.ALREADY_SIGNALED;
        if (status === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    };

    const requestRender = () => {
      if (disposed) return;
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      frameId = requestAnimationFrame((now) => {
        if (disposed) return;
        const delta = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
        lastTime = now;
        renderDirty = false;

        let needsMoreFrames = false;

        // Smooth exploded-view damping
        const st = stateRef.current;
        if (Math.abs(st.explodeCurrent - st.explodeTarget) > 0.002) {
          st.explodeCurrent = isSoftwareGl
            ? st.explodeTarget
            : THREE.MathUtils.damp(st.explodeCurrent, st.explodeTarget, 8, delta);
          needsMoreFrames = !isSoftwareGl;
        } else {
          st.explodeCurrent = st.explodeTarget;
        }
        for (const p of parts) {
          _targetPartPos.copy(p.basePos).addScaledVector(p.explodeDir, st.explodeCurrent);
          p.obj.position.copy(_targetPartPos);
        }

        // Smooth camera preset damping
        if (st.cameraPresetPending) {
          _desiredPos.set(...st.presetTarget.pos);
          _desiredTarget.set(...st.presetTarget.target);
          if (isSoftwareGl) {
            camera.position.copy(_desiredPos);
            controls.target.copy(_desiredTarget);
            st.cameraPresetPending = false;
          } else {
            const k = 1 - Math.exp(-7 * delta);
            camera.position.lerp(_desiredPos, k);
            controls.target.lerp(_desiredTarget, k);
            if (camera.position.distanceTo(_desiredPos) < 0.02 && controls.target.distanceTo(_desiredTarget) < 0.02) {
              camera.position.copy(_desiredPos);
              controls.target.copy(_desiredTarget);
              st.cameraPresetPending = false;
            } else {
              needsMoreFrames = true;
            }
          }
        }

        // Optional turntable rotation
        if (st.autoRotate) {
          root.rotation.y += delta * 0.55;
          needsMoreFrames = true;
        }

        controls.update();
        renderer.render(scene, camera);

        const done = () => {
          renderBusy = false;
          if (!disposed && (renderDirty || needsMoreFrames)) {
            requestRender();
          }
        };
        if (isSoftwareGl) afterDraw(done);
        else done();
      });
    };

    stateRef.current.requestRender = requestRender;

    const onControlStart = () => {
      stateRef.current.cameraPresetPending = false;
    };
    const onControlChange = () => {
      requestRender();
    };
    controls.addEventListener('start', onControlStart);
    controls.addEventListener('change', onControlChange);

    const resizeObserver = new ResizeObserver((entries) => {
      if (disposed) return;
      const entry = entries[0];
      if (!entry) return;
      const nextW = Math.max(240, Math.floor(entry.contentRect.width));
      const nextH = Math.max(240, Math.floor(entry.contentRect.height));
      camera.aspect = nextW / nextH;
      camera.updateProjectionMatrix();
      renderer.setSize(nextW, nextH);
      requestRender();
    });
    resizeObserver.observe(container);

    requestRender();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      controls.removeEventListener('start', onControlStart);
      controls.removeEventListener('change', onControlChange);
      controls.dispose();
      envTarget.dispose();
      for (const g of disposables.geometries) g.dispose();
      for (const m of disposables.materials) m.dispose();
      for (const t of disposables.textures) t.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [department]);

  const handlePresetClick = (nextPreset: CameraPresetId) => {
    setPreset(nextPreset);
    stateRef.current.presetTarget = CAMERA_PRESETS[nextPreset];
    stateRef.current.cameraPresetPending = true;
    stateRef.current.requestRender();
  };

  if (webglUnavailable) {
    return (
      <div className="w-full aspect-[4/3] border border-[var(--line)] bg-[var(--ink)] flex flex-col items-center justify-center p-6 text-center space-y-2">
        <p className="font-mono-tabular text-xs uppercase text-[var(--gold)]">WebGL2 Unavailable</p>
        <p className="text-sm text-[var(--bone)]">{title}</p>
        <p className="text-xs text-[var(--muted)]">
          {locale === 'ar'
            ? 'المتصفح الحالي لا يدعم تسريع الرسوميات ثلاثية الأبعاد.'
            : 'Interactive 3D view requires WebGL2 support. Switch back to Photo Gallery above.'}
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-[4/3] border border-[var(--line)] bg-[#141518] overflow-hidden select-none">
      {/* Isolated empty mount ref for Three.js WebGL canvas */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" aria-label={`Interactive 3D studio view of ${title}`} />

      {/* Minimal Top-Left Studio Title Badge */}
      <div className="pointer-events-none absolute top-3 start-3 border border-[var(--line)] bg-[#141518]/90 px-2.5 py-1 text-[11px] font-mono-tabular uppercase text-[var(--bone)]">
        {locale === 'ar' ? 'استوديو العرض ثلاثي الأبعاد · اسحب للتدوير' : '3D Studio Inspect · Drag to Orbit'}
      </div>

      {/* Collapsible Unified Bottom Dock (zero backdrop-filter over WebGL, zero side clutter) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[min(94%,620px)] flex flex-col items-center">
        <button
          type="button"
          onClick={() => setControlsExpanded((v) => !v)}
          className="px-3 py-1 border border-b-0 border-[var(--line)] bg-[#141518]/95 text-[10px] font-mono-tabular uppercase tracking-wider text-[var(--muted)] hover:text-[var(--bone)] inline-flex items-center gap-1 cursor-pointer"
        >
          {controlsExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
          <span>{controlsExpanded ? (locale === 'ar' ? 'إخفاء الأدوات' : 'Hide Controls') : (locale === 'ar' ? 'إظهار الأدوات' : 'Show Controls')}</span>
        </button>

        {controlsExpanded && (
          <div className="w-full border border-[var(--line)] bg-[#141518]/95 px-3 py-2 flex flex-wrap items-center justify-between gap-2.5 text-[11px]">
            <div className="flex items-center gap-1">
              {(
                [
                  { id: 'studio', label: locale === 'ar' ? 'استوديو' : 'Studio' },
                  { id: 'front', label: locale === 'ar' ? 'أمام' : 'Front' },
                  { id: 'top', label: locale === 'ar' ? 'أعلى' : 'Top' },
                ] as const
              ).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handlePresetClick(item.id)}
                  className={`px-2 py-1 border font-mono-tabular uppercase cursor-pointer ${
                    preset === item.id
                      ? 'border-[var(--ember)] bg-[var(--ember)] text-[var(--ember-fg)]'
                      : 'border-[var(--line)] text-[var(--bone)] hover:border-[var(--bone)]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <label className="flex items-center gap-2 font-mono-tabular text-[var(--muted)]">
              <Layers className="w-3.5 h-3.5 text-[var(--cedar)] shrink-0" aria-hidden="true" />
              <span>{locale === 'ar' ? 'تفكيك' : 'Explode'}</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={explodeFactor}
                onChange={(e) => setExplodeFactor(Number(e.target.value))}
                aria-label="Assembly Explode View"
                className="w-20 accent-[var(--ember)] cursor-pointer"
              />
            </label>

            <button
              type="button"
              onClick={() => setAutoRotate((v) => !v)}
              className={`px-2.5 py-1 border font-mono-tabular uppercase inline-flex items-center gap-1 cursor-pointer ${
                autoRotate
                  ? 'border-[var(--cedar)] text-[var(--cedar)]'
                  : 'border-[var(--line)] text-[var(--bone)] hover:border-[var(--bone)]'
              }`}
            >
              <RotateCw className="w-3 h-3" aria-hidden="true" />
              <span>{locale === 'ar' ? 'دوران' : 'Rotate'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
