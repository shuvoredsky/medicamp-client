import { createBrowserRouter } from "react-router"; // Corrected import
import Home from "../Pages/Home/Home.jsx";
import SignIn from "../Pages/SignIn/SIgnIn.jsx"; // Fixed typo
import SignUp from "../Pages/SIgnUp/SignUp.jsx"; // Fixed typo
import ErrorPage from "../Pages/ErroPage/ErrorPage.jsx"; // Fixed typo
import RootLayout from "../RootLayout/RootLayout.jsx";
import Dashboard from "../Dashboard/Dashboard.jsx";
import AddCamp from "../Dashboard/AddCamp.jsx";
import AvailableCamps from "../Pages/Available-Camp/AvailableCamps.jsx";
import CampDetails from "../Pages/CampDetails/CampDetails.jsx";
import ManageCamps from "../Dashboard/ManageCamps.jsx";
import UpdateCamp from "../Dashboard/UpdateCamp.jsx";
import ManageRegisteredCamps from "../Dashboard/ManageRegisteredCamps.jsx";
import Analytics from "../Dashboard/Participant-Dashboard/ParticipantAnalytics";
import ParticipantProfile from "../Dashboard/Participant-Dashboard/ParticipantProfile.jsx";
import RegisteredCamps from "../Dashboard/Participant-Dashboard/RegisteredCamps.jsx";
import PaymentHistory from "../Dashboard/Participant-Dashboard/PaymentHistory.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
import OrganizerProfile from "../Dashboard/OrganizerProfile.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />, // Using element prop for consistency
    errorElement: <ErrorPage />, // Error page for unhandled routes
    children: [
      {
        path: "/",
        element: <Home />, // Public home route
      },
      {
        path: "/sign-in",
        element: <SignIn />, // Public sign-in route
      },
      {
        path: "/sign-up",
        element: <SignUp />, // Public sign-up route
      },
      {
        path: "/available-camps",
        element: <AvailableCamps />,
      },
      {
        path: "/camp-details/:id",
        element: (
          <PrivateRoute>
            <CampDetails />
          </PrivateRoute>
        ), // Public camp details route
      },
      {
        path: "/dashboard",
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        ), // Protected dashboard route
        children: [
          {
            path: "organizer-profile",
            element: <OrganizerProfile></OrganizerProfile>,
          },
          {
            path: "add-camp",
            element: <AddCamp />, // Protected add camp route
          },
          {
            path: "manage-camps",
            element: <ManageCamps />, // Protected manage camps route
          },
          {
            path: "update-camp/:campId",
            element: <UpdateCamp />, // Protected update camp route
          },
          {
            path: "manage-registered-camps",
            element: <ManageRegisteredCamps />, // Protected manage registered camps route
          },
          {
            path: "profile",
            element: <ParticipantProfile />, // Protected profile route
          },
          {
            path: "analytics",
            element: <Analytics />, // Protected analytics route
          },
          {
            path: "payment-history",
            element: <PaymentHistory />, // Protected payment history route
          },
          {
            path: "registered-camps",
            element: <RegisteredCamps />, // Protected registered camps route
          },
        ],
      },
    ],
  },
]);
