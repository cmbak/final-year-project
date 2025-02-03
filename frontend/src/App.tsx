import { Routes, Route } from "react-router";
import Dashboard from "./components/Dashboard/Dashboard";
import Home from "./components/Home/Home";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Navbar from "./components/Navbar/Navbar";
import "./reset.css";
import "./App.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import CreateQuiz from "./components/CreateQuiz/CreateQuiz";
import TakeQuiz from "./components/TakeQuiz/TakeQuiz";

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<ProtectedRoute />}>
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="create-quiz" element={<CreateQuiz />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="take-quiz/:quizId" element={<TakeQuiz />} />
          </Route>
        </Routes>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </>
  );
}

export default App;
