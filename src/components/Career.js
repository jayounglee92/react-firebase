import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "fbase";

const Career = ({ careerObj, isOwner, userObj }) => {
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(careerObj.title);
  const [newAttachment, setNewAttachment] = useState(careerObj.attachmentUrl);

  const onDeleteClick = async () => {
    const ok = window.confirm("삭제?");
    if (ok) {
      //삭제
      console.log("삭제!");
      await dbService.doc(`career/${careerObj.id}`).delete();
      await storageService.refFromURL(careerObj.attachmentUrl).delete();
    } else {
      // 안삭제
      console.log("안삭제!");
    }
  };

  const toggleEditing = () => {
    setEditing((prev) => !prev);
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewTitle(value);
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
      setNewAttachment(result);
    };

    if (theFile) {
      reader.readAsDataURL(theFile);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    let newAttachmentUrl = "";

    if (newAttachment === null) {
      window.alert("이미지 업로드는 필수입니다.");
    }

    if (newAttachment !== "") {
      const fileRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
      const response = await fileRef.putString(newAttachment, "data_url");
      newAttachmentUrl = await response.ref.getDownloadURL();
    }

    await dbService.doc(`career/${careerObj.id}`).update({
      title: newTitle,
      attachmentUrl: newAttachmentUrl,
    });

    setEditing(false);
  };
  const onClearAttachment = () => setNewAttachment(null);
  return (
    <div>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              value={newTitle}
              placeholder="Edit your content"
              onChange={onChange}
              required
            />
            <input
              type="file"
              accept="image/*"
              onChange={onFileChanage}
              required
            />
            <input type="submit" value="Update Content" />
            {newAttachment && (
              <div>
                <img src={newAttachment} width="200px" height="100px" alt="" />
                <button onClick={onClearAttachment}>Cancel upload</button>
              </div>
            )}
          </form>
          <button onClick={toggleEditing}>Cancel</button>
        </>
      ) : (
        <>
          <h4>{careerObj.title}</h4>
          {careerObj.attachmentUrl && (
            <img
              src={careerObj.attachmentUrl}
              width="200px"
              height="100px"
              alt=""
            />
          )}
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Delete</button>
              <button onClick={toggleEditing}>Edit</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Career;
