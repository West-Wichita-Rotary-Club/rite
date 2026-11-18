import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout.jsx";
import { Home } from "./pages/Home.jsx";
import { History } from "./pages/History.jsx";
import { Stories } from "./pages/Stories.jsx";
import { Alumni } from "./pages/Alumni.jsx";
import { AlumniProfile } from "./pages/AlumniProfile.jsx";
import { Resources } from "./pages/Resources.jsx";
import { Faq } from "./pages/Faq.jsx";
import { Schools } from "./pages/Schools.jsx";
import { SchoolProfile } from "./pages/SchoolProfile.jsx";
import { Impact } from "./pages/Impact.jsx";
import { Register } from "./pages/Register.jsx";
import { Login } from "./pages/Login.jsx";
import { Account } from "./pages/Account.jsx";
import { Coordinator } from "./pages/Coordinator.jsx";
import { NotFound } from "./pages/NotFound.jsx";

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="history" element={<History />} />
        <Route path="stories" element={<Stories />} />
        <Route path="alumni" element={<Alumni />} />
        <Route path="alumni/:id" element={<AlumniProfile />} />
        <Route path="schools" element={<Schools />} />
        <Route path="schools/:slug" element={<SchoolProfile />} />
        <Route path="resources" element={<Resources />} />
        <Route path="faq" element={<Faq />} />
        <Route path="impact" element={<Impact />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="account" element={<Account />} />
        <Route path="coordinator" element={<Coordinator />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
