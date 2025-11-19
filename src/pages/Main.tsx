import { Link } from "react-router-dom";

function Main() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          메인 페이지
        </h1>
        
        <nav className="flex flex-col gap-4">
          <Link to="/login">
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium 
                       hover:bg-blue-700 transition-colors">
              로그인
            </button>
          </Link>
          <Link to="/mypage">
            <button className="w-full bg-green-600 text-white py-3 rounded-lg font-medium 
                       hover:bg-green-700 transition-colors">
              마이페이지
            </button>
          </Link>
        </nav>
      </div>
    </div>
  );
}

export default Main;
