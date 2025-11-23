import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { ProtectedRoute } from './guards/ProtectedRoute'
import { HomePage } from '@/pages/HomePage'
import { AboutPage } from '@/pages/AboutPage'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { PhoneLoginPage } from '@/pages/PhoneLoginPage'
import { PhoneRegisterPage } from '@/pages/PhoneRegisterPage'

export function RouterLayer() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/phone-login" element={<PhoneLoginPage />} />
          <Route path="/phone-register" element={<PhoneRegisterPage />} />

          {/* Protected Routes */}
          <Route
            element={
              <ProtectedRoute>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
          </Route>
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
