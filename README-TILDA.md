# FORM Material Studio — Beta 06 / Material Engine

## Install
Replace the files in the GitHub repository with all files in this folder. Vercel redeploys automatically.
Vercel static settings: Framework Other, Build Command empty, Output Directory `.`.

## Fixes in this build
- Pointer coordinates are measured against the actual artboard element, not an individual canvas. This prevents offset/scaling drift when the editor is resized.
- Both canvas layers are absolutely stacked to exactly fill the artboard, preserving identical pointer/render coordinates.
- Pointer events prevent browser gestures and use pointer capture.
- 3D geometry is cached per layer. A new mouse point updates only the changing stroke instead of rebuilding every mesh on every pointer event.
- Removed repeated WebGL drawing-buffer resize on each frame.
- Added more distinct 3D geometry for paste, volumetric foam, beads, sand, stipple, porous, wire, rose thorns, laurel, clay and wood.

## Important
This is a procedural 3D browser renderer, not a physically measured material library. Foam and porous use open-cell strut geometry; true boolean/voxel sculpting and physically simulated fluid/foam remain future improvements. Test in a modern browser with WebGL and internet access (Three.js loads from jsDelivr).
