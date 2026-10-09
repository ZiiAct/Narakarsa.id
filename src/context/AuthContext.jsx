// src/context/AuthContext.jsx
// ─────────────────────────────────────────────────────────────
// Global authentication state menggunakan React Context
// Wrap di App.jsx agar seluruh komponen bisa akses user & fungsi login/logout
<<<<<<< HEAD
// Sesuai UC-02: Otorisasi berbasis daftar email pengurus KASTRAD
=======
>>>>>>> a4dbfd84fe0ffd3baad267b62b365a22a1d50fd0
// ─────────────────────────────────────────────────────────────
import { createContext, useContext, useState, useEffect } from 'react'
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth } from '../firebase/config'
<<<<<<< HEAD
import { isKastradEmail } from '../config/kastrad'
=======
>>>>>>> a4dbfd84fe0ffd3baad267b62b365a22a1d50fd0

// ── Create Context ───────────────────────────────────────────
const AuthContext = createContext(null)

// ── Provider ─────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  // Listen to Firebase auth state changes
  useEffect(() => {
<<<<<<< HEAD
    const unsubscribe = onAuthStateChanged(auth, async currentUser => {
      if (currentUser) {
        if (isKastradEmail(currentUser.email)) {
          setUser(currentUser)
        } else {
          // Akun Firebase bukan merupakan pengurus KASTRAD terdaftar
          try {
            await signOut(auth)
          } catch (e) {
            console.error('Error logging out unauthorized user:', e)
          }
          setUser(null)
        }
      } else {
        setUser(null)
      }
=======
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser)
>>>>>>> a4dbfd84fe0ffd3baad267b62b365a22a1d50fd0
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  /**
   * Login dengan email & password
<<<<<<< HEAD
   * Memeriksa otorisasi KASTRAD sesuai UC-02
   * @param {string} email
   * @param {string} password
   */
  const login = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password)
    const loggedUser = cred.user

    if (!isKastradEmail(loggedUser.email)) {
      await signOut(auth)
      setUser(null)
      const err = new Error(
        `Akses ditolak: Akun ${loggedUser.email} tidak terdaftar dalam daftar pengurus KASTRAD.`
      )
      err.code = 'auth/not-kastrad'
      throw err
    }

    return cred
  }
=======
   * @param {string} email
   * @param {string} password
   */
  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password)
>>>>>>> a4dbfd84fe0ffd3baad267b62b365a22a1d50fd0

  /**
   * Logout pengguna yang sedang aktif
   */
  const logout = () => signOut(auth)

<<<<<<< HEAD
  const isKastrad = !!user && isKastradEmail(user.email)

  const value = {
    user,
    isAdmin: isKastrad, // Hanya akun KASTRAD yang berstatus admin
    isKastrad,
    loading,
=======
  const value = {
    user,          // Firebase User object (null jika belum login)
    isAdmin: !!user, // true jika sudah login
    loading,       // true saat state auth masih dimuat
>>>>>>> a4dbfd84fe0ffd3baad267b62b365a22a1d50fd0
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
