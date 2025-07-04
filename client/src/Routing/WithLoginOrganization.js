import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SideNavBar from "../organization/Sidebar/SideNavBar";
import AddStudent from "../organization/AddStudent/AddStudent";
import NewInterview from "../organization/NewInterview/NewInterview";
import Results from "../organization/pages/ResultsList/Results";
import OrganizationProfile from "../organization/pages/OrganizationProfile";
import SearchCandidate from "../organization/pages/SearchCandidate";
import OrganizationCandidateResult from "../organization/pages/ResultsList/OrganizationCandidateResult";
import AllInterviews from "../organization/pages/AllInterviews";

function WithLoginOrganization({ setOrganizationLog, setSignup, UserDataData }) {
  const [list, setList] = useState([]);

  return (
    <div className="App">
      <BrowserRouter>
        <SideNavBar
          setOrganizationLog={setOrganizationLog}
          setSignup={setSignup}
        />
        <Routes>
          <Route path="/" element={<OrganizationProfile UserDataData={UserDataData} />} />
          <Route path="/profile" element={<OrganizationProfile UserDataData={UserDataData} />} />
          <Route path="/newinterview" element={<NewInterview UserDataData={UserDataData} />} />
          <Route
            path="/addstudents"
            element={<AddStudent list={list} setList={setList} UserDataData={UserDataData} />}
          />
          <Route path="/viewresults" element={<Results UserDataData={UserDataData} />} />
          <Route path="/search-candidate" element={<SearchCandidate UserDataData={UserDataData} />} />
          <Route path="/viewresult/:resultId" element={<OrganizationCandidateResult UserDataData={UserDataData} />} />
          <Route path="/all-interviews" element={<AllInterviews UserDataData={UserDataData} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default WithLoginOrganization;
