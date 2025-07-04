import InterviewShow from "./InterviewShow";
import React, { useState } from "react";

const SwitchInterviewWindow = ({ UserDataData, ItrId, setItrId, onInterviewStart }) => {
  //Swithcing
  return (
    <>
      <InterviewShow
        setItrId={setItrId}
        UserDataData={UserDataData}
        ItrId={ItrId}
        onInterviewStart={onInterviewStart}
      />
    </>
  );
};
export default SwitchInterviewWindow;
