import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useWorkoutsContext } from "./useWorkoutsContext";

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const { dispatch: workoutsDispatch } = useWorkoutsContext();

  const logout = async (email, password) => {
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
    dispatch({ type: "SET_WORKOUTS", payload: null });
  };

  return { logout };
};
