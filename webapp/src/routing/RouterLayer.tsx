import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { PublicLayout } from '@/components/PublicLayout'
import { ProtectedRoute } from './guards/ProtectedRoute'
import { HomePage } from '@/pages/HomePage'
import { AboutPage } from '@/pages/AboutPage'
// import { LoginPage } from '@/pages/LoginPage'
// import { RegisterPage } from '@/pages/RegisterPage'
import { PhoneLoginPage } from '@/pages/PhoneLoginPage'
import { PhoneRegisterPage } from '@/pages/PhoneRegisterPage'
import { OnboardingPage } from '@/pages/OnboardingPage'

export function RouterLayer() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes with PublicLayout */}
        <Route
          element={
            <PublicLayout>
              <Outlet />
            </PublicLayout>
          }
        >
          {/* Phone-based auth is now primary */}
          <Route path="/login" element={<PhoneLoginPage />} />
          <Route path="/register" element={<PhoneRegisterPage />} />

          {/* Email/password auth hidden for now */}
          {/* <Route path="/email-login" element={<LoginPage />} /> */}
          {/* <Route path="/email-register" element={<RegisterPage />} /> */}
        </Route>

        {/* Protected Routes with Layout */}
        <Route
          element={
            <ProtectedRoute>
              <Layout>
                <Outlet />
              </Layout>
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
