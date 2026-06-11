// import React from "react";
// import ReactDOM from "react-dom/client";
// import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import App from "./App";
// import Home from "./routes/index";
// import SearchPage from "./routes/search";
// import Login from "./routes/login";
// import Profile from "./routes/profile";
// import LabsPage from "./routes/labs";
// import SOSPage from "./routes/sos";
// import Clinics from "./routes/clinics";
// import Booking from "./routes/booking";
// import BookingSuccess from "./routes/booking-success";
// import AdminLogin from "./routes/admin.login";
// import AdminDashboard from "./routes/admin.dashboard";
// import ClinicApply from "./routes/clinic.apply";
// import ClinicLogin from "./routes/clinic.login";
// import ClinicDashboard from "./routes/clinic.dashboard";
// import StaffLogin from "./routes/staff.login";
// import DoctorsPage from "./routes/doctors.index";
// import DoctorProfile from "./routes/doctors.$id";
// import HospitalDetail from "./routes/hospital.$id";
// // ── Hospital doctor portals ───────────────────────────────────────────────────
// import HospitalDoctorLogin           from "./routes/hospital-doctor.login";
// import HospitalDoctorDashboard       from "./routes/hospital-doctor.dashboard";
// import HospitalDoctorCompleteProfile from "./routes/hospital-doctor.complete-profile";
// import DoctorOnboarding              from "./routes/doctor.onboarding";
// // ── Role-based staff dashboards ───────────────────────────────────────────────
// import HospitalAdminDashboard from "./routes/staff.dashboard.admin";
// import OPDDashboard           from "./routes/staff.dashboard.opd";
// import WardDashboard          from "./routes/staff.dashboard.ward";
// import BillingDashboard       from "./routes/staff.dashboard.billing";
// // ── Hospital registration ─────────────────────────────────────────────────────
// import HospitalRegister from "./routes/hospital.register";
// // ─────────────────────────────────────────────────────────────────────────────
// import "./styles.css";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />,
//     children: [
//       // ── Public ──────────────────────────────────────────────────────────────
//       { path: "",                                 element: <Home />          },
//       { path: "search",                           element: <SearchPage />    },
//       { path: "login",                            element: <Login />         },
//       { path: "profile",                          element: <Profile />       },
//       { path: "labs",                             element: <LabsPage />      },
//       { path: "sos",                              element: <SOSPage />       },
//       { path: "clinics",                          element: <Clinics />       },
//       { path: "booking",                          element: <Booking />       },
//       { path: "booking-success",                  element: <BookingSuccess />},
//       { path: "doctors",                          element: <DoctorsPage />   },
//       { path: "doctors/:id",                      element: <DoctorProfile /> },
//       { path: "hospital/:id",                     element: <HospitalDetail />},
//       // ── Hospital registration ────────────────────────────────────────────────
//       { path: "hospital/register",                element: <HospitalRegister />},
//       // ── Admin ────────────────────────────────────────────────────────────────
//       { path: "admin/login",                      element: <AdminLogin />    },
//       { path: "admin/dashboard",                  element: <AdminDashboard />},
//       // ── Clinic ───────────────────────────────────────────────────────────────
//       { path: "clinic/apply",                     element: <ClinicApply />   },
//       { path: "clinic/login",                     element: <ClinicLogin />   },
//       { path: "clinic/dashboard",                 element: <ClinicDashboard />},
//       // ── Staff login ──────────────────────────────────────────────────────────
//       { path: "staff/login",                      element: <StaffLogin />    },
//       // ── Role dashboards ──────────────────────────────────────────────────────
//       { path: "staff/dashboard/admin",            element: <HospitalAdminDashboard />},
//       { path: "staff/dashboard/opd",              element: <OPDDashboard />  },
//       { path: "staff/dashboard/ward",             element: <WardDashboard /> },
//       { path: "staff/dashboard/billing",          element: <BillingDashboard />},
//       // ── Hospital doctor portals ──────────────────────────────────────────────
//       { path: "hospital-doctor/login",            element: <HospitalDoctorLogin />         },
//       { path: "hospital-doctor/dashboard",        element: <HospitalDoctorDashboard />     },
//       { path: "hospital-doctor/complete-profile", element: <HospitalDoctorCompleteProfile />},
//       { path: "hospital-doctor/onboarding",       element: <DoctorOnboarding />            },

//     ],
//   },
// ]);

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <RouterProvider router={router} />
//   </React.StrictMode>
// );



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
import DoctorsPage from "./routes/doctors.index";
import DoctorProfile from "./routes/doctors.$id";
import HospitalDetail from "./routes/hospital.$id";
// ── Hospital doctor portals ───────────────────────────────────────────────────
import HospitalDoctorLogin           from "./routes/hospital-doctor.login";
import HospitalDoctorDashboard       from "./routes/hospital-doctor.dashboard";
import HospitalDoctorCompleteProfile from "./routes/hospital-doctor.complete-profile";
import DoctorOnboarding              from "./routes/doctor.onboarding";
// ── 4 role-based staff dashboards ────────────────────────────────────────────
import HospitalAdminDashboard from "./routes/staff.dashboard.admin";
import OPDDashboard           from "./routes/staff.dashboard.opd";
import WardDashboard          from "./routes/staff.dashboard.ward";
import BillingDashboard       from "./routes/staff.dashboard.billing";
// ── Hospital onboarding (new) ────────────────────────────────────────────────
import HospitalRegister        from "./routes/hospital.register";
import HospitalRegisterSuccess from "./routes/hospital.register.success";
import AdminHospitals          from "./routes/admin.hospitals";
// ─────────────────────────────────────────────────────────────────────────────
import "./styles.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "",                                    element: <Home /> },
      { path: "search",                              element: <SearchPage /> },
      { path: "login",                               element: <Login /> },
      { path: "profile",                             element: <Profile /> },
      { path: "labs",                                element: <LabsPage /> },
      { path: "sos",                                 element: <SOSPage /> },
      { path: "clinics",                             element: <Clinics /> },
      { path: "booking",                             element: <Booking /> },
      { path: "booking-success",                     element: <BookingSuccess /> },
      { path: "admin/login",                         element: <AdminLogin /> },
      { path: "admin/dashboard",                     element: <AdminDashboard /> },
      { path: "clinic/apply",                        element: <ClinicApply /> },
      { path: "clinic/login",                        element: <ClinicLogin /> },
      { path: "clinic/dashboard",                    element: <ClinicDashboard /> },
      { path: "staff/login",                         element: <StaffLogin /> },
      // ── Role dashboards ──────────────────────────────────────────────────────
      { path: "staff/dashboard/admin",               element: <HospitalAdminDashboard /> },
      { path: "staff/dashboard/opd",                 element: <OPDDashboard /> },
      { path: "staff/dashboard/ward",                element: <WardDashboard /> },
      { path: "staff/dashboard/billing",             element: <BillingDashboard /> },
      // ── Hospital doctor portals ──────────────────────────────────────────────
      { path: "hospital-doctor/login",               element: <HospitalDoctorLogin /> },
      { path: "hospital-doctor/dashboard",           element: <HospitalDoctorDashboard /> },
      { path: "hospital-doctor/complete-profile",    element: <HospitalDoctorCompleteProfile /> },
      { path: "hospital-doctor/onboarding",          element: <DoctorOnboarding /> },
      // ── Public ──────────────────────────────────────────────────────────────
      { path: "doctors",                             element: <DoctorsPage /> },
      { path: "doctors/:id",                         element: <DoctorProfile /> },
      { path: "hospital/:id",                        element: <HospitalDetail /> },
      // ── Hospital onboarding ─────────────────────────────────────────────────
      { path: "hospital/register",                   element: <HospitalRegister /> },
      { path: "hospital/register/success",           element: <HospitalRegisterSuccess /> },
      { path: "admin/hospitals",                     element: <AdminHospitals /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);