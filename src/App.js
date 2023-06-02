import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./views/Home";
import Stream, { loader as streamLoader } from "./views/Stream";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/stream/:channel_name",
    element: <Stream />,
    loader: streamLoader,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
