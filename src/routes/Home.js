import React, { useState, useEffect } from "react";
import { dbService } from "fbase";
import Career from "components/Career";

const Home = ({ userObj }) => {
  const [title, setTitle] = useState("");
  const [list, setList] = useState([]);

  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.collection("career").add({
      title,
      createdAt: Date.now(),
      createrId: userObj.uid,
    });
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setTitle(value);
  };

  useEffect(() => {
    dbService.collection("career").onSnapshot((snapshot) => {
      const careerArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setList(careerArray);
    });
  }, []);
  console.log(list);
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={title}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="submit" value="title" />
      </form>
      <div>
        {list.map((career) => (
          <Career
            key={list.id}
            careerObj={career}
            isOwner={career.createrId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
