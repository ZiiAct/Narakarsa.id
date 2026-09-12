// src/firebase/storage.js
// ─────────────────────────────────────────────────────────────
// Helper functions untuk upload/delete file di Firebase Storage
// ─────────────────────────────────────────────────────────────
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage'
import { storage } from './config'

/**
 * Upload gambar ke Firebase Storage dengan progress callback
 * @param {File}     file       - File object dari input[type=file]
 * @param {string}   folder     - Nama folder di Storage (e.g. 'updates', 'profil')
 * @param {Function} onProgress - Callback(percent) dipanggil saat progress berubah
 * @returns {Promise<string>}   - Download URL dari file yang di-upload
 */
export function uploadImage(file, folder = 'uploads', onProgress = () => {}) {
  return new Promise((resolve, reject) => {
    // Buat nama file yang unik menggunakan timestamp
    const filename = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`
    const storageRef = ref(storage, `${folder}/${filename}`)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on(
      'state_changed',
      snapshot => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        )
        onProgress(percent)
      },
      error => reject(error),
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
        resolve(downloadURL)
      }
    )
  })
}

/**
 * Hapus file dari Firebase Storage berdasarkan URL-nya
 * @param {string} url - Download URL dari file yang akan dihapus
 */
export async function deleteImage(url) {
  try {
    const fileRef = ref(storage, url)
    await deleteObject(fileRef)
  } catch (err) {
    // File mungkin sudah tidak ada, abaikan error
    console.warn('deleteImage: file not found or already deleted', err)
  }
}
