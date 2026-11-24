# FORM — Material Studio / Beta 02.4 (Typography)
Static app (index.html, style.css, script.js). Host on Vercel/Netlify, embed in Tilda via T123 iframe (see Beta 01 snippet: iframe src = your HTTPS URL, wrapper height 900px).

## What's new vs Beta 01
- Layer model: every stroke / image / eraser mark is an editable object (hide, lock, duplicate, reorder, delete, opacity, blend mode).
- Deterministic seeded rendering: no flicker on undo/redo, strokes re-render identically at any export scale.
- SELECT tool: pick a stroke, change brush, size, texture, relief, light angle, colour, glitter after drawing. Drag to move.
- 16 brushes with separate behaviours (spacing, speed response, post-passes for emboss and pores, path-based wire/thorns/laurel/wood).
- Image layers: move, scale, rotate; non-destructive texture (chrome / glitter / holo / grain) clipped to PNG alpha.
- Non-destructive eraser, Save/Open project (.form.json), PNG export 1x/2x/3x with transparency.
- Shortcuts: B draw, V select, E erase, Ctrl/Cmd+Z undo, Shift+Ctrl/Cmd+Z redo, Delete.

## Glitter Lab (new)
Fine, Chunky, Holographic, Rhinestones, Star Dust, Glitter Gel — all are glitter brushes that leave a trail. Controls: Size, Density, Shine, Color, Hue Shift, Randomness, Sparkle, Rotation. Layers stay editable after drawing.

## Masks & overlays (new)
Tool MASK (M): paint where an image's texture should appear (PAINT + / ERASE −, FULL, NO MASK). The mask is soft, non-destructive, undoable and saved in the project. Overlay mode per image: Auto / Overlay / Multiply / Soft Light / Screen / Replace.

## Symmetry (new)
Right panel > SYMMETRY: Off / Mirror left-right / Mirror top-bottom / Quad / Radial / Kaleidoscope, Segments 2-16. Axes pass through the artboard centre (dashed guides, not exported). Symmetry is stored per stroke, so in SELECT mode you can change or remove it after drawing. Works with the eraser and all 22 brushes.

## Typography (new)
+ ADD TEXT in the left panel. Text layers: multi-line, 4 font stacks, Chrome / Emboss / Flat / Outline styles, size, tracking, line height, alignment, colour, light angle, scale, rotate, opacity, blend. Fully editable after creation, saved in projects. Fonts are system fonts (Impact may fall back on Linux).

## Not yet done
WebGL/Three.js geometry, pressure sensitivity, transform handles, clay deformation of existing pixels.
