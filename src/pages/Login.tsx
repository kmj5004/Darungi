import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { BiChevronDown } from "react-icons/bi";
import { t, getCurrentLanguage, setLanguage, type Language } from "../i18n";

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

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  // Firebase 에러 메시지 번역
  const getErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case "auth/invalid-email":
        return t("errors.invalidEmail", lang);
      case "auth/user-not-found":
        return t("errors.userNotFound", lang);
      case "auth/wrong-password":
        return t("errors.wrongPassword", lang);
      case "auth/invalid-credential":
        return t("errors.invalidCredential", lang);
      case "auth/too-many-requests":
        return t("errors.tooManyRequests", lang);
      case "auth/network-request-failed":
        return t("errors.networkError", lang);
      default:
        return t("errors.loginFailed", lang);
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
      alert(t("loginSuccess", lang));
      navigate("/");
    } catch (err: any) {
      const errorMessage = getErrorMessage(err.code);
      setError(errorMessage);
      console.error("로그인 실패:", err);
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
        <h2 className="mb-8 text-2xl font-bold text-center text-gray-800">
          {t("login", lang)}
        </h2>

        <div className="flex flex-col gap-4">
          <input
            type="email"
            value={email}
            placeholder={t("email", lang)}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <input
            type="password"
            value={password}
            placeholder={t("password", lang)}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <button
            onClick={handleSignIn}
            className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold 
                       hover:bg-blue-700 transition-colors shadow-sm mt-2"
          >
            {t("loginButton", lang)}
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

          <Link to="/signup" className="block">
            <button className="w-full bg-white border-2 border-blue-200 text-blue-600 py-2.5 rounded-lg font-medium hover:bg-blue-50 transition-colors text-sm">
              {t("goToSignup", lang)}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
