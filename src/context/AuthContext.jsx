// src/context/AuthContext.jsx
// ─────────────────────────────────────────────────────────────
// Global authentication state menggunakan React Context
// Wrap di App.jsx agar seluruh komponen bisa akses user & fungsi login/logout
// ─────────────────────────────────────────────────────────────
import { createContext, useContext, useState, useEffect } from 'react'
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth } from '../firebase/config'

// ── Create Context ───────────────────────────────────────────
const AuthContext = createContext(null)

// ── Provider ─────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  /**
   * Login dengan email & password
   * @param {string} email
   * @param {string} password
   */
  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password)

  /**
   * Logout pengguna yang sedang aktif
   */
  const logout = () => signOut(auth)

  const value = {
    user,          // Firebase User object (null jika belum login)
    isAdmin: !!user, // true jika sudah login
    loading,       // true saat state auth masih dimuat
    login,
    logout,
  }

  // Tampilkan children hanya setelah auth state diketahui
  if (loading) return null

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// ── Custom Hook ───────────────────────────────────────────────
/**
 * Gunakan hook ini di komponen mana saja untuk akses auth state
 * @example
 * const { user, isAdmin, login, logout } = useAuth()
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth harus digunakan di dalam <AuthProvider>')
  }
  return context
}
