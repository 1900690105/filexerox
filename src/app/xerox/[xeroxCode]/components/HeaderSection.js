import { FileText, QrCode } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useRef, useState } from "react";
import QRCode from "qrcode";

function HeaderSection() {
  const params = useParams();
  const { xeroxCode } = params;
  const canvasRef = useRef();

  const handleMyQr = () => {
    console.log(`filexerox/${xeroxCode}/upload`);

    QRCode.toCanvas(
      canvasRef.current,
      `https://filexerox.vercel.app/${xeroxCode}/upload`,
      function (error) {
        if (error) console.error(error);
      }
    );
  };
  return (
    <div>
      <div className="flex justify-between">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800">Xerox Orders</h1>
          </div>
          <p className="text-slate-600">
            Manage and track your printing orders
          </p>
        </div>
        <div className="">
          <button
            onClick={() => {
              handleMyQr();
            }}
            className="flex justify-center bg-amber-500 p-4 cursor-pointer text-white"
          >
            Get My <QrCode />
          </button>
          {canvasRef && (
            <div>
              <canvas ref={canvasRef} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HeaderSection;
