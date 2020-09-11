import React, { useEffect, useState } from "react";
import { authService, dbService } from "fbase";
import { useHistory } from "react-router-dom";

export default ({ userObj, refreshUser }) => {
  const [newDisplayName, setNewDisplayName] = useState();

  const history = useHistory();
  const onLogoutClick = () => {
    authService.signOut();
    history.push("/");
  };
  const getMyCareer = async () => {
    await dbService
      .collection("career")
      .where("creatorId", "==", userObj.uid)
      .orderBy("createdAt")
      .get();
    //console.log(careers.docs.map((doc) => doc.data()));
  };

  useEffect(() => {
    getMyCareer();
  });

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await userObj.updateProfile({
        displayName: newDisplayName,
      });
      refreshUser();
    }
  };
  return (
    <>
      <form onSubmit={onSubmit}>
        <input type="text" placeholder="Display name" onChange={onChange} />
        <input type="submit" value="Update Profile" />
      </form>
      <button onClick={onLogoutClick}>Log Out</button>
    </>
  );
};
