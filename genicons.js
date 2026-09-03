const zlib = require("zlib");
const fs = require("fs");

function crc32(buf){
  let c = ~0;
  for (let i=0;i<buf.length;i++){
    c ^= buf[i];
    for (let k=0;k<8;k++) c = (c>>>1) ^ (0xEDB88320 & -(c & 1));
  }
  return ~c >>> 0;
}
function chunk(type, data){
  const t = Buffer.from(type, "ascii");
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(Buffer.concat([t, data])), 0);
  return Buffer.concat([len, t, data, crc]);
}
function png(w, h, rgba){
  const sig = Buffer.from([137,80,78,71,13,10,26,10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w,0); ihdr.writeUInt32BE(h,4);
  ihdr[8]=8; ihdr[9]=6; ihdr[10]=0; ihdr[11]=0; ihdr[12]=0;
  const stride = w*4;
  const raw = Buffer.alloc((stride+1)*h);
  for (let y=0;y<h;y++){
    raw[y*(stride+1)] = 0;
    rgba.copy(raw, y*(stride+1)+1, y*stride, y*stride+stride);
  }
  const idat = zlib.deflateSync(raw, {level:9});
  return Buffer.concat([sig, chunk("IHDR",ihdr), chunk("IDAT",idat), chunk("IEND",Buffer.alloc(0))]);
}

// accent + white, drawn at reference 512 then scaled by ratio
const BG = [0xd3,0x3f,0x28,0xff];
const FG = [0xff,0xff,0xff,0xff];

function makeIcon(size, pad){
  const buf = Buffer.alloc(size*size*4);
  const s = size/512;
  const cx = size/2, cy = size/2;
  const dot = 42*s;
  const rings = [[92,24],[150,24],[208,24]];
  for (let y=0;y<size;y++){
    for (let x=0;x<size;x++){
      let col = BG;
      const dx = x-cx, dy = y-cy;
      const d = Math.sqrt(dx*dx+dy*dy);
      if (d <= dot) col = FG;
      else {
        for (const [r,th] of rings){
          const rr = r*s, tt = th*s/2;
          if (d >= rr-tt && d <= rr+tt){ col = FG; break; }
        }
      }
      // maskable safe area: keep art within padded circle; outside padding stays BG (already)
      const o = (y*size+x)*4;
      buf[o]=col[0]; buf[o+1]=col[1]; buf[o+2]=col[2]; buf[o+3]=col[3];
    }
  }
  return png(size, size, buf);
}

fs.writeFileSync(process.argv[2]+"/icon-512.png", makeIcon(512));
fs.writeFileSync(process.argv[2]+"/icon-192.png", makeIcon(192));
fs.writeFileSync(process.argv[2]+"/apple-touch-icon.png", makeIcon(180));
console.log("icons written");
