import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import PageLoader from "./components/PageLoader";

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  );
}
