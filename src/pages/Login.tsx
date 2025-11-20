import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSignIn = async () => {
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("로그인 성공:", userCredential.user);
      alert("로그인 완료!");
      navigate("/");
    } catch (err: any) {
      setError(err.message);
      console.error("로그인 실패:", err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-2xl">
        <h2 className="mb-8 text-2xl font-bold text-center text-gray-800">
          로그인
        </h2>

        <div className="flex flex-col gap-4">
          <input
            type="email"
            value={email}
            placeholder="이메일"
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <input
            type="password"
            value={password}
            placeholder="비밀번호"
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <button
            onClick={handleSignIn}
            className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold 
                       hover:bg-blue-700 transition-colors shadow-sm mt-2"
          >
            로그인
          </button>

          {error && (
            <p className="mt-2 text-sm text-center text-red-500">{error}</p>
          )}

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 text-gray-400 bg-white">또는</span>
            </div>
          </div>

          <Link to="/signup" className="block">
            <button className="w-full bg-white border-2 border-blue-200 text-blue-600 py-2.5 rounded-lg font-medium hover:bg-blue-50 transition-colors text-sm">
              회원가입 하기
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
