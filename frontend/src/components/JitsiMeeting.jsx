import React, { useEffect, useState, useRef } from "react";
import { JaaSMeeting } from "@jitsi/react-sdk";
import axios from "../api/axiosConfig";


function MeetingContainer({ room }) {
  const [meetingInfo, setMeetingInfo] = useState(null);
  
  useEffect(() => {
    axios.get(`/api/jaas/generate-token/${room}`)
    .then((res) => {
      console.log("Received from server:", res.data); 
      setMeetingInfo(res.data); 
    })
    .catch((err) => {
      console.log(err);
    });
  }, [room]);


  return (
    <>
      <JaaSMeeting
        appId="vpaas-magic-cookie-6e12f9b6248a463285d5cfa8e75dc35a"
        roomName={room}
        configOverwrite={{
          startWithAudioMuted: true,
          startWithVideoMuted: true,
          fileRecordingsEnabled: true,
        }}
        interfaceConfigOverwrite={{
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
        }}
        getIFrameRef={(node) => {
          node.style.height = "100vh";
          node.style.width = "100%";
        }}
      />
    </>
  );
}

export default MeetingContainer;