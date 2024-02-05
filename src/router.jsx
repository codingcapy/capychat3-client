

import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import Layout from "./Layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard";


export function Router() {

    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route element={<Layout />}>
                <Route path="/" element={<HomePage />}/>
                <Route path="/users/login" element={<LoginPage />}/>
                <Route path="/users/signup" element={<SignupPage />}/>
                <Route path="/dashboard" element={<Dashboard />}/>
            </Route>
        )
    )
    return router
}