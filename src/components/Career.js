import React, { useState } from "react";
import { dbService } from "fbase";

const Career = ({ careerObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(careerObj.title);

  const onDeleteClick = async () => {
    const ok = window.confirm("삭제?");
    if (ok) {
      //삭제
      console.log("삭제!");
      await dbService.doc(`career/${careerObj.id}`).delete();
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

  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.doc(`career/${careerObj.id}`).update({
      title: newTitle,
    });
    setEditing(false);
  };

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
            <input type="submit" value="Update Content" />
          </form>
          <button onClick={toggleEditing}>Cancel</button>
        </>
      ) : (
        <>
          <h4>{careerObj.title}</h4>
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
