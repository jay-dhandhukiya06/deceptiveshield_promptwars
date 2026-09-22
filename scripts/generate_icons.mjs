import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createShieldPNG(size) {
  // CRC32 table
  const crcTable = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    crcTable[n] = c >>> 0;
  }

  function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    const crcVal = crc32(Buffer.concat([typeBuf, data]));
    crcBuf.writeUInt32BE(crcVal, 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(size, 0);
  ihdrData.writeUInt32BE(size, 4);
  ihdrData.writeUInt8(8, 8); // bit depth
  ihdrData.writeUInt8(6, 9); // color type: RGBA
  ihdrData.writeUInt8(0, 10); // compression
  ihdrData.writeUInt8(0, 11); // filter
  ihdrData.writeUInt8(0, 12); // interlace
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // Raw Image Data (Filter byte 0 + RGBA pixels)
  const rawData = Buffer.alloc((1 + size * 4) * size);
  let offset = 0;

  const center = size / 2;
  const radius = size * 0.44;

  for (let y = 0; y < size; y++) {
    rawData.writeUInt8(0, offset++); // Filter type 0 (None)
    for (let x = 0; x < size; x++) {
      // Draw shield shape
      const nx = (x - center) / radius; // -1 to 1
      const ny = (y - center) / radius; // -1 to 1

      // Shield geometry approximation
      let inShield = false;
      let isBorder = false;
      let isAccent = false;

      // Top curve or flat top with curved sides pointing down
      if (ny >= -0.85 && ny <= 0.95 && Math.abs(nx) <= 0.85) {
        if (ny <= 0.1) {
          inShield = Math.abs(nx) <= 0.82;
        } else {
          // Pointing down towards (0, 0.95)
          const slope = (0.95 - ny) / 0.85;
          inShield = Math.abs(nx) <= slope * 0.82;
        }
      }

      if (inShield) {
        // Inner vs outer border
        const distFromCenter = Math.sqrt(nx * nx + ny * ny);
        if (Math.abs(nx) >= 0.7 || ny >= 0.8 || ny <= -0.75) {
          isBorder = true;
        } else if (Math.abs(nx) <= 0.15 && ny >= -0.4 && ny <= 0.15) {
          // Exclamation mark body
          isAccent = true;
        } else if (Math.abs(nx) <= 0.15 && ny >= 0.35 && ny <= 0.55) {
          // Exclamation mark dot
          isAccent = true;
        }

        if (isAccent) {
          // Warning Yellow / Red exclamation
          rawData.writeUInt8(254, offset);     // R
          rawData.writeUInt8(240, offset + 1); // G
          rawData.writeUInt8(138, offset + 2); // B
          rawData.writeUInt8(255, offset + 3); // A
        } else if (isBorder) {
          // Cyan / Blue Border
          rawData.writeUInt8(37, offset);      // R
          rawData.writeUInt8(99, offset + 1);  // G
          rawData.writeUInt8(235, offset + 2); // B
          rawData.writeUInt8(255, offset + 3); // A
        } else {
          // Deep Navy Cyber Shield Body
          rawData.writeUInt8(15, offset);      // R
          rawData.writeUInt8(23, offset + 1);  // G
          rawData.writeUInt8(42, offset + 2);  // B
          rawData.writeUInt8(255, offset + 3); // A
        }
      } else {
        // Transparent
        rawData.writeUInt8(0, offset);
        rawData.writeUInt8(0, offset + 1);
        rawData.writeUInt8(0, offset + 2);
        rawData.writeUInt8(0, offset + 3);
      }
      offset += 4;
    }
  }

  // IDAT Chunk
  const compressed = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressed);

  // IEND Chunk
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const outDir = path.resolve('public/extension/icons');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

[16, 48, 128].forEach(size => {
  const png = createShieldPNG(size);
  const filePath = path.join(outDir, `icon${size}.png`);
  fs.writeFileSync(filePath, png);
  console.log(`Generated icon: ${filePath} (${size}x${size})`);
});
