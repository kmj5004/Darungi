import { Link } from "react-router-dom";

function Signup() {
  return (
    <div>
      <h1>회원가입 페이지</h1>
      <form>
        <input type="email" placeholder="이메일" />
        <input type="password" placeholder="비밀번호" />
        <input type="password" placeholder="비밀번호 확인" />
        <button type="submit">회원가입</button>
      </form>
      <Link to="/login">
        <button>로그인으로</button>
      </Link>
    </div>
  );
}

export default Signup;
