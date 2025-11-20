import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai";

// 환경변수 읽기
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [nickname, setNickname] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Cloudinary 업로드
  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", "profileImages");

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || "이미지 업로드 실패");
    return data.secure_url;
  };

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

      // 2. 프로필 이미지 업로드
      let photoURL = "";
      if (profileImage) {
        photoURL = await uploadToCloudinary(profileImage);
      }

      // 3. Firebase 프로필 업데이트
      await updateProfile(user, {
        displayName: nickname,
        photoURL,
      });

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
          {/* 이메일 / 비밀번호 / 닉네임 입력 필드 */}
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="password"
            placeholder="비밀번호 확인"
            value={passwordCheck}
            onChange={(e) => setPasswordCheck(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          {/* 프로필 이미지 선택 + 미리보기 */}
          <div className="flex flex-col items-center">
            <label className="cursor-pointer relative">
              <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-100 hover:border-blue-500 transition-colors">
                {profileImage ? (
                  <img
                    src={URL.createObjectURL(profileImage)}
                    alt="profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <AiOutlinePlus size={24} />
                    <span className="text-xs text-center mt-1">
                      프로필 이미지
                    </span>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
                className="hidden"
              />
              {profileImage && (
                <button
                  type="button"
                  onClick={() => setProfileImage(null)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <AiOutlineClose size={14} />
                </button>
              )}
            </label>
          </div>

          <button
            type="submit"
            className="cursor-pointer w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
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
