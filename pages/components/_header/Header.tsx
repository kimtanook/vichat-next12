import {signOut} from "firebase/auth";
import Image from "next/image";
import {useRouter} from "next/router";
import {useRecoilValue} from "recoil";
import styled from "styled-components";
import signOutIcon from "../../../public/image/signout.svg";
import logo from "../../../public/logo.svg";
import {userInfoState} from "../../../utils/atom";
import {authService} from "../../../utils/firebase";

function Header() {
  const router = useRouter();
  const userInfo = useRecoilValue(userInfoState);

  const onClickSignOut = async () => {
    await signOut(authService);
    router.push("/");
    alert("Success Logout!");
  };

  return (
    <Wrap>
      <LogoBox>
        <Image onClick={() => router.push("/")} src={logo} alt="logo" />
      </LogoBox>
      <AuthBox>
        <p onClick={() => router.push(`/mypage/${userInfo?.userName}`)}>
          Hello, {userInfo?.userName}!
        </p>
        <LogoBox>
          <Image
            onClick={onClickSignOut}
            src={signOutIcon}
            alt="signOut-icon"
          />
        </LogoBox>
      </AuthBox>
    </Wrap>
  );
}

export default Header;

const Wrap = styled.section`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: var(--header-height);
  padding: 0 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid #e9e9e9;
`;

const LogoBox = styled.div`
  position: relative;
  display: flex;
  height: 100%;
  width: calc(var(--header-height) - 1rem);
`;
const AuthBox = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.51rem;
  height: 50%;
  & p {
    display: flex;
    align-items: center;
  }
  & input {
    width: 6rem;
  }

  & button {
    background-color: #1e1171;
    color: white;
    border-radius: 0.5rem;
  }
`;
