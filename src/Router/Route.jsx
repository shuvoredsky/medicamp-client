import { createBrowserRouter } from "react-router";
import Home from "../Pages/Home/Home.jsx";
import SignIn from "../Pages/SignIn/SIgnIn.jsx";
import SignUp from "../Pages/SIgnUp/SignUp.jsx";
import ErrorPage from "../Pages/ErroPage/ErrorPage.jsx";
import RootLayout from "../RootLayout/RootLayout.jsx";
import Dashboard from "../Dashboard/Dashboard.jsx";
import AddCamp from "../Dashboard/AddCamp.jsx";
import AvailableCamps from "../Pages/Available-Camp/AvailableCamps.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    errorElement: <ErrorPage></ErrorPage>,
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
        path: "dashboard",
        Component: Dashboard,
        children: [
          {
            path: "add-camp",
            Component: AddCamp,
          },
        ],
      },
    ],
  },
]);
