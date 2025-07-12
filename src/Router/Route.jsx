import { createBrowserRouter } from "react-router";
import Home from "../Pages/Home/Home.jsx";
import SignIn from "../Pages/SignIn/SIgnIn.jsx";
import SignUp from "../Pages/SIgnUp/SignUp.jsx";
import ErrorPage from "../Pages/ErroPage/ErrorPage.jsx";
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

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        Component: Home,
      },
      {
        path: "/sign-in",
        Component: SignIn,
      },
      {
        path: "/sign-up",
        Component: SignUp,
      },
      {
        path: "/available-camps",
        Component: AvailableCamps,
      },
      {
        path: "/camp-details/:id",
        Component: CampDetails,
      },
      {
        path: "/dashboard",
        Component: Dashboard,
        children: [
          {
            path: "add-camp",
            Component: AddCamp,
          },
          {
            path: "manage-camps",
            Component: ManageCamps,
          },
          {
            path: "update-camp/:campId",
            Component: UpdateCamp,
          },
          {
            path: "manage-registered-camps",
            Component: ManageRegisteredCamps,
          },
          {
            path: "profile",
            Component: ParticipantProfile,
          },
          {
            path: "analytics",
            Component: Analytics,
          },
          // {
          //   path: "payment-history",
          //   Component: PaymentHistory,
          // },
          {
            path: "registered-camps",
            Component: ManageRegisteredCamps,
          },
        ],
      },
      // {
      //   path: "/participant-dashboard",
      //   Component: ParticipantDashboard,
      //   children: [
      //     {
      //       path: "profile",
      //       Component: ParticipantProfile,
      //     },
      //     {
      //       path: "analytics",
      //       Component: Analytics,
      //     },
      //     {
      //       path: "payment-history",
      //       Component: PaymentHistory,
      //     },
      //     {
      //       path: "registered-camps",
      //       Component: ManageRegisteredCamps,
      //     },
      //   ],
      // },
    ],
  },
]);
