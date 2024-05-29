
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { HomeLayout, Landing, Login, Logout, Register} from "./pages";
import CalendarComponent from "./pages/CalendarView/Calendar";
import { ToastContainer, toast } from 'react-toastify';
import './styles/main.scss';
import './styles/global-styles.scss'; // Import global styles



const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "calendar",
        element: <CalendarComponent />,
      },
      {
        path: "logout",
        element: <Logout />,
      },
   

    ],
  },
]);

function App() {


  return (
    <>
        <RouterProvider router={router} />
        <ToastContainer position='top-center' />
    </>
  )
}

export default App
