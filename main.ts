// gta6-clipper-01 entry (Node 22, standard library only).
//
// The entry is the video, not this program: the clip itself was cut in the
// agent session that built this repository (Rockstar's GTA VI Trailer 2,
// trimmed to the Vice City party run, cropped to vertical 1080x1920, with
// make.fun's pitch as text on screen over the last ten seconds), uploaded
// to YouTube as a public Short, and named in VIDEO.json. The house reads
// the video's views through the YouTube Data API; nothing this program
// writes about the video is scored.
//
// All this program does is copy VIDEO.json from the repository root to the
// grader's output directory, byte for byte, so the gate can read the video's
// address. It prints nothing on success and fails loudly otherwise.
//
// Local run (the way the grader runs it, with stand-ins for /bot and
// /output):
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const source = join(BOT_DIR, 'VIDEO.json');

let video;
try {
  video = JSON.parse(readFileSync(source, 'utf8'));
} catch (err) {
  console.error(`VIDEO.json could not be read from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}

if (typeof video !== 'object' || video === null || typeof video.url !== 'string' || !video.url.startsWith('https://')) {
  console.error('VIDEO.json must be an object with a string "url" starting with https://');
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
const destination = join(OUTPUT_DIR, 'VIDEO.json');
try {
  copyFileSync(source, destination);
  if (statSync(destination).size !== statSync(source).size) {
    throw new Error('copied file size does not match the source');
  }
} catch (err) {
  console.error(`VIDEO.json could not be copied to ${OUTPUT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
