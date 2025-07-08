import { createBrowserRouter } from "react-router";
import Home from "../Pages/Home/Home.jsx";
import SignIn from "../Pages/SignIn/SIgnIn.jsx";
import SignUp from "../Pages/SIgnUp/SignUp.jsx";
import ErrorPage from "../Pages/ErroPage/ErrorPage.jsx";
import RootLayout from "../RootLayout/RootLayout.jsx";

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
    ],
  },
]);
