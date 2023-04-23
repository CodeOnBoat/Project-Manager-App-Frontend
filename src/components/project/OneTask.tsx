import React, { useContext } from "react";
import { OneTaskProps, Task } from "../../data/Interfaces";
import { AppContext } from "../../context/AppContext";

export const OneTask = ({ task, deleteSelf }: OneTaskProps) => {
  return (
    <div className="task-contaner">
      {task.title}
      <button type="submit" className="task-btn-delete" onClick={deleteSelf}>
        Delete
      </button>
    </div>
  );
};
