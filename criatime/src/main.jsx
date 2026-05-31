import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";

import App from "./App.jsx";
import Inclusao from "./Inclusao.jsx";
import Pesquisa from "./Pesquisa.jsx";

const router = createBrowserRouter([
  { path: "/", Component: App },
  { path: "inclusao", Component: Inclusao },
  { path: "pesquisa", Component: Pesquisa },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />,
  </StrictMode>,
);
