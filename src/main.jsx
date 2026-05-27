import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Home from "./routes/index";
import SearchPage from "./routes/search";
import Login from "./routes/login";
import Profile from "./routes/profile";
import LabsPage from "./routes/labs";
import SOSPage from "./routes/sos";
import Clinics from "./routes/clinics";
import Booking from "./routes/booking";
import BookingSuccess from "./routes/booking-success";
import AdminLogin from "./routes/admin.login";
import AdminDashboard from "./routes/admin.dashboard";
import ClinicApply from "./routes/clinic.apply";
import ClinicLogin from "./routes/clinic.login";
import ClinicDashboard from "./routes/clinic.dashboard";
import StaffLogin from "./routes/staff.login";
import StaffDashboard from "./routes/staff.dashboard";
import DoctorsPage from "./routes/doctors.index";
import DoctorProfile from "./routes/doctors.$id";
import HospitalDetail from "./routes/hospital.$id";
import "./styles.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <Home /> },
      { path: "search", element: <SearchPage /> },
      { path: "login", element: <Login /> },
      { path: "profile", element: <Profile /> },
      { path: "labs", element: <LabsPage /> },
      { path: "sos", element: <SOSPage /> },
      { path: "clinics", element: <Clinics /> },
      { path: "booking", element: <Booking /> },
      { path: "booking-success", element: <BookingSuccess /> },
      { path: "admin/login", element: <AdminLogin /> },
      { path: "admin/dashboard", element: <AdminDashboard /> },
      { path: "clinic/apply", element: <ClinicApply /> },
      { path: "clinic/login", element: <ClinicLogin /> },
      { path: "clinic/dashboard", element: <ClinicDashboard /> },
      { path: "staff/login", element: <StaffLogin /> },
      { path: "staff/dashboard", element: <StaffDashboard /> },
      { path: "doctors", element: <DoctorsPage /> },
      { path: "doctors/:id", element: <DoctorProfile /> },
      { path: "hospital/:id", element: <HospitalDetail /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
