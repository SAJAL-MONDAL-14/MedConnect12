import { Navigate } from "react-router-dom";

export default function ChamberProtectedRoute({ children }) {
  const token = localStorage.getItem("accessToken");
  const doctor = localStorage.getItem("clinic_doctor");

  if (!token || !doctor) {
    return <Navigate to="/private-chamber/login" replace />;
  }

  return children;
}
