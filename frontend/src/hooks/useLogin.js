import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();
  const API_URL = process.env.REACT_APP_API_URL;

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch(`${API_URL}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const loginData = await response.json();

    if (response.ok) {
      const profileResponse = await fetch(`${API_URL}/user/get`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loginData.token}`,
        },
      });

      const profileData = await profileResponse.json();

      if (profileResponse.ok) {
        const fullUser = { ...loginData, ...profileData };
        localStorage.setItem("user", JSON.stringify(fullUser));
        dispatch({ type: "LOGIN", payload: fullUser });
      } else {
        localStorage.setItem("user", JSON.stringify(loginData));
        dispatch({ type: "LOGIN", payload: loginData });
      }

      setIsLoading(false);
    } else {
      setIsLoading(false);
      setError(loginData.error);
    }
  };

  return { login, error, isLoading };
};
