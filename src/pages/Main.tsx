import { Link } from "react-router-dom";

function Main() {
  return (
    <div>
      <h1>메인 페이지</h1>
      <nav>
        <Link to="/login">
          <button>로그인</button>
        </Link>
        <Link to="/mypage">
          <button>마이페이지</button>
        </Link>
      </nav>
    </div>
  );
}

export default Main;
