import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider }  from './context/AuthContext'
import Navbar        from './components/Navbar/Navbar'
import Footer        from './components/Footer/Footer'
import Homepage      from './pages/Homepage/Homepage'
import Profil        from './pages/Profil/Profil'
import DUpdate       from './pages/DUpdate/DUpdate'
import ArticleDetail from './pages/ArticleDetail/ArticleDetail'
import Advokasi      from './pages/Advokasi/Advokasi'
import Kontak        from './pages/Kontak/Kontak'
import AcademicBank  from './pages/AcademicBank/AcademicBank'
import AdminLogin     from './pages/Admin/AdminLogin'
import AdminDashboard from './pages/Admin/AdminDashboard'
import './index.css'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main>
          <Routes>
            <Route path="/"               element={<Homepage />} />
            <Route path="/profil"         element={<Profil />} />
            <Route path="/d-update"        element={<DUpdate />} />
            <Route path="/d-update/:id"     element={<ArticleDetail />} />
            <Route path="/advokasi"       element={<Advokasi />} />
            <Route path="/kontak"         element={<Kontak />} />
            <Route path="/academic-bank"  element={<AcademicBank />} />
            <Route path="/admin"          element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
