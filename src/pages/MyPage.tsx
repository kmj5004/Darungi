import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { signOut, deleteUser, type User } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

function MyPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  const defaultProfileImage = "/default-profile.svg";

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
      alert("로그아웃 완료!");
      navigate("/login");
    } catch (err: any) {
      console.error("로그아웃 실패:", err);
      alert("로그아웃 실패: " + err.message);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    try {
      await deleteUser(user);
      console.log("회원 탈퇴 성공");
      alert("회원 탈퇴가 완료되었습니다.");
      navigate("/signup");
    } catch (err: any) {
      console.error("회원 탈퇴 실패:", err);

      if (err.code === "auth/requires-recent-login") {
        alert("보안을 위해 다시 로그인한 후 탈퇴해주세요.");
        navigate("/login");
      } else {
        alert("회원 탈퇴 실패: " + err.message);
      }
    }

    setShowDeleteModal(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-gray-600">로딩중...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-2xl">
        <h2 className="mb-8 text-2xl font-bold text-center text-gray-800">
          마이페이지
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
            <p className="mb-1 text-xs text-gray-500">닉네임</p>
            <p className="text-lg font-bold text-gray-800">
              {user?.displayName || "닉네임 없음"}
            </p>
          </div>
          <div className="pb-4 border-b border-blue-200">
            <p className="mb-1 text-xs text-gray-500">이메일</p>
            <p className="text-base font-medium text-gray-700">{user?.email}</p>
          </div>
          <div className="pt-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">가입일</span>
              <span className="text-xs text-gray-600">
                {user?.metadata.creationTime
                  ? new Date(user.metadata.creationTime).toLocaleDateString(
                      "ko-KR"
                    )
                  : "정보 없음"}
              </span>
            </div>
          </div>
        </div>

        {/* 메인 버튼 */}
        <Link to="/" className="block mb-3">
          <button className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-sm">
            메인으로 돌아가기
          </button>
        </Link>

        {/* 구분선 */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 text-gray-400 bg-white">계정 관리</span>
          </div>
        </div>

        {/* 서브 버튼들 */}
        <div className="space-y-2">
          <button
            onClick={handleLogout}
            className="w-full bg-white border-2 border-blue-200 text-blue-600 py-2.5 rounded-lg font-medium hover:bg-blue-50 transition-colors text-sm"
          >
            로그아웃
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full py-2 text-sm font-medium text-gray-400 transition-colors hover:text-gray-600"
          >
            회원 탈퇴
          </button>
        </div>
      </div>

      {/* 회원 탈퇴 확인 모달 */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-sm p-6 bg-white shadow-xl rounded-2xl">
            <h3 className="mb-3 text-xl font-bold text-gray-800">회원 탈퇴</h3>
            <p className="mb-6 text-sm leading-relaxed text-gray-600">
              정말로 탈퇴하시겠습니까?
              <br />
              모든 데이터가 삭제되며 복구할 수 없습니다.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-white border-2 border-gray-200 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                탈퇴하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyPage;
