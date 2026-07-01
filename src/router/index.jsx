import React, { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import ErrorBoundary from "@/components/ErrorBoundary";

// ─── Lazy Loaded Page Components ─────────────────────────────────────────────
// Flat Pages
const Home = lazy(() => import("@/pages/Home"));
const SearchPage = lazy(() => import("@/pages/Search"));
const Login = lazy(() => import("@/pages/Login"));
const Profile = lazy(() => import("@/pages/Profile"));

const Clinics = lazy(() => import("@/pages/Clinics"));

// Booking
const Booking = lazy(() => import("@/pages/booking/Booking"));
const BookingSuccess = lazy(() => import("@/pages/booking/Success"));

// Doctors
const DoctorsPage = lazy(() => import("@/pages/doctors/List"));
const DoctorProfile = lazy(() => import("@/pages/doctors/Detail"));

// Hospital
const HospitalDetail = lazy(() => import("@/pages/hospital/Detail"));
const HospitalRegister = lazy(() => import("@/pages/hospital/Register"));
const HospitalRegisterSuccess = lazy(() => import("@/pages/hospital/RegisterSuccess"));

// Admin
const AdminLogin = lazy(() => import("@/pages/admin/Login"));
const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));
const AdminHospitals = lazy(() => import("@/pages/admin/Hospitals"));

// Private Chamber
const PrivateChamberRegister = lazy(() => import("@/pages/private-chamber/Register"));
const PrivateChamberLogin = lazy(() => import("@/pages/private-chamber/Login"));
const PrivateChamberDashboard = lazy(() => import("@/pages/private-chamber/Dashboard"));

// Staff
const StaffLogin = lazy(() => import("@/pages/staff/Login"));
const HospitalAdminDashboard = lazy(() => import("@/pages/staff/dashboard/Admin"));
const OPDDashboard = lazy(() => import("@/pages/staff/dashboard/OPD"));
const WardDashboard = lazy(() => import("@/pages/staff/dashboard/Ward"));
const BillingDashboard = lazy(() => import("@/pages/staff/dashboard/Billing"));

// Hospital Doctor
const HospitalDoctorLogin = lazy(() => import("@/pages/doctor/Login"));
const HospitalDoctorDashboard = lazy(() => import("@/pages/doctor/Dashboard"));
const HospitalDoctorCompleteProfile = lazy(() => import("@/pages/doctor/CompleteProfile"));
const DoctorOnboarding = lazy(() => import("@/pages/doctor/Onboarding"));

// ─── Path Configuration Constants (Production Best Practice) ────────────────
export const ROUTES = {
  HOME: "/",
  SEARCH: "/search",
  LOGIN: "/login",
  PROFILE: "/profile",

  CLINICS: "/clinics",
  BOOKING: "/booking",
  BOOKING_SUCCESS: "/booking-success",

  DOCTORS: "/doctors",
  DOCTOR_DETAIL: "/doctors/:id",

  HOSPITAL_DETAIL: "/hospital/:id",
  HOSPITAL_REGISTER: "/hospital/register",
  HOSPITAL_REGISTER_SUCCESS: "/hospital/register/success",

  ADMIN_LOGIN: "/admin/login",
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_HOSPITALS: "/admin/hospitals",

  CHAMBER_REGISTER: "/private-chamber/register",
  CHAMBER_LOGIN: "/private-chamber/login",
  CHAMBER_DASHBOARD: "/private-chamber/dashboard",

  STAFF_LOGIN: "/staff/login",
  STAFF_DASHBOARD_ADMIN: "/staff/dashboard/admin",
  STAFF_DASHBOARD_OPD: "/staff/dashboard/opd",
  STAFF_DASHBOARD_WARD: "/staff/dashboard/ward",
  STAFF_DASHBOARD_BILLING: "/staff/dashboard/billing",

  DOCTOR_LOGIN: "/hospital-doctor/login",
  DOCTOR_DASHBOARD: "/hospital-doctor/dashboard",
  DOCTOR_COMPLETE_PROFILE: "/hospital-doctor/complete-profile",
  DOCTOR_ONBOARDING: "/hospital-doctor/onboarding",
};

// ─── Router Configuration ───────────────────────────────────────────────────
export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorBoundary />, // Root level Error Boundary catch-all
    children: [
      { path: "", element: <Home /> },
      { path: "search", element: <SearchPage /> },
      { path: "login", element: <Login /> },
      { path: "profile", element: <Profile /> },

      { path: "clinics", element: <Clinics /> },
      { path: "booking", element: <Booking /> },
      { path: "booking-success", element: <BookingSuccess /> },

      // Admin portals
      { path: "admin/login", element: <AdminLogin /> },
      { path: "admin/dashboard", element: <AdminDashboard /> },
      { path: "admin/hospitals", element: <AdminHospitals /> },

      // Private Chamber portals
      { path: "private-chamber/register", element: <PrivateChamberRegister /> },
      { path: "private-chamber/login", element: <PrivateChamberLogin /> },
      { path: "private-chamber/dashboard", element: <PrivateChamberDashboard /> },

      // Staff portals
      { path: "staff/login", element: <StaffLogin /> },
      { path: "staff/dashboard/admin", element: <HospitalAdminDashboard /> },
      { path: "staff/dashboard/opd", element: <OPDDashboard /> },
      { path: "staff/dashboard/ward", element: <WardDashboard /> },
      { path: "staff/dashboard/billing", element: <BillingDashboard /> },

      // Hospital doctor portals
      { path: "hospital-doctor/login", element: <HospitalDoctorLogin /> },
      { path: "hospital-doctor/dashboard", element: <HospitalDoctorDashboard /> },
      { path: "hospital-doctor/complete-profile", element: <HospitalDoctorCompleteProfile /> },
      { path: "hospital-doctor/onboarding", element: <DoctorOnboarding /> },

      // Public / Dynamic routes
      { path: "doctors", element: <DoctorsPage /> },
      { path: "doctors/:id", element: <DoctorProfile /> },
      { path: "hospital/:id", element: <HospitalDetail /> },

      // Hospital onboarding
      { path: "hospital/register", element: <HospitalRegister /> },
      { path: "hospital/register/success", element: <HospitalRegisterSuccess /> },
    ],
  },
]);
