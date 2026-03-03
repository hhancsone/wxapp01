import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { HomePage } from "./components/HomePage";
import { IdentifyPage } from "./components/IdentifyPage";
import { EncyclopediaPage } from "./components/EncyclopediaPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: "identify", Component: IdentifyPage },
      { path: "encyclopedia", Component: EncyclopediaPage },
    ],
  },
]);
