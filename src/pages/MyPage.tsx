import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { signOut, deleteUser, type User } from "firebase/auth";
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

function MyPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [lang, setLang] = useState<Language>(getCurrentLanguage());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const defaultProfileImage = "/default-profile.svg";

  // 언어 변경
  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    setLanguage(newLang);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (!currentUser) {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("로그아웃 성공");
      alert(t("logoutSuccess", lang));
      navigate("/login");
    } catch (err: any) {
      console.error("로그아웃 실패:", err);
      alert(t("errors.logoutFailed", lang) + err.message);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    try {
      await deleteUser(user);
      console.log("회원 탈퇴 성공");
      alert(t("deleteSuccess", lang));
      navigate("/signup");
    } catch (err: any) {
      console.error("회원 탈퇴 실패:", err);

      if (err.code === "auth/requires-recent-login") {
        alert(t("errors.requiresRecentLogin", lang));
        navigate("/login");
      } else {
        alert(t("errors.generalError", lang));
      }
    }

    setShowDeleteModal(false);
  };

  const currentLanguage = languageOptions.find((opt) => opt.code === lang);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-gray-600">{t("loading", lang)}</div>
      </div>
    );
  }

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
          {t("mypage", lang)}
        </h2>

        {/* 프로필 섹션 */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={user?.photoURL || defaultProfileImage}
            alt="프로필 이미지"
            className="object-cover mb-5 border-4 border-blue-100 rounded-full w-28 h-28"
            onError={(e) => {
              (e.target as HTMLImageElement).src = defaultProfileImage;
            }}
          />
        </div>

        {/* 정보 카드 */}
        <div className="p-6 mb-6 space-y-4 bg-blue-50 rounded-xl">
          <div className="pb-4 border-b border-blue-200">
            <p className="mb-1 text-xs text-gray-500">{t("nickname", lang)}</p>
            <p className="text-lg font-bold text-gray-800">
              {user?.displayName || t("noNickname", lang)}
            </p>
          </div>
          <div className="pb-4 border-b border-blue-200">
            <p className="mb-1 text-xs text-gray-500">{t("email", lang)}</p>
            <p className="text-base font-medium text-gray-700">{user?.email}</p>
          </div>
          <div className="pt-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {t("joinDate", lang)}
              </span>
              <span className="text-xs text-gray-600">
                {user?.metadata.creationTime
                  ? new Date(user.metadata.creationTime).toLocaleDateString(
                      lang === "ko" || lang === "ko-KP"
                        ? "ko-KR"
                        : lang === "ja"
                        ? "ja-JP"
                        : lang === "zh-CN"
                        ? "zh-CN"
                        : lang === "zh-TW"
                        ? "zh-TW"
                        : lang === "es"
                        ? "es-ES"
                        : lang === "pt"
                        ? "pt-BR"
                        : lang === "ru"
                        ? "ru-RU"
                        : lang === "fr"
                        ? "fr-FR"
                        : lang === "de"
                        ? "de-DE"
                        : lang === "it"
                        ? "it-IT"
                        : lang === "vi"
                        ? "vi-VN"
                        : lang === "th"
                        ? "th-TH"
                        : lang === "ar"
                        ? "ar-SA"
                        : "en-US"
                    )
                  : t("noInfo", lang)}
              </span>
            </div>
          </div>
        </div>

        {/* 메인 버튼 */}
        <Link to="/" className="block mb-3">
          <button className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-sm">
            {t("backToMain", lang)}
          </button>
        </Link>

        {/* 구분선 */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 text-gray-400 bg-white">
              {t("accountManagement", lang)}
            </span>
          </div>
        </div>

        {/* 서브 버튼들 */}
        <div className="space-y-2">
          <button
            onClick={handleLogout}
            className="w-full bg-white border-2 border-blue-200 text-blue-600 py-2.5 rounded-lg font-medium hover:bg-blue-50 transition-colors text-sm"
          >
            {t("logout", lang)}
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full py-2 text-sm font-medium text-gray-400 transition-colors hover:text-gray-600"
          >
            {t("deleteAccount", lang)}
          </button>
        </div>
      </div>

      {/* 회원 탈퇴 확인 모달 */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-sm p-6 bg-white shadow-xl rounded-2xl">
            <h3 className="mb-3 text-xl font-bold text-gray-800">
              {t("deleteAccountTitle", lang)}
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-gray-600 whitespace-pre-line">
              {t("deleteAccountMessage", lang)}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-white border-2 border-gray-200 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                {t("cancel", lang)}
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                {t("confirmDelete", lang)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyPage;
