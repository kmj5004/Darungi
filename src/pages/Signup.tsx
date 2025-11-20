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

  // Firebase 에러 메시지 한국어 변환
  const getErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case "auth/email-already-in-use":
        return "이미 사용 중인 이메일입니다.";
      case "auth/invalid-email":
        return "유효하지 않은 이메일 형식입니다.";
      case "auth/operation-not-allowed":
        return "이메일/비밀번호 계정이 비활성화되었습니다.";
      case "auth/weak-password":
        return "비밀번호는 최소 6자 이상이어야 합니다.";
      case "auth/network-request-failed":
        return "네트워크 연결에 실패했습니다.";
      case "auth/too-many-requests":
        return "너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.";
      case "auth/user-disabled":
        return "비활성화된 계정입니다.";
      default:
        return "회원가입에 실패했습니다. 다시 시도해주세요.";
    }
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
        try {
          photoURL = await uploadToCloudinary(profileImage);
        } catch (uploadError) {
          console.error("이미지 업로드 실패:", uploadError);
          setError(
            "이미지 업로드에 실패했습니다. 프로필 이미지 없이 계속 진행합니다."
          );
        }
      }

      // 3. Firebase 프로필 업데이트
      await updateProfile(user, {
        displayName: nickname,
        photoURL,
      });

      alert("회원가입 완료!");
      navigate("/");
    } catch (err: any) {
      const errorMessage = getErrorMessage(err.code);
      setError(errorMessage);
      console.error("회원가입 실패:", err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-2xl">
        <h1 className="mb-8 text-2xl font-bold text-center text-gray-800">
          회원가입
        </h1>

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          {/* 프로필 이미지 선택 + 미리보기 */}
          <div className="flex flex-col items-center mb-2">
            <label className="relative cursor-pointer">
              <div className="flex items-center justify-center overflow-hidden transition-colors bg-gray-100 border-2 border-gray-300 border-dashed rounded-full w-28 h-28 hover:border-blue-500">
                {profileImage ? (
                  <img
                    src={URL.createObjectURL(profileImage)}
                    alt="profile preview"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <AiOutlinePlus size={24} />
                    <span className="mt-1 text-xs text-center">
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
                  className="absolute p-1 text-white bg-blue-600 rounded-full -top-2 -right-2 hover:bg-blue-700"
                >
                  <AiOutlineClose size={14} />
                </button>
              )}
            </label>
          </div>

          {/* 이메일 / 비밀번호 / 닉네임 입력 필드 */}
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="password"
            placeholder="비밀번호 확인"
            value={passwordCheck}
            onChange={(e) => setPasswordCheck(e.target.value)}
            required
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-sm mt-2"
          >
            회원가입
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

          <Link to="/login" className="block">
            <button
              type="button"
              className="w-full bg-white border-2 border-blue-200 text-blue-600 py-2.5 rounded-lg font-medium hover:bg-blue-50 transition-colors text-sm"
            >
              로그인하기
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Signup;
