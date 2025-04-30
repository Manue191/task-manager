import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useRedirectIfAuthenticated() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/tareas");
    }
  }, [navigate]);
}
