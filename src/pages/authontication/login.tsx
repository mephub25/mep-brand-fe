import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom"; // for navigation

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const LoginOverlay = ({ isOpen, onClose }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(isOpen);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      gsap.fromTo(
        ".login-overlay",
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" }
      );
    } else {
      gsap.to(".login-overlay", {
        opacity: 0,
        scale: 0.95,
        duration: 0.2,
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
        body: JSON.stringify({ username: email, password }), // backend uses "username" field
      });

      const data = await res.json();
        console.log("LOGIN RESPONSE:", data);

      if (!res.ok) throw new Error(data.message || "Login failed");

      // Save token and role in sessionStorage
      sessionStorage.setItem("token", data.data.token);
      sessionStorage.setItem("role", data.data.role);

      // Redirect to admin dashboard if role is admin
      if (data.data.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/"); // fallback if other roles exist
      }

      onClose(); // close the overlay
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[2000] bg-gray/10 backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="login-overlay relative bg-white rounded-xl shadow-lg w-full max-w-md p-8 mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <IoClose size={24} />
        </button>

        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address.."
              className="border bg-white border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password.."
              className="border bg-white border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`bg-secondary text-white py-2 rounded-md mt-2 hover:bg-secondary/90 transition-colors ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginOverlay;
