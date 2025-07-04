import React, { useState, useEffect, Suspense, lazy } from "react";
import axios from "axios";
import Cookies from "universal-cookie";

// Lazy load large modules
const LandingPg = lazy(() => import("../pages/LandingPg"));
const Homepage = lazy(() => import("./Homepage"));
const AboutUs = lazy(() => import("../pages/AboutUs"));
const WithoutLogin = lazy(() => import("../Routing/WithoutLogin"));
const ChatBot = lazy(() => import("../ChatbotComponents/chatbot"));
const WithLoginStudent = lazy(() => import("../Routing/WithLoginStudent"));
const WithLoginOrganization = lazy(() => import("../Routing/WithLoginOrganization"));
const ResumeBuilder = lazy(() => import("../ResumeBuilder/ResumeBuilder"));

export default function Home2() {
  const [Display, setDisplay] = useState("home");
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState("");
  const [OrganizationLog, setOrganizationLog] = useState(false);
  const [candidateLog, setCandidateLog] = useState(false);
  const [isLogged, setIsLoggedIn] = useState(false);
  const [refresher, setRefresher] = useState(true);
  const [signup, setSignup] = useState(false);
  const [UserDataData, setUserDataData] = useState({});
  const BASEURL = process.env.REACT_APP_SAMPLE;
  const cookies = new Cookies();

  // Fetch org user data after login
  useEffect(() => {
    async function fetchOrgUserData() {
      if (OrganizationLog && isLogged) {
        try {
          const token = cookies.get("SmartToken");
          if (!token) return;
          const res = await axios.post(
            `${BASEURL}/FindUser`,
            {},
            { headers: { Authorization: token } }
          );
          if (res.data && res.data.GotUser) {
            setUserDataData(res.data.GotUser);
          }
        } catch (err) {
          setUserDataData({});
        }
      }
    }
    fetchOrgUserData();
    // eslint-disable-next-line
  }, [OrganizationLog, isLogged]);

  return (
    <div>
      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <Homepage />
          {Display === "home" ? (
            <LandingPg setDisplay={setDisplay} />
          ) : Display === "about" ? (
            <AboutUs setDisplay={setDisplay} />
          ) : Display === "chatbot" ? (
            <ChatBot setDisplay={setDisplay} />
          ) : Display === "resumebuilder" ? (
            <ResumeBuilder setDisplay={setDisplay} />
          ) : Display === "interview" ? (
            isLogged ? (
              OrganizationLog ? (
                <WithLoginOrganization
                  OrganizationLog={OrganizationLog}
                  setOrganizationLog={setOrganizationLog}
                  candidateLog={candidateLog}
                  setCandidateLog={setCandidateLog}
                  setSignup={setSignup}
                  UserDataData={UserDataData}
                />
              ) : (
                <WithLoginStudent
                  OrganizationLog={OrganizationLog}
                  setOrganizationLog={setOrganizationLog}
                  candidateLog={candidateLog}
                  setCandidateLog={setCandidateLog}
                  refresher={refresher}
                  setRefresher={setRefresher}
                />
              )
            ) : (
              <WithoutLogin
                setDisplay={setDisplay}
                show={show}
                setShow={setShow}
                OrganizationLog={OrganizationLog}
                setOrganizationLog={setOrganizationLog}
                candidateLog={candidateLog}
                setCandidateLog={setCandidateLog}
                isLogged={isLogged}
                setIsLoggedIn={setIsLoggedIn}
                refresher={refresher}
                setRefresher={setRefresher}
                setStatus={setStatus}
                status={status}
                setSignup={setSignup}
                signup={signup}
              />
            )
          ) : (
            <></>
          )}
        </Suspense>
      </div>
    </div>
  );
}
