import React, { useEffect } from "react";
import QRCodeScanner from "./QRCodeScanner";
import axios from "axios";

const UseQRReader = ({ setScannedData, scannedData, setFormData, formData }) => {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    if (scannedData.length > 0) {
      axios.get(`${API_BASE_URL}/security/getinfobycellnumber/` + scannedData)
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
