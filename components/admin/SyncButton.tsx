'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SyncButton() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSync = async () => {
    setLoading(true)
    setMessage('')
    try {
      const res = await fetch('/api/sync-players')
      const data = await res.json()
      if (data.success) {
        setMessage(`Đồng bộ thành công! Thêm mới: ${data.inserted}, Cập nhật: ${data.updated} cầu thủ. Tải lại trang...`)
        setTimeout(() => {
          router.refresh()
        }, 2000)
      } else {
        setMessage(`Lỗi: ${data.error}`)
      }
    } catch (err: any) {
      setMessage(`Lỗi hệ thống: ${err.message}`)
    }
    setLoading(false)
  }

  return (
    <div style={{ marginBottom: '2rem', padding: '1.25rem', borderRadius: '8px', display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
      <button
        onClick={handleSync}
        disabled={loading}
        style={{
          background: loading ? '#94a3b8' : '#2563eb',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontWeight: 'bold',
          transition: 'background 0.2s',
        }}
      >
        {loading ? 'Đang đồng bộ...' : 'Chạy Đồng Bộ Ngay'}
      </button>

      {/* {message && (
        <p style={{ marginTop: '1rem', marginBottom: 0, color: message.startsWith('Lỗi') ? '#ef4444' : '#10b981', fontWeight: '600' }}>
          {message}
        </p>
      )} */}
    </div>
  )
}
