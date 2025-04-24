import React, { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Camera, Scan, CheckCircle, XCircle } from "lucide-react";

const QRCodeScanner = ({ onScanSuccess }) => {
  const [scannerActive, setScannerActive] = useState(false);
  const [scanStatus, setScanStatus] = useState(null); 
  const [lastScanned, setLastScanned] = useState("");
  const scannerRef = useRef(null);
  const scannerContainerId = "qr-reader";
  const initializeScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(error => console.error("Scanner cleanup failed:", error));
      scannerRef.current = null;
    }
    const scanner = new Html5QrcodeScanner(
      scannerContainerId,
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        showTorchButtonIfSupported: true,
        showZoomSliderIfSupported: true,
      },
      false
    );
    scanner.render(
      (decodedText, decodedResult) => {
        console.log("QR Code detected:", decodedText);
        setLastScanned(decodedText);
        setScanStatus("success");
        onScanSuccess(decodedText);
        setTimeout(() => {
          scanner.clear().catch(error => console.error("Scanner cleanup failed:", error));
          scannerRef.current = null;
          setScannerActive(false);
        }, 1500);
      },
      (error) => {
        if (error) {
          console.warn("QR Code scan error:", error);
          setScanStatus("error");
        }
      }
    );
    scannerRef.current = scanner;
  };
  const startScanning = () => {
    setScannerActive(true);
    setScanStatus(null);
  };
  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(error => console.error("Scanner cleanup failed:", error));
      scannerRef.current = null;
    }
    setScannerActive(false);
  };

  useEffect(() => {
    if (scannerActive) {
      initializeScanner();
    }
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => console.error("Scanner cleanup failed:", error));
      }
    };
  }, [scannerActive]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-between w-full mb-4">
          <h2 className="text-lg font-medium text-gray-800 flex items-center">
            <Camera className="h-5 w-5 mr-2 text-blue-600" />
            Registration by Scanning
          </h2>
          {!scannerActive ? (
            <button
              onClick={startScanning}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center text-sm"
            >
              <Scan className="h-4 w-4 mr-1" />
              Start Scanner
            </button>
          ) : (
            <button
              onClick={stopScanning}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center text-sm"
            >
              <XCircle className="h-4 w-4 mr-1" />
              Close Scanner
            </button>
          )}
        </div>
        {scannerActive ? (
          <div className="w-full max-w-md">
            <div id={scannerContainerId} className="w-full overflow-hidden rounded-lg" />
            <style jsx>{`
              :global(#${scannerContainerId} video) {
                border-radius: 0.5rem;
                max-height: 300px;
                object-fit: cover;
              }
              :global(#${scannerContainerId} img) {
                display: none;
              }
              :global(#${scannerContainerId} button) {
                border-radius: 0.375rem;
                padding: 0.5rem 1rem;
                background-color: #2563eb;
                color: white;
                margin: 0.5rem;
              }
            `}</style>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg p-10 w-full max-w-md">
            {scanStatus === "success" ? (
              <div className="flex flex-col items-center space-y-3">
                <CheckCircle className="h-12 w-12 text-green-500" />
                <p className="text-green-700 font-medium">QR Code Scanned Successfully</p>
                <div className="bg-white p-3 rounded-md shadow-sm border border-gray-200 w-full max-w-xs overflow-hidden">
                  <p className="text-sm text-gray-600 truncate">{lastScanned}</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-3">
                <Scan className="h-12 w-12 text-gray-400" />
                <p className="text-gray-600">Click "Start Scanner" to scan QR code</p>
              </div>
            )}
          </div>
        )}
        <div className="mt-4 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg w-full max-w-md">
          <h3 className="font-medium text-blue-700 mb-1">Instructions:</h3>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Click "Start Scanner" to activate camera</li>
            <li>Position QR code in the viewfinder</li>
            <li>The scanner will automatically detect and process the QR code</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default QRCodeScanner;