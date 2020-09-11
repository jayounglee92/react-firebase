import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "fbase";

const Factory = ({ userObj }) => {
  const [title, setTitle] = useState("");
  const [attachment, setAttachment] = useState("");

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setTitle(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    // 폴더명(=유저아이디)/이미지이름
    let attachmentUrl = "";

    if (attachment !== "") {
      const fileRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
      const response = await fileRef.putString(attachment, "data_url");
      attachmentUrl = await response.ref.getDownloadURL();
    }

    const career = {
      title: title,
      createdAt: Date.now(),
      createrId: userObj.uid,
      attachmentUrl,
    };
    await dbService.collection("career").add(career);
    setTitle("");
    setAttachment("");
  };

  const onFileChanage = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };

    if (theFile) {
      reader.readAsDataURL(theFile);
    }
  };

  const onClearAttachment = () => setAttachment(null);

  return (
    <form onSubmit={onSubmit}>
      <input
        value={title}
        onChange={onChange}
        type="text"
        placeholder="What's on your mind?"
        maxLength={120}
      />
      <input type="file" accept="image/*" onChange={onFileChanage} required />
      <input type="submit" value="submit" />
      {attachment && (
        <div>
          <img src={attachment} width="600px" height="400px" alt="" />
          <button onClick={onClearAttachment}>Cancel upload</button>
        </div>
      )}
    </form>
  );
};

export default Factory;
