"use client";

import {useRouter} from "next/router";
import {MouseEvent, useEffect} from "react";
import {v4 as uuidv4} from "uuid";
import {useGetRooms} from "../../../utils/api";

function Landing() {
  const router = useRouter();

  const {data: rooms} = useGetRooms();

  const onRouter = (event: MouseEvent<HTMLButtonElement>) => {
    router.push(`/media/${event.currentTarget.value}`);
  };

  useEffect(() => {
    console.log("rooms : ", rooms);
  }, []);

  return (
    <div>
      {rooms?.map((item: any) => (
        <div key={uuidv4()}>
          <button value={item.roomName} onClick={onRouter}>
            {item.roomName}
          </button>
        </div>
      ))}
    </div>
  );
}

export default Landing;
