'use client';

import { useEffect, useRef } from "react";
import QRCode from "qrcode";

export default function QR({ text, size=256 }: { text: string; size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, text, { width: size }, (err) => {
      if (err) console.error(err);
    });
  }, [text, size]);
  return <canvas ref={canvasRef} />;
}
