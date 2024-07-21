import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (username, password) => {
    try {
      const response = await axios.post(
        "https://localhost:7292/api/Accounts/login",
        { username, password }
      );
      console.log("Full Response data:", response); // Log toàn bộ phản hồi để debug

      // Kiểm tra xem phản hồi có chứa dữ liệu và trường Role hay không
      if (!response.data || !response.data.CustomerInfo.Role) {
        console.error("Role is not defined in the response");
        console.error("Response data:", response.data); // Log dữ liệu phản hồi để debug
        return;
      }

      localStorage.setItem("username", response.data.CustomerInfo.UserName);
      localStorage.setItem("role", response.data.CustomerInfo.Role);
      console.log("Stored role:", localStorage.getItem("role")); // Thêm để debug

      const token = response.data.Token;
      localStorage.setItem("authToken", token);

      console.log("Login successful!");
      console.log("User role:", response.data.CustomerInfo.Role); // Thêm để debug

      if (response.data.CustomerInfo.Role === "Manager") {
        navigate("/ManagerPage");
      } else if (response.data.CustomerInfo.Role === "SaleStaff") {
        console.log("Navigating to SaleStaffPage"); // Thêm để debug
        navigate("/SaleStaffPage");
      } else if (response.data.CustomerInfo.Role === "Shipper") {
        navigate("/DeliStaffPage");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login failed:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data); // Thêm để debug
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(username, password);
  };

  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("authToken");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return (
    <div
      style={{
        backgroundImage: `url(${"https://assets.gtgraphics.de/representations/proxy/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBdVZJIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--1e4973e361e4a6de500a30eaadc796c8992852d8/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCam9MWm05eWJXRjBTU0lJYW5CbkJqb0dSVlE9IiwiZXhwIjpudWxsLCJwdXIiOiJ2YXJpYXRpb24ifX0=--7169841a733ae5073a9c105751b6e0a10336b854/Eternity.jpg"})`,
      }}
      className="relative w-screen h-screen flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat"
    >
      <div className="absolute w-[30vw] h-[60vh] bg-black bg-opacity-50 shadow-red-500/50 shadow-xl rounded-lg">
        <div className="w-full flex items-center justify-center">
          <div className="flex justify-around logo">
            <div className="mt-5 text-[2.6em]">EterniTy</div>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="absolute top-[30%] w-full h-[55%]">
            <div className="w-full flex flex-col items-center justify-center">
              <label className="block mb-8 w-[90%] rounded-lg">
                <span className="block text-sm mb-2 text-red-700 opacity-60">
                  Username
                </span>
                <input
                  type="text"
                  required
                  placeholder="Your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="outline-none border-b-[0.1em] shadow-red-500/50 shadow-xl border-b-black bg-zinc-300 bg-opacity-0 w-full text-white"
                />
              </label>
            </div>
            <div className="w-full flex flex-col items-center justify-center">
              <label className="block mb-8 w-[90%] rounded-lg">
                <span className="block text-sm mb-2 text-red-700 opacity-60">
                  Password
                </span>
                <input
                  type="password"
                  required
                  placeholder="*********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="outline-none border-b-[0.1em] shadow-red-500/50 shadow-lg border-b-black bg-zinc-300 bg-opacity-0 w-full text-white"
                />
              </label>
              <button
                type="submit"
                className="px-10 py-3 border-red-600 border-[0.1em] mt-8 text-white uppercase font-bold
             hover:shadow-red-500/50 hover:shadow-xl hover:text-red-500 transition-all duration-300 rounded-lg cursor-pointer"
              >
                Login
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
