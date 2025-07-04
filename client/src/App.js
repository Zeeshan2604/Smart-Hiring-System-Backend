import React, { useState, useEffect, Suspense, lazy } from "react";
import { BrowserRouter } from "react-router-dom";
import Loader from "./Loader/Loader";
import { SnackbarProvider } from './Snackbar/Snackbar';
// Lazy load WithLogin and WithoutLogin
const WithLogin = lazy(() => import("./Routing/WithLogin"));
const WithoutLogin = lazy(() => import("./Routing/WithoutLogin.jsx"));
// import InterviewShow from "./Student/InterviewShow.jsx";

function App() {
  const [isLogged, setIsLoggedIn] = useState(false); // sessionstorage login check
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [refresher, setRefresher] = useState(true);

  useEffect(() => {
    const loggedInStatus = sessionStorage.getItem('isLoggedIn');
    if (loggedInStatus === 'true') {
      setIsLoggedIn(true);
    }
  }, []);
  // Simulating a loading delay
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1400); // Replace 2000 with the actual loading time for your data or resources
  }, []);

  return (
    <SnackbarProvider>
      {isLoading ? (
        <Loader /> // Display the loader while loading
      ) : (
        <BrowserRouter>
          <Suspense fallback={<Loader />}>
            {isLogged ? (
              <WithLogin
                setStatus={setStatus}
                status={status}
                setIsLoggedIn={setIsLoggedIn}
              />
            ) : (
              <WithoutLogin
                setStatus={setStatus}
                status={status}
                setIsLoggedIn={setIsLoggedIn}
                refresher={refresher}
                setRefresher={setRefresher}
              />
            )}
          </Suspense>
        </BrowserRouter>
      )}
    </SnackbarProvider>
  );
}

export default App;
