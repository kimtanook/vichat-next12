"use client";

import {onAuthStateChanged} from "@firebase/auth";
import {useRouter} from "next/router";
import {ReactNode, useEffect} from "react";
import {QueryClient} from "react-query";
import {useRecoilState} from "recoil";
import {userInfoState} from "../../utils/atom";
import {authService} from "../../utils/firebase";

const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootProvider({children}: {children: ReactNode}) {
  const router = useRouter();
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);

  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if (user) {
        setUserInfo({
          userId: user.uid,
          userName: user.displayName || "",
          userEmail: user.email || "",
          userPhotoUrl: user.photoURL || "",
          userCreateTime: user.metadata.creationTime || "",
          userSignInTime: user.metadata.lastSignInTime || "",
        });
        if (router.pathname === "/") {
          router.replace("/home");
        }
      } else {
        router.replace("/");
        setUserInfo(null);
      }
    });
  }, []);
  return <>{children}</>;
}
