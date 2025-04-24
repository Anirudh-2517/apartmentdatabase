import { useState } from "react";
import { BrowserRouter} from "react-router-dom";
import "./App.css";
import Chairman from "./components/ChairmanDashboard";
import Secretary from "./components/SecretaryDashboard";
import Owner from "./components/OwnerDashboard";
import Security from "./components/SecurityDashboard";
import AdminDashboard from "./components/AdminDashboard";
import Home from "./components/Home";

function App() 
{
  const [loginStatus, setLoginStatus] = useState(false);
  const [login,setLogin]=useState("")
  const [userType, setUserType] = useState("");
  const [scannedData, setScannedData] = useState("");
  const [oid, setOid] = useState()
  const [formData, setFormData] = useState({
    vname: "",
    vcellno: "",
    flatno: "",
    vdate: "",
    vpurpose: "",
    intime: "",
    outtime: ""
  });
  const [firstTime, setFirstTime] = useState(true);
  const [username, setUsername] = useState("");
  const handleLogout = () => {
    setLoginStatus(false);
    setUserType("");
    setUsername("");
  };
  return (
    <div className="App">
      {!loginStatus ? 
      (
        <Home
          firstTime={firstTime}
          setFirstTime={setFirstTime}
          setOid={setOid}
          oid={oid}
          setLoginStatus={setLoginStatus}
          setUserType={setUserType}
          setUsername={setUsername}
          setLogin={setLogin} />
      ) : userType === "Admin" ? 
      (
        <AdminDashboard setLoginStatus={setLoginStatus} />
      ) : userType === "Chairman" ?
      (
        <BrowserRouter>
        <Chairman setLoginStatus={setLoginStatus} /></BrowserRouter>
      ) : userType === "Secretary" ? 
      (
        <Secretary setLoginStatus={setLoginStatus} />
      ) : userType === "Owner" ? 
      (
        <div>
          <Owner username={username} setLoginStatus={setLoginStatus} oid={oid} login={login}/>
        </div>
      ) : 
      (
        <Security formData={formData} setFormData={setFormData} scannedData={scannedData} setScannedData={setScannedData} setLoginStatus={setLoginStatus} />
      )}
    </div>
  );
}

export default App;