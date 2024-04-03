"use client";

import {useRouter} from "next/router";
import {MouseEvent} from "react";
import {useRecoilState, useRecoilValue} from "recoil";
import {useAddRoom} from "../../../utils/api";
import {roomsState, userInfoState} from "../../../utils/atom";

function CreateMedia() {
  const router = useRouter();
  const [rooms, setRooms] = useRecoilState(roomsState);
  const userInfo = useRecoilValue(userInfoState);

  const {mutateAsync: addRoom} = useAddRoom();

  const onCreateMedia = (event: MouseEvent<HTMLButtonElement>) => {
    const value = event.currentTarget.value;
    if (confirm("방을 만드시겠습니까?")) {
      addRoom({roomName: value, roomId: userInfo?.userId!});
      router.push(`/media/${value}`);
    }
  };

  setTimeout(() => {
    console.log("rooms : ", rooms);
  }, 300);

  return (
    <div>
      {/* <button value={userInfo?.userName} onClick={onCreateMedia}>
        방 만들기
      </button> */}
    </div>
  );
}

export default CreateMedia;
