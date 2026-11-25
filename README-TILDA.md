# FORM Material Studio — Beta 05 / Hero Materials

This iteration focuses the first four benchmark materials: Glazed Ceramic, Stone Brush, Kinetic Metal, and Foam Brush.

## Changes
- Ceramic: polished physical clearcoat, subtle procedural micro-height, gently varying organic tube profile.
- Stone: multi-scale procedural grain and height variation, high roughness, irregular geometry.
- Metal: high-metalness chrome with room-environment reflections, clearcoat and anisotropic highlight response.
- Foam: open-cell 3D strut lattice. The pores are actual gaps between connected geometric struts, not painted dots or isolated spheres.
- Volumetric Foam remains a distinct inflated multi-lobed tool.

## Deploy
Upload all files in this folder to the root of the GitHub repository. Vercel static settings: Framework Other, Build command empty, Output directory `.`, Install command empty.

Three.js is loaded from jsDelivr. Internet access and WebGL are required.

## Honest limitations
This is a procedural WebGL material study, not a physically simulated foam solver or scanned photoreal asset library. Foam uses a connected open-cell lattice, not a watertight foam volume. The renderer has not been browser QA tested in this build. Check stroke creation, layer selection, undo/redo, project save/open and PNG export before using it in production.
