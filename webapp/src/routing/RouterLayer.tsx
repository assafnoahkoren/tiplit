import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { PublicLayout } from '@/components/PublicLayout'
import { ProtectedRoute } from './guards/ProtectedRoute'
import { HomePage } from '@/pages/HomePage'
import { AboutPage } from '@/pages/AboutPage'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
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
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/phone-login" element={<PhoneLoginPage />} />
          <Route path="/phone-register" element={<PhoneRegisterPage />} />
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
