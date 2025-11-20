import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate(); // 👈 추가됨

  const handleSignIn = async () => {
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("로그인 성공:", userCredential.user);

      // 👈 로그인 성공하면 "/"로 이동
      navigate("/");
      alert("로그인 완료!");
    } catch (err: any) {
      setError(err.message);
      console.error("로그인 실패:", err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          로그인
        </h2>

        <div className="flex flex-col gap-4">
          <input
            type="email"
            value={email}
            placeholder="이메일"
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none 
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <input
            type="password"
            value={password}
            placeholder="비밀번호"
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none 
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <button
            onClick={handleSignIn}
            className="cursor-pointer w-full bg-blue-600 text-white py-3 rounded-lg font-medium 
                       hover:bg-blue-700 transition-colors"
          >
            로그인
          </button>

          {error && (
            <p className="text-red-500 text-sm text-center mt-2">{error}</p>
          )}

          <div className="text-center mt-4">
            <Link to="/signup">
              <span className="text-blue-600 hover:underline text-sm">
                아직 회원이 아니신가요? 회원가입 하기
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
