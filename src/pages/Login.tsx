import { Link } from "react-router-dom";

function Login() {
  return (
    <div>
      <h1>로그인 페이지</h1>
      <form>
        <input type="email" placeholder="이메일" />
        <input type="password" placeholder="비밀번호" />
        <button type="submit">로그인</button>
      </form>
      <Link to="/signup">
        <button>회원가입</button>
      </Link>
      <Link to="/">
        <button>메인으로</button>
      </Link>
    </div>
  );
}

export default Login;
