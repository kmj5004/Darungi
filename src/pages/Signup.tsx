import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [nickname, setNickname] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [error, setError] = useState("");

  const storage = getStorage();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== passwordCheck) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      // 1. 계정 생성
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // 2. 프로필 사진 업로드
      let photoURL = "";
      if (profileImage) {
        const imageRef = ref(storage, `profileImages/${user.uid}.jpg`);
        await uploadBytes(imageRef, profileImage);
        photoURL = await getDownloadURL(imageRef);
      }

      // 3. Firebase 프로필 업데이트
      await updateProfile(user, {
        displayName: nickname,
        photoURL: photoURL,
      });

      console.log("회원가입 성공:", user);
      navigate("/");
      alert("회원가입 완료!");
    } catch (err: any) {
      setError(err.message);
      console.error("회원가입 실패:", err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          회원가입
        </h1>

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none 
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none 
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <input
            type="password"
            placeholder="비밀번호 확인"
            value={passwordCheck}
            onChange={(e) => setPasswordCheck(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none 
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <input
            type="text"
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none 
             focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white cursor-pointer
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium 
                       hover:bg-blue-700 transition-colors"
          >
            회원가입
          </button>
        </form>

        {error && (
          <p className="text-red-500 text-sm text-center mt-4">{error}</p>
        )}

        <div className="text-center mt-6">
          <Link to="/login">
            <span className="text-blue-600 hover:underline text-sm">
              이미 계정이 있으신가요? 로그인하기
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
