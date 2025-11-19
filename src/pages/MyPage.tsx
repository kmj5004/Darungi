import { Link } from "react-router-dom";

function MyPage() {
  return (
    <div>
      <h1>마이페이지</h1>
      <p>사용자 정보가 여기에 표시됩니다.</p>
      <Link to="/">
        <button>메인으로</button>
      </Link>
    </div>
  );
}

export default MyPage;
