import { Toaster } from "sonner";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "@/pages/auth/login/page";
import GoogleSuccessPage from "@/pages/auth/google/success/page";
import StoreInitializer from "@/store-initializer";
import RegisterPage from "@/pages/auth/register/page";
import { ProtectedRoute } from "@/protected-route";
import AdminLayout from "@/layouts/admin-layout";
import CoursesPage from "@/pages/admin/courses/page";
import LogoutPage from "@/pages/auth/logout/page";
import NotesPage from "@/pages/admin/notes/page";
import ShareNotePage from "@/pages/share-note/page";
import HomePage from "@/pages/home";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <StoreInitializer />
      <Routes>
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="courses" element={<CoursesPage />} />
          <Route path="/admin/:courseId/notes" element={<NotesPage />} />
        </Route>

        <Route path="/" element={<HomePage />} />
        <Route path="/share-note/:shareToken" element={<ShareNotePage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/google/success" element={<GoogleSuccessPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
