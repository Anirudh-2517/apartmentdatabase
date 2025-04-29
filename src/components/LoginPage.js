import React, { useState } from "react";
import { Eye, EyeOff, LogIn ,Home} from "lucide-react";

const LoginPage = ({ setLoginStatus, setUserType, setUsername, setOid, setLogin }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    userType: "Admin",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (message) setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setUsername(formData.username);

    try {
      const response = await fetch(`${API_BASE_URL}/login/authenticate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (response.ok) {
        setLogin(data.Login);
        setMessage(data.message);
        setUserType(data.userType);
        setOid(data.oid);
        setUsername(data.ofname + " " + data.olname);
        setLoginStatus(true);
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (error) {
      setMessage(error.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const userTypes = [
    { value: "Admin", label: "Administrator" },
    { value: "Chairman", label: "Chairman" },
    { value: "Secretary", label: "Secretary" },
    { value: "Owner", label: "Property Owner" },
    { value: "Security", label: "Security Staff" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all hover:shadow-xl border border-gray-100">
          <div className="p-8 pb-6">
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Home size={28} className="text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-blue-700 text-center">GrihaMitra</h2>
              <p className="text-gray-500 text-center mt-2">Apartment Management System</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700" htmlFor="username">
                Username
              </label>
              <input
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800 placeholder-gray-400 transition-all"
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                required
                autoComplete="username"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800 placeholder-gray-400 transition-all"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700" htmlFor="userType">
                Login As
              </label>
              <select
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800 transition-all appearance-none"
                id="userType"
                name="userType"
                value={formData.userType}
                onChange={handleChange}
              >
                {userTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              className={`w-full py-3 px-4 rounded-lg text-white font-medium flex items-center justify-center space-x-2 transition-all mt-6 ${
                isLoading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-md hover:shadow-lg"
              }`}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Sign In</span>
                </>
              )}
            </button>

            {message && (
              <div
                className={`p-4 rounded-lg text-sm font-medium text-center ${
                  message.includes("failed")
                    ? "bg-red-100 text-red-700 border border-red-200"
                    : "bg-green-100 text-green-700 border border-green-200"
                }`}
                role="alert"
              >
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;