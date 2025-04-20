import React from "react";
import { QRCodeCanvas } from "qrcode.react";

const QRgenerator = ({ vcellno }) => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-2">Mobile QR Code</h2>
      <QRCodeCanvas
        value={vcellno}
        size={200}
        bgColor={"#ffffff"}
        fgColor={"#000000"}
        level={"H"}
      />
    </div>
  );
};

export default QRgenerator;
