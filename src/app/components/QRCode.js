import QRCode from "qrcode";
import { useEffect, useRef } from "react";

export default function CanvasQR() {
  const canvasRef = useRef();

  useEffect(() => {
    QRCode.toCanvas(
      canvasRef.current,
      "https://avsarmarg.vercel.app",
      function (error) {
        if (error) console.error(error);
      }
    );
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} />
    </div>
  );
}
