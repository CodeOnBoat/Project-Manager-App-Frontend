import React, { useState, useEffect, useContext, useRef } from "react";
import "./Dashboard.css";
import { DashbordProps, Profile, ProjectType } from "../../../data/Interfaces";
import { addNewProject, getProjectsById } from "../../../client/client";
import { AppContext } from "../../../context/AppContext";
import { Stats } from "../../Items/Stats/Stats";
import { ProjectList } from "../../Items/ProjectList/ProjectList";
import DonautChart from "../../Items/Chart/DonautChart";
import { NewProject } from "../../Items/NewProject/NewProject";

function Dashboard(props: DashbordProps) {
  const { profile, setProjects, projects } = useContext(AppContext);
  const [showNewProject, setShowNewProject] = useState(false);
  const dashBoardRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  const handleShowNewProject = () => {
    if (isDesktop) {
      dashBoardRef.current!.classList.add("show-new-project");
      setTimeout(() => {
        dashBoardRef.current!.classList.remove("show-new-project");
        setShowNewProject(true);
      }, 500);
    } else {
      setShowNewProject(true);
    }
  };

  const handleCancelNewProject = () => {
    if (isDesktop) {
      dashBoardRef.current!.classList.add("remove-new-project");
      setTimeout(() => {
        dashBoardRef.current!.classList.remove("remove-new-project");
        setShowNewProject(false);
      }, 500);
    } else {
      setShowNewProject(false);
    }
  };

  useEffect(() => {
    const getProjects = async () => {
      const projectArray = await getProjectsById(profile!.id);
      setProjects(projectArray);
    };
    if (profile) getProjects();
  }, [profile]);

  useEffect(() => {
    if (window.innerWidth > 1200) {
      setIsDesktop(true);
    }
  }, []);

  return (
    <div className="dashboard-container" ref={dashBoardRef}>
      {profile && (
        <>
          <div className="block stats-block">
            <DonautChart
              total={100}
              completed={90}
              size={200}
              strokeWidth={12}
              fontSize={30}
              fontColor="#fff"
              trackColor="rgba(0,0,0,0)"
              progressColor="rgba(70, 81, 237, 1)"
            />
            <div className="standard-container stats-container">
              <Stats
                completedTasks={4}
                effectiveTime="12:04"
                remainingTasks={6}
                estimatedTime="21:06"
              />
            </div>
          </div>
          {showNewProject && (
            <div className="block newProject">
              <NewProject handleCancelNewProject={handleCancelNewProject} />
            </div>
          )}
          <div className="block projectList">
            <div className="standard-container">
              {projects && (
                <ProjectList
                  projects={projects!}
                  handleShowNewProject={handleShowNewProject}
                  showNewProject={showNewProject}
                />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;