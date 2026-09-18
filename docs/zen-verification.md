# Serein verification

Verified September 12, 2026 in headless Google Chrome against the local Next development server.

- Desktop 1440 × 1000 and mobile 390 × 844 rendering inspected.
- No page exceptions or failed local asset responses in normal gameplay.
- Game model requests begin only after launching the mode.
- WASD movement and held mobile directional controls move the player away from a nearby discovery.
- Journal travel, proximity interaction with E, discovery panels and discovery count work.
- Ambient sound enable/mute state works.
- Escape closes panels before exiting the game; exit restores launch-button focus and body scrolling.
- Global inventory shortcut does not navigate while the game is open.
- Reopening and desktop focus wrapping work.
- Reduced-motion mode runs successfully.
- Simulated WebGL unavailability displays portfolio links and a working exit.
- `npm run typecheck` passes.
- `npm run build -- --webpack` passes using Node 24.16.0.

The default Turbopack production build hit a local CSS-worker port-binding restriction (`Operation not permitted`), including on retry. The webpack build verifies compilation, type checking and generation of all 21 static pages; the default build script remains unchanged.

Mobile checks emulate viewport and pointer input in desktop Chrome; physical iOS/Android hardware has not been tested.

## Exploration rebuild — September 13, 2026

Replaced the original diorama world with layered Perlin terrain, a larger surveyed valley, dense foliage in culled instance tiles, fungal groves, procedural cloud shading, directional lighting, material reflections, and subtle bloom. Added authored Quaternius alien plants, dome and cylindrical habitat models.

Final Chrome checks at 1440 × 1000 and 390 × 844:

- Walking displacement approximately 3.5 m versus sprint displacement approximately 6.7 m over the same automated input interval.
- Jump rises above the surface and lands back at the same height.
- Walking toward an outpost stops at its collider; separate-axis movement supports sliding along obstacles.
- Terrain physics, vegetation placement, and camera clearance use the rendered triangle heights.
- Horizontal/vertical orbit, zoom, pointer lock and Escape unlock pass.
- Portfolio proximity interactions, scanning, journal travel, sound toggle, focus restoration and mobile rendering pass.
- No page errors, WebGL shader errors, or failed local asset responses during the tested normal flows.
- The final two-second desktop requestAnimationFrame measurement was approximately 60 FPS. This is a local automated measurement, not a hardware-wide performance guarantee.
- Node 24 typecheck and `npm run build -- --webpack` pass after the final fixes.

Terrain is a deterministic bounded valley, not an infinite voxel world. The new mobile layout was tested in Chrome viewport emulation; physical mobile devices remain untested. The earlier no-WebGL fallback check applies to the original renderer; that failure path is retained, but was not re-run after this rebuild.

## Expedition, astronaut and jetpack update — September 13, 2026

- Browser progression test passed: collect a cell, power the landing relay, wake Pip, reject a bridge repair without a cell, recover another cell, restore the physical bridge, and cross its deck. Save/reopen retained discoveries. Unvisited station travel stayed disabled.
- The astronaut now uses authored locomotion clips, a sealed helmet replacing the animal head, and a torso-mounted jetpack. Front and rear screenshots inspected.
- Flight regression passed: tap Space jumped approximately 0.9 m at the sampled instant without spending charge; holding Space for three seconds reached approximately 22 m above the initial ground while moving forward, leaving 64% charge. Release triggered descent, landing restored charge to 100%, and opening the journal cleared thrust.
- Mobile 390 × 844 HUD screenshot inspected; held on-screen jump/flight control engaged thrust and release stopped it. Tested through desktop Chrome pointer emulation, not physical mobile hardware.
- No browser exceptions or console errors in the flight regression. Earlier desktop idle measurement approximately 60 FPS.
- Production webpack build passed, including TypeScript and all 21 static pages.

The HUD follows the reference’s peripheral layout: suit systems upper left, jetpack upper right, location lower left, and objective lower right. There is no combat or damage system. Ground contact correction is visual sole alignment, not full foot IK. Terrain remains bounded and deterministic.
