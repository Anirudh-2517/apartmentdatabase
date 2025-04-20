import React, { useEffect } from "react";
import QRCodeScanner from "./QRCodeScanner";
import axios from "axios";

const UseQRReader = ({ setScannedData, scannedData ,setFormData,formData}) => {
  useEffect(() => {
    if (scannedData.length > 0) {
      axios.get("http://localhost:9000/api/security/getinfobycellnumber/" + scannedData)
        .then(response => {
          setFormData(response.data[0])
        })
        .catch(error => {
          console.log(error)
        })
    }
  }, [scannedData])

  return (
    <div className="p-4">
      <QRCodeScanner onScanSuccess={(data) => setScannedData(data)} />
    </div>
  );
};

export default UseQRReader;
