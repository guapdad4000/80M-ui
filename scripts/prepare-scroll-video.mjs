// Run with: node scripts/prepare-scroll-video.mjs (requires ffmpeg).
// Each frame is independently decodable so scroll seeks don't replay a GOP.
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const source = fileURLToPath(new URL('../public/media/80m-background-h264.mp4', import.meta.url));
const output = fileURLToPath(new URL('../public/media/80m-background-scrub.mp4', import.meta.url));
const result = spawnSync('ffmpeg', [
  '-hide_banner', '-loglevel', 'warning', '-y', '-i', source,
  '-an', '-vf', 'scale=1080:-2', '-c:v', 'libx264', '-preset', 'medium',
  '-crf', '24', '-g', '1', '-bf', '0', '-pix_fmt', 'yuv420p',
  '-movflags', '+faststart', output,
], { stdio: 'inherit' });
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
