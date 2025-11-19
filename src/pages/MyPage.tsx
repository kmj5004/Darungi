import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { signOut, type User } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

function MyPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-gray-600">로딩중...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          마이페이지
        </h2>

        <div className="flex flex-col gap-4">
          {/* 프로필 이미지 */}
          <div className="flex justify-center mb-4">
            <img
              src={user?.photoURL || defaultProfileImage}
              alt="프로필 이미지"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
              onError={(e) => {
                (e.target as HTMLImageElement).src = defaultProfileImage;
              }}
            />
          </div>

          {/* 닉네임 */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">닉네임</p>
            <p className="text-gray-800 font-medium">
              {user?.displayName || "닉네임 없음"}
            </p>
          </div>

          {/* 이메일 */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">이메일</p>
            <p className="text-gray-800 font-medium break-all">
              {user?.email || "정보 없음"}
            </p>
          </div>

          {/* 가입일 */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">가입일</p>
            <p className="text-gray-800">
              {user?.metadata.creationTime
                ? new Date(user.metadata.creationTime).toLocaleDateString(
                    "ko-KR"
                  )
                : "정보 없음"}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-medium 
                       hover:bg-red-700 transition-colors mt-2"
          >
            로그아웃
          </button>

          <Link to="/">
            <button
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium 
                         hover:bg-blue-700 transition-colors"
            >
              메인으로
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MyPage;
