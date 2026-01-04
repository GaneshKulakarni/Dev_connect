import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Github, Mail, Lock, Loader2, Code2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { signInWithGithub, signInWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signInWithEmail(email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 bg-slate-950">
      <div className="w-full max-w-md">
        <div className="bg-slate-900/50 border border-cyan-900/30 rounded-2xl p-8 backdrop-blur-sm shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-4 border border-cyan-500/20">
              <Code2 className="w-7 h-7 text-cyan-400" />
            </div>
            <h1 className="text-2xl font-bold text-white font-mono">Welcome to DevConnect</h1>
            <p className="text-gray-400 text-sm mt-2 font-mono">Authentication Required</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm font-mono">
              {error}
            </div>
          )}

          <button
            onClick={signInWithGithub}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-black font-semibold py-3 px-4 rounded-lg transition duration-200 mb-6"
          >
            <Github className="w-5 h-5" />
            Continue with GitHub
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-cyan-900/30"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-2 text-gray-500 font-mono">Or use credentials</span>
            </div>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-mono text-gray-400 mb-1">GitHub Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="dev@github.com"
                  className="w-full bg-slate-950 border border-cyan-900/30 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50 font-mono text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-mono text-gray-400 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-cyan-900/30 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50 font-mono text-sm"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-800 text-white font-bold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2 mt-4"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-gray-500 font-mono">
            Secure connection via Supabase Auth
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
