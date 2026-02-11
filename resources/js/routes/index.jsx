import { Route } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import RoleBasedRoute from "@/components/layouts/RoleBasedRoute";

import { adminRoutes } from "./admin.routes";
import { hrRoutes } from "./hr.routes";
import { employeeRoutes } from "./employee.routes";

export function ProtectedRoutes() {
  return (
    <>
      {/* Admin */}
      <Route element={<RoleBasedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<DashboardLayout />}>
          {adminRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.element}
            />
          ))}
        </Route>
      </Route>

      {/* HR */}
      <Route element={<RoleBasedRoute allowedRoles={["hr"]} />}>
        <Route path="/hr" element={<DashboardLayout />}>
          {hrRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.element}
            />
          ))}
        </Route>
      </Route>

      {/* Employee */}
      <Route
        element={
          <RoleBasedRoute
            allowedRoles={["employee"]}
          />
        }
      >
        <Route path="/employee" element={<DashboardLayout />}>
          {employeeRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.element}
            />
          ))}
        </Route>
      </Route>
    </>
  );
}
