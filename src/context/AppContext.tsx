import {
  createContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { NotificationType, Profile, ProjectType } from "../data/Interfaces";
import { getNotifications } from "../client/client";

type AppContextType = {
  profile: Profile | undefined;
  setProfile: (profile: Profile | undefined) => void;
  projects: ProjectType[] | undefined;
  setProjects: (projects: ProjectType[] | undefined) => void;
  notifications: NotificationType[];
  setNotifications: (notifications: NotificationType[]) => void;
  darkMode: "dark" | "light";
  setDarkMode: (darkMode: "dark" | "light") => void;
};

const initialValue: AppContextType = {
  profile: undefined,
  setProfile: () => {},
  projects: [],
  setProjects: (projects: ProjectType[] | undefined) => {},
  notifications: [],
  setNotifications: () => {},
  darkMode: "dark",
  setDarkMode: () => {},
};

export const AppContext = createContext(initialValue);

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [profile, setProfile] = useState<Profile | undefined>();
  const [projects, setProjects] = useState<ProjectType[] | undefined>([]);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [darkMode, setDarkMode] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const storedProfile = localStorage.getItem("profile");
    const storedProjects = localStorage.getItem("projects");
    const storedDarkMode = localStorage.getItem("darkMode");
    if (
      storedProfile &&
      storedProjects &&
      storedDarkMode &&
      storedProfile !== "undefined" &&
      storedProjects !== "undefined" &&
      storedDarkMode !== "undefined"
    ) {
      setProfile(JSON.parse(storedProfile!));
      setProjects(JSON.parse(storedProjects!));
      setDarkMode(storedDarkMode! as "dark" | "light");
    }
  }, []);

  useEffect(() => {
    const getNot = async () => {
      const notificationsReq = await getNotifications(profile!.id + "");
      setNotifications(notificationsReq);
    };
    if (profile) {
      console.log("getNot");
      getNot();
      const inverval = setInterval(getNot, 20000);
      return () => clearInterval(inverval);
    }
  }, [profile]);

  const setProf = (profile: Profile | undefined) => {
    setProfile(profile);
    localStorage.setItem("profile", JSON.stringify(profile));
  };

  const setProj = (projects: ProjectType[] | undefined) => {
    setProjects(projects);
    localStorage.setItem("projects", JSON.stringify(projects));
  };

  const setDM = (darkMode: "dark" | "light") => {
    setDarkMode(darkMode);
    localStorage.setItem("darkMode", darkMode);
  };

  return (
    <AppContext.Provider
      value={{
        profile: profile,
        setProfile: setProf,
        projects: projects,
        setProjects: setProj,
        notifications: notifications,
        setNotifications: setNotifications,
        darkMode: darkMode,
        setDarkMode: setDM,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
