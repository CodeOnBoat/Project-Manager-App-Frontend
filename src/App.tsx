import React, { useState, useEffect, useContext } from "react";
import { googleLogout } from "@react-oauth/google";
import "./App.css";
import Dashboard from "./components/Pages/Dashboard/Dashboard";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { Project } from "./components/Pages/Project/Project";
import { LandingPage } from "./components/Pages/LandingPage/LandingPage";
import { AppContext } from "./context/AppContext";
import { Header } from "./components/Items/Header/Header";
import { ProjectContextProvider } from "./context/ProjectContext";
import "./data/colors/colors.css";

function App() {
  const navigate = useNavigate();
  const { setProfile, profile, projects, setProjects, darkMode, setDarkMode } = useContext(AppContext);
  const [enableBack, setEnableBack] = useState(false);

  const logOut = () => {
    googleLogout();
    setProfile(undefined);
    setProjects(undefined);
    navigate("/");
  };

  return (
    <div className="app" data-theme={darkMode}>
      <Header
        logOut={logOut}
        enableBack={enableBack}
        setEnableBack={setEnableBack}
      />
      <Routes>
        <Route
          path="/"
          element={
            <LandingPage
              logOut={logOut}
              profile={profile}
              setProfile={setProfile}
            />
          }
        />
        <Route
          path="/dashboard"
          element={<Dashboard setEnableBack={setEnableBack} logOut={logOut} />}
        />
        {projects &&
          projects &&
          projects.map((p, index) => (
            <Route
              path={`/project/${p.title}`}
              key={index}
              element={
                <>
                  <ProjectContextProvider>
                    <Project project={p} />
                  </ProjectContextProvider>
                </>
              }
            />
          ))}
      </Routes>
    </div>
  );
}
export default App;
