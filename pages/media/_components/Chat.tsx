"use client";

import Image from "next/image";
import {FormEvent, useEffect, useRef, useState} from "react";
import {useRecoilValue} from "recoil";
import styled from "styled-components";
import imageUploadIcon from "../../../public/image/image-upload.svg";
import {userInfoState} from "../../../utils/atom";

function Chat({
  myDataChannel,
  chatList,
  setChatList,
  message,
  setMessage,
}: any) {
  const userInfo = useRecoilValue(userInfoState);
  const [image, setImage] = useState<File | undefined>(undefined);
  const chatListRef = useRef<any>();

  // 메세지 보내기
  const onSubmitChat = (e: FormEvent) => {
    e.preventDefault();
    if (myDataChannel.current) {
      setChatList((prev: any) => [
        ...prev,
        `${userInfo?.userName} : ${message}`,
      ]);
      myDataChannel.current?.send(`${userInfo?.userName} : ${message}`);
      setMessage("");
    }
  };

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    setImage(file);
  };

  // 이미지 보내기
  const sendImageOnExistingChannel = () => {
    if (!myDataChannel || !image) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataURL = event.target?.result;
      try {
        myDataChannel.current?.send(dataURL);
        setChatList((prev: any) => [...prev, `${dataURL}`]);
      } catch (error) {
        alert("사진용량이 너무 크거나 지원하지 않은 타입입니다.");
      }
    };
    reader.readAsDataURL(image);
    setImage(undefined);
  };

  const dataUrlRegex = /^data:image\/\w+;base64,/;

  useEffect(() => {
    sendImageOnExistingChannel();
  }, [image]);

  useEffect(() => {
    if (chatListRef.current) {
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
    }
  }, [chatList]);

  return (
    <ChatWrap>
      <ChatList ref={chatListRef}>
        {chatList?.map((item: string, index: number) => (
          <li key={index}>
            {dataUrlRegex.test(item) ? (
              <Image src={item} alt="channel-image" width={100} height={100} />
            ) : (
              <div key={index}>{item}</div>
            )}
          </li>
        ))}
      </ChatList>

      <SubmitWrap>
        <Form onSubmit={onSubmitChat}>
          <MsgInput
            value={message}
            onChange={(e: any) => setMessage(e.target.value)}
          />
        </Form>
        <label htmlFor="fileInput">
          <input
            id="fileInput"
            type="file"
            onChange={handleImageChange}
            hidden
          />
          <ImgBox>
            <Image
              src={imageUploadIcon}
              alt="image-upload-icon"
              width={24}
              height={24}
            />
          </ImgBox>
        </label>
      </SubmitWrap>
    </ChatWrap>
  );
}

export default Chat;

const ChatWrap = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid blue;
  flex: 1;
`;

const ChatList = styled.ul<{ref: any; children: any}>`
  height: 10rem;
  padding: 0.5rem;
  border: 1px solid red;
  overflow-y: scroll;
`;

const SubmitWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const Form = styled.form<{children: any; onSubmit: any}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
`;

const MsgInput = styled.input<{value: string; onChange: any}>`
  width: 100%;
`;

const ImgBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;
