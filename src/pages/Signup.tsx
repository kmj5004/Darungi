import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai";
import { BiChevronDown } from "react-icons/bi";
import { t, getCurrentLanguage, setLanguage, type Language } from "../i18n";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// 모든 언어 옵션
const languageOptions = [
  { code: "ko" as Language, label: "한국어", flag: "🇰🇷" },
  { code: "en" as Language, label: "English", flag: "🇺🇸" },
  { code: "es" as Language, label: "Español", flag: "🇪🇸" },
  { code: "zh-CN" as Language, label: "简体中文", flag: "🇨🇳" },
  { code: "zh-TW" as Language, label: "繁體中文", flag: "🇹🇼" },
  { code: "ja" as Language, label: "日本語", flag: "🇯🇵" },
  { code: "pt" as Language, label: "Português", flag: "🇧🇷" },
  { code: "ru" as Language, label: "Русский", flag: "🇷🇺" },
  { code: "ko-KP" as Language, label: "조선말", flag: "🇰🇵" },
  { code: "fr" as Language, label: "Français", flag: "🇫🇷" },
  { code: "de" as Language, label: "Deutsch", flag: "🇩🇪" },
  { code: "it" as Language, label: "Italiano", flag: "🇮🇹" },
  { code: "vi" as Language, label: "Tiếng Việt", flag: "🇻🇳" },
  { code: "th" as Language, label: "ไทย", flag: "🇹🇭" },
  { code: "ar" as Language, label: "العربية", flag: "🇸🇦" },
];

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [nickname, setNickname] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [lang, setLang] = useState<Language>(getCurrentLanguage());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navigate = useNavigate();

  // 언어 변경
  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    setLanguage(newLang);
    setIsDropdownOpen(false);
  };

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
    if (!res.ok)
      throw new Error(
        data.error?.message || t("errors.imageUploadFailed", lang)
      );
    return data.secure_url;
  };

  const getErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case "auth/email-already-in-use":
        return t("errors.emailInUse", lang);
      case "auth/invalid-email":
        return t("errors.invalidEmail", lang);
      case "auth/weak-password":
        return t("errors.weakPassword", lang);
      case "auth/network-request-failed":
        return t("errors.networkError", lang);
      case "auth/too-many-requests":
        return t("errors.tooManyRequests", lang);
      default:
        return t("errors.signupFailed", lang);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== passwordCheck) {
      setError(t("errors.passwordMismatch", lang));
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      let photoURL = "";
      if (profileImage) {
        try {
          photoURL = await uploadToCloudinary(profileImage);
        } catch (uploadError) {
          console.error("이미지 업로드 실패:", uploadError);
          setError(t("errors.imageUploadFailed", lang));
        }
      }

      await updateProfile(user, {
        displayName: nickname,
        photoURL,
      });

      alert(t("signupSuccess", lang));
      navigate("/");
    } catch (err: any) {
      const errorMessage = getErrorMessage(err.code);
      setError(errorMessage);
      console.error("회원가입 실패:", err);
    }
  };

  const currentLanguage = languageOptions.find((opt) => opt.code === lang);

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      {/* 언어 드롭다운 */}
      <div className="fixed top-4 right-4">
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300"
          >
            <span className="text-xl">{currentLanguage?.flag}</span>
            <span>{currentLanguage?.label}</span>
            <BiChevronDown
              className={`transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsDropdownOpen(false)}
              />
              <div className="absolute right-0 z-20 w-48 mt-2 overflow-hidden overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg max-h-96">
                {languageOptions.map((option) => (
                  <button
                    key={option.code}
                    onClick={() => handleLanguageChange(option.code)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors ${
                      option.code === lang
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-xl">{option.flag}</span>
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-2xl">
        <h1 className="mb-8 text-2xl font-bold text-center text-gray-800">
          {t("signup", lang)}
        </h1>

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
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
                      {t("profileImage", lang)}
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

          <input
            type="email"
            placeholder={t("email", lang)}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="password"
            placeholder={t("password", lang)}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="password"
            placeholder={t("passwordConfirm", lang)}
            value={passwordCheck}
            onChange={(e) => setPasswordCheck(e.target.value)}
            required
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="text"
            placeholder={t("nickname", lang)}
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-sm mt-2"
          >
            {t("signupButton", lang)}
          </button>

          {error && (
            <p className="mt-2 text-sm text-center text-red-500">{error}</p>
          )}

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 text-gray-400 bg-white">
                {t("or", lang)}
              </span>
            </div>
          </div>

          <Link to="/login" className="block">
            <button
              type="button"
              className="w-full bg-white border-2 border-blue-200 text-blue-600 py-2.5 rounded-lg font-medium hover:bg-blue-50 transition-colors text-sm"
            >
              {t("goToLogin", lang)}
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Signup;
