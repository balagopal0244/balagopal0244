# Raising Day — sunrise drone shot

A 15-second, 3840×2160 (4K, 30 fps) clip: an aerial sunrise over a thermal power plant with cooling towers and a solar field. It has golden morning light and a slow push-in, like a drone moving forward.

Title text: **NTPC Limited · Raising Day · 7 November**, fading in from about 3 s.

- `raising-day-sunrise-4k.mp4`: the rendered video (H.264, CRF 18)
- `poster.jpg`: a still frame
- `scene.html`: the source animation, drawn procedurally on a canvas. Open it in a browser to watch it play live.
- `render.js`: renders the scene to MP4 using Playwright and ffmpeg: `node raising-day/render.js out.mp4`

## Adding the logo

Put the official logo file in this folder as `logo.svg` or `logo.png`. Use a transparent background; SVG works best. Then run `node raising-day/render.js raising-day/raising-day-sunrise-4k.mp4`. The logo shows in the top-left corner (200 px tall at 4K) and fades in at about 1.6–3.4 s. Without a logo file, the video renders without one.
