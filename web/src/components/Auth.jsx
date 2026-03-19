import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function Auth({ onAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMsg, setResetMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else {
        // Save name to user profile (public.users table or user_metadata)
        if (data.user) {
          await supabase.auth.updateUser({ data: { name } });
        }
        onAuth();
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else onAuth();
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setResetMsg("");
    setError("");
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail);
    if (error) setError(error.message);
    else setResetMsg("Password reset email sent! Check your inbox.");
  };

  const handleOAuth = async (provider) => {
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) setError(error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0B0B] px-4 sm:px-4">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg bg-[#18181b] rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col items-center mx-auto">
        {/* App Icon */}
        <div className="mb-6">
          <img
            src="./src/assets/logo.svg"
            alt="App Icon"
            className="w-16 h-16 rounded-xl mx-auto"
          />
        </div>
        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 text-center">
          {isSignUp ? "Create Account" : showForgot ? "Reset Password" : "Welcome Back"}
        </h2>
        <p className="text-[#a1a1aa] mb-6 text-center text-sm sm:text-base">
          {showForgot ? (
            <>
              Enter your email to reset your password.
              <br />
              <span
                className="text-white underline cursor-pointer"
                onClick={() => { setShowForgot(false); setResetMsg(""); setError(""); }}
              >
                Back to Login
              </span>
            </>
          ) : isSignUp ? (
            <>
              Already have an account?{" "}
              <span
                className="text-white underline cursor-pointer"
                onClick={() => setIsSignUp(false)}
              >
                Login
              </span>
            </>
          ) : (
            <>
              Don’t have an account yet?{" "}
              <span
                className="text-white underline cursor-pointer"
                onClick={() => setIsSignUp(true)}
              >
                Sign up
              </span>
            </>
          )}
        </p>
        {/* Forgot Password Form */}
        {showForgot ? (
          <form onSubmit={handleForgotPassword} className="w-full flex flex-col gap-4">
            <input
              className="w-full p-3 rounded-lg bg-[#232329] text-white border border-transparent focus:border-[#4300FF] focus:outline-none text-base sm:text-lg"
              type="email"
              placeholder="Email address"
              value={resetEmail}
              onChange={e => setResetEmail(e.target.value)}
              required
            />
            <button
              className="w-full bg-[#4300FF] hover:bg-[#4D55CC] text-white font-bold py-3 px-4 rounded-lg transition text-base sm:text-lg"
              type="submit"
            >
              Send Reset Email
            </button>
            {resetMsg && <div className="text-green-500 text-sm mt-2">{resetMsg}</div>}
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          </form>
        ) : (
        <>
        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          {isSignUp && (
            <input
              className="w-full p-3 rounded-lg bg-[#232329] text-white border border-transparent focus:border-[#4300FF] focus:outline-none text-base sm:text-lg"
              type="text"
              placeholder="Name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          )}
          <input
            className="w-full p-3 rounded-lg bg-[#232329] text-white border border-transparent focus:border-[#4300FF] focus:outline-none text-base sm:text-lg"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            className="w-full p-3 rounded-lg bg-[#232329] text-white border border-transparent focus:border-[#4300FF] focus:outline-none text-base sm:text-lg"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <div className="flex justify-between items-center">
            {!isSignUp && (
              <span
                className="text-[#a1a1aa] text-xs sm:text-sm underline cursor-pointer hover:text-white"
                onClick={() => { setShowForgot(true); setResetMsg(""); setError(""); }}
              >
                Forgot Password?
              </span>
            )}
            <span></span>
          </div>
          <button
            className="w-full bg-[#5D43FF] hover:bg-[#6E57FF] text-white font-bold py-3 px-4 rounded-lg transition text-base sm:text-lg"
            type="submit"
          >
            {isSignUp ? "Sign Up" : "Login"}
          </button>
        </form>
        {/* Divider */}
        <div className="flex items-center w-full my-6">
          <div className="flex-grow h-px bg-[#232329]" />
          <span className="mx-3 text-[#a1a1aa] text-sm sm:text-base">OR</span>
          <div className="flex-grow h-px bg-[#232329]" />
        </div>
        {/* OAuth Buttons */}
        <div className="flex w-full gap-4 flex-col sm:flex-row">
          <button
            className="flex-1 flex items-center justify-center gap-2 bg-[#232329] hover:bg-[#22223b] text-white py-3 rounded-lg transition mb-2 sm:mb-0"
            onClick={() => handleOAuth("google")}
            type="button"
          >
            <svg className="w-5 h-5" viewBox="0 0 48 48">
              <g>
                <path fill="#4285F4" d="M24 9.5c3.54 0 6.49 1.22 8.92 3.23l6.66-6.66C35.64 2.7 30.23 0 24 0 14.82 0 6.91 5.8 2.69 14.09l7.77 6.04C12.13 13.13 17.61 9.5 24 9.5z"/>
                <path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.43-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.66 7.01l7.18 5.59C43.99 37.13 46.1 31.36 46.1 24.55z"/>
                <path fill="#FBBC05" d="M10.46 28.13a14.5 14.5 0 0 1 0-8.26l-7.77-6.04A23.97 23.97 0 0 0 0 24c0 3.77.9 7.34 2.69 10.91l7.77-6.04z"/>
                <path fill="#EA4335" d="M24 48c6.23 0 11.46-2.06 15.28-5.6l-7.18-5.59c-2 1.34-4.56 2.13-8.1 2.13-6.39 0-11.87-3.63-14.54-8.91l-7.77 6.04C6.91 42.2 14.82 48 24 48z"/>
                <path fill="none" d="M0 0h48v48H0z"/>
              </g>
            </svg>
          </button>
          <button
            className="flex-1 flex items-center justify-center gap-2 bg-[#232329] hover:bg-[#22223b] text-white py-3 rounded-lg transition"
            onClick={() => handleOAuth("github")}
            type="button"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
              <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.75.41-1.27.74-1.56-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 2.9-.39c.98.01 1.97.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.41-5.27 5.7.42.36.79 1.08.79 2.18 0 1.58-.01 2.85-.01 3.24 0 .31.21.68.8.56C20.71 21.39 24 17.08 24 12c0-6.27-5.23-11.5-12-11.5z"/>
            </svg>
          </button>
        </div>
        {error && <div className="text-red-500 text-sm mt-4">{error}</div>}
        </>
        )}
      </div>
    </div>
  );
}
