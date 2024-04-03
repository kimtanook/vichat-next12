import Image from "next/image";
import {FormEvent, useEffect, useState} from "react";
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

  const [image, setImage] = useState();

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

  return (
    <ChatWrap>
      <ChatList>
        {chatList.map((item: string, index: number) => (
          <div key={index}>
            {dataUrlRegex.test(item) ? (
              <Image src={item} alt="channel-image" />
            ) : (
              <div key={index}>{item}</div>
            )}
          </div>
        ))}
      </ChatList>
      <SubmitWrap>
        <form onSubmit={onSubmitChat}>
          <input value={message} onChange={(e) => setMessage(e.target.value)} />
        </form>
        <label htmlFor="fileInput">
          <input
            id="fileInput"
            type="file"
            onChange={handleImageChange}
            hidden
          />
          <Image src={imageUploadIcon} alt="image-upload-ocon" />
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

const ChatList = styled.div`
  height: 100%;
  padding: 0.5rem;
  border: 1px solid red;
`;

const SubmitWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0 0.2rem;
`;
