import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import SidebarOrg from "../organization/Sidebar/SideNavBar";
import SidebarStudent from "../Student/Sidebar/SideNavBar";
import OrganizationProfile from "../organization/pages/OrganizationProfile";
import NewInterview from "../organization/NewInterview/NewInterview";
import AddStudent from "../organization/AddStudent/AddStudent";
import Results from "../organization/pages/ResultsList/Results";
import StudentProfilePage from "../Student/pages/StudentProfilePage";
import SwitchInterviewWindow from "../Student/SwitchInterviewWindow";
import axios from "axios";
import Cookies from "universal-cookie";
import InterviewList from "../Student/pages/InterviewList";
import Result from "../Student/pages/Result";
import AllResults from "../Student/pages/AllResults";
import ChatBot from "../ChatbotComponents/chatbot";
import ResumeBuilder from "../ResumeBuilder/ResumeBuilder";
import SearchCandidate from "../organization/pages/SearchCandidate";
import OrganizationCandidateResult from "../organization/pages/ResultsList/OrganizationCandidateResult";
import AllInterviews from "../organization/pages/AllInterviews";
import InterviewDetailsOrg from "../organization/pages/InterviewDetailsOrg";

const WithLogin = React.memo(function WithLogin({ status, setStatus, setIsLoggedIn }) {
  const [ItrId, setItrId] = useState(0);
  const [showNavbar, setShowNavbar] = useState(true);
  const [UserDataData, setUserData] = useState({});
  const BASEURL = process.env.REACT_APP_SAMPLE;
  const cookies = new Cookies();

  const UserTypeFunction = async () => {
    console.log("cookies", cookies.get("SmartToken"))
    const UserData = await axios.post(
      `${BASEURL}/FindUser`,
      {},
      {
        headers: {
          Authorization: cookies.get("SmartToken"),
        },
      }
    );
    if (UserData) {
      console.log("UserData", UserDataData);
      setUserData(UserData.data.GotUser);
      setStatus(UserData.data.GotUser.TypeofUser);
      setLoading(false);
    }
  };
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    UserTypeFunction();
  }, [loading]);

  return (
    <>
      {loading ? (
        <>Loading</>
      ) : (
        <>
          <div>
            {status === "org" ? (
              <>
                <SidebarOrg 
                  setIsLoggedIn={setIsLoggedIn} 
                  name={UserDataData?.Name || UserDataData?.name || "Organization"}
                  photoUrl={UserDataData?.Photo || UserDataData?.photo || ""}
                />
                <Routes>
                  <Route
                    path="/"
                    element={
                      <OrganizationProfile UserDataData={UserDataData} />
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <OrganizationProfile UserDataData={UserDataData} />
                    }
                  />
                  <Route
                    path="/newinterview"
                    element={<NewInterview UserDataData={UserDataData} />}
                  />
                  <Route
                    path="/all-interviews"
                    element={<AllInterviews UserDataData={UserDataData} />}
                  />
                  <Route
                    path="/addstudents"
                    element={<AddStudent UserDataData={UserDataData} />}
                  />
                  <Route
                    path="/viewresults"
                    element={<Results UserDataData={UserDataData} />}
                  />
                  <Route
                    path="/viewresult"
                    element={<Result UserDataData={UserDataData} />}
                  />
                  <Route
                    path="/viewresult/:resultId"
                    element={<OrganizationCandidateResult UserDataData={UserDataData} />}
                  />
                  <Route
                    path="/search-candidate"
                    element={<SearchCandidate UserDataData={UserDataData} />}
                  />
                  <Route
                    path="/interview-details/:id"
                    element={<InterviewDetailsOrg UserDataData={UserDataData} />}
                  />
                  <Route path="*" element={<h1>404 Not Found</h1>} />
                </Routes>
              </>
            ) : status === "student" ? (
              <>
                {showNavbar && (
                  <SidebarStudent 
                    setIsLoggedIn={setIsLoggedIn} 
                    name={UserDataData?.Name || UserDataData?.name || "Candidate"}
                    photoUrl={UserDataData?.Photo || UserDataData?.photo || ""}
                  />
                )}
                <Routes>
                  <Route
                    path="/"
                    element={<StudentProfilePage UserDataData={UserDataData} />}
                  />
                  <Route
                    path="/profile"
                    element={<StudentProfilePage UserDataData={UserDataData} />}
                  />
                  <Route
                    path="interview"
                    element={
                      <SwitchInterviewWindow
                        UserDataData={UserDataData}
                        ItrId={ItrId}
                        setItrId={setItrId}
                        onInterviewStart={(isStarting) => setShowNavbar(!isStarting)}
                      />
                    }
                  />
                  <Route
                    path="/interviewList"
                    element={
                      <InterviewList
                        UserDataData={UserDataData}
                        setItrId={setItrId}
                      />
                    }
                  />
                  <Route
                    path="/viewresult"
                    element={<Result UserDataData={UserDataData} />}
                  />
                  <Route
                    path="/allresults"
                    element={<AllResults />}
                  />
                  <Route
                    path="/chat"
                    element={<ChatBot />}
                  />
                  <Route
                    path="/resume/*"
                    element={<ResumeBuilder />}
                  />
                  <Route path="*" element={<h1>404 Not Found</h1>} />
                </Routes>
              </>
            ) : (
              <>Somthing went wrong...</>
            )}
          </div>
        </>
      )}
    </>
  );
});

export default WithLogin;
