import { useState, useEffect } from "react";
import { IoClose, IoEye, IoEyeOff } from "react-icons/io5";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const LoginOverlay = ({ isOpen, onClose }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [visible, setVisible] = useState(isOpen);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      gsap.fromTo(
        ".login-overlay",
        { opacity: 0, scale: 0.95, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "power2.out" }
      );
      gsap.fromTo(
        ".login-content",
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, delay: 0.1, ease: "power2.out" }
      );
    } else {
      gsap.to(".login-overlay", {
        opacity: 0,
        scale: 0.95,
        y: 20,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => setVisible(false),
      });
    }
  }, [isOpen]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:3000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });

      const data = await res.json();
      console.log("LOGIN RESPONSE:", data);

      if (!res.ok) throw new Error(data.message || "Login failed");

      sessionStorage.setItem("token", data.data.token);
      sessionStorage.setItem("user", JSON.stringify(data.data.user));
      sessionStorage.setItem("role", data.data.user.role); // <-- REQUIRED

     if (data.data.user.role === "admin") {
     navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
   

      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[2000] bg-black/10 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="login-overlay relative w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background decoration */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-gray-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
        
        <div className="relative bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Close button */}
          <button
            className="absolute top-4 right-4 z-10 p-2 bg-white hover:bg-gray-200 rounded-full transition-all duration-200 text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <IoClose size={25} />
          </button>

          {/* Header section with gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-gray-600 px-8 py-6 text-white">
            <h2 className="text-2xl font-bold text-center">Welcome Back</h2>
            <p className="text-blue-100 text-center text-sm mt-1">
              Sign in to your admin account
            </p>
          </div>

          {/* Form section */}
          <div className="login-content px-8 py-8">
            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <form className="flex flex-col gap-6" onSubmit={handleLogin}>
              {/* Email field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white placeholder-gray-400"
                  required
                  disabled={loading}
                />
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password..."
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white placeholder-gray-400"
                    required
                    disabled={loading}
                  />
                  {/* Password visibility toggle */}
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    disabled={loading}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {showPassword ? (
                      <IoEyeOff size={18} className="text-gray-500" />
                    ) : (
                      <IoEye size={18} className="text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot password */}
              <div className="flex justify-end">
                <a 
                  href="#" 
                  className="text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200 font-medium"
                  onClick={(e) => e.preventDefault()}
                >
                  Forgot Password?
                </a>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
                  loading 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-gradient-to-r from-blue-600 to-gray-600 hover:from-blue-700 hover:to-gray-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Logging in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Footer note */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Secure admin access • Protected by encryption
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginOverlay;