import React, { useState } from "react";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";  //  import useNavigate

const videoList = [
  "/videos/G-TAMB-login1.mp4",
  "/videos/G-TAMB-login2.mp4",
  "/videos/G-TAMB-login3.mp4",
  "/videos/G-TAMB-login4.mp4",
];

const middleContent = {
  0: {
    title: "G-TAMB",
    text: [
      "G-TAMB offers an intuitive platform that integrates live project tracking with AI-driven insights and expert support, ensuring seamless management of road and building construction.",
      "By automating quality checks and safety alerts, it empowers clients to maintain control over timelines, budgets, and deliverables with unmatched precision and confidence.",
    ],
  },
  1: {
    title: "Real-Time Monitoring",
    text: [
      "G-TAMB tracks equipment like drum mix plants, pavers, and dumpers, alongside material output, using high-precision sensors for accurate, real-time data.",
      "Instant alerts detect deviations, ensuring timely corrections and adherence to project timelines and quality benchmarks.",
    ],
  },
  2: {
    title: "AI Integration",
    text: [
      "G-TAMB’s AI analyzes material properties and monitors site conditions to ensure compliance and safety, using predictive analytics to foresee bottlenecks.",
      "This reduces risks and supports informed decisions, ensuring consistent performance throughout the project.",
    ],
  },
  3: {
    title: "Mobile Application",
    text: [
      "G-TAMB’s Android and iOS mobile app provides a user-friendly interface for real-time project tracking, delivering live updates on equipment, materials, and progress.",
      "Coupled with SMS alerts, it ensures clients stay informed and can address issues instantly, no matter their location.",
    ],
  },
};

const LoginPage = ({ onLogin }) => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [inputCaptcha, setInputCaptcha] = useState("");
  const [currentVideo, setCurrentVideo] = useState(0);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();   //  FIX: useNavigate added here

  // Dummy credentials
  const dummyUser = { username: "admin", password: "12345" };

  function generateCaptcha() {
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    return { num1, num2, sum: num1 + num2 };
  }

  const refreshCaptcha = (e) => {
    e.preventDefault();
    setCaptcha(generateCaptcha());
    setInputCaptcha("");
  };

  const handleVideoEnd = () => {
    setCurrentVideo((prev) => (prev + 1) % videoList.length);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // ❌ Wrong captcha
    if (parseInt(inputCaptcha) !== captcha.sum) {
      setError("❌ CAPTCHA incorrect!");
      return;
    }

    // ❌ Wrong username/password
    if (username !== dummyUser.username || password !== dummyUser.password) {
      setError("❌ Invalid Username or Password");
      return;
    }

    //  Success
    setLoading(true);
    setTimeout(() => {
      setSuccess(" Login Successful!");
      setLoading(false);

      // Save token in localStorage
      localStorage.setItem("userToken", "12345");

      // Navigate to dashboard after success
      setTimeout(() => {
        navigate("/dashboard");
        if (onLogin) onLogin();
      }, 1500);
    }, 500);
  };

  return (
    <div className="container">
      {/* Left Section */}
      <div className="left-panel">
        <video
          key={currentVideo}
          autoPlay
          muted
          playsInline
          onEnded={handleVideoEnd}
          className="background-video"
        >
          <source src={videoList[currentVideo]} type="video/mp4" />
        </video>
      </div>

      {/* Middle Section */}
      <div className="middle-panel">
        {middleContent[currentVideo] && (
          <>
            <h2>{middleContent[currentVideo].title}</h2>
            <p>{middleContent[currentVideo].text.join(" ")}</p>
          </>
        )}
      </div>

      {/* Radio Buttons */}
      <div className="video-dots">
        {Object.keys(middleContent).map((key, index) => (
          <span
            key={index}
            className={`dot ${currentVideo === index ? "active" : ""}`}
            onClick={() => setCurrentVideo(index)}
          ></span>
        ))}
      </div>

      {/* Right Section (Login Form) */}
      <form onSubmit={handleLogin}>
        <div
          className={`right-panel 
            ${error ? "error" : ""} 
            ${success ? "success-panel" : ""}`}
        >
          <div className="logo-container">
            <img src="/punecm.jpg" alt="Logo" />
          </div>
          <h2>G-TAMB</h2>
          <p className="placeholder-text">Pune Municipal Corporation, India</p>

          {/* Username */}
          <div className="input-group">
            <span className="icon">👤</span>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="input-group">
            <span
              className="icon"
              onClick={() => setShowPassword(!showPassword)}
              style={{ cursor: "pointer" }}
            >
              {showPassword ? "🔓" : "👁"}
            </span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Captcha */}
          <div className="input-group captcha-box">
            <span className="captcha-text">
              {captcha.num1} + {captcha.num2}
            </span>
            <button className="refresh-btn" onClick={refreshCaptcha}>
              ↻
            </button>
          </div>

          <div className="input-group">
            <input
              type="number"
              placeholder="Enter CAPTCHA"
              value={inputCaptcha}
              onChange={(e) => {
                const val = e.target.value;
                if (/^\d*$/.test(val)) {
                  setInputCaptcha(val);
                }
              }}
              required
            />
          </div>

          {/* Error or Success */}
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          {/* Button */}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "LOGIN"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
