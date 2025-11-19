import { useState } from "react";
import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSignUp = async () => {
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("회원가입 성공:", userCredential.user);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        console.error("회원가입 실패:", err);
      }
    }
  };

  const handleSignIn = async () => {
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("로그인 성공:", userCredential.user);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        console.error("로그인 실패:", err);
      }
    }
  };

  return (
    <div>
      <h2>로그인 / 회원가입</h2>
      <input
        type="email"
        value={email}
        placeholder="이메일"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        placeholder="비밀번호"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignIn}>로그인</button>
      <button onClick={handleSignUp}>회원가입</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
export default Login;
