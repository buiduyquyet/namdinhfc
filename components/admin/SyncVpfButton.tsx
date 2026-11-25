'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

import type { VpfSyncResult } from '@/lib/vpf-sync'

interface SyncVpfButtonProps {
  /** Đặt ở đầu trang danh sách (beforeList) thì cần lề ngang như các nút Import. */
  inList?: boolean
}

/**
 * Nút "Đồng bộ từ VPF ngay" — dùng ở Cấu hình trang và đầu danh sách Trận đấu.
 * Style inline bằng biến CSS theme của Payload vì component chạy trong admin,
 * nơi không dùng design system ở `app/globals.css`.
 */
const SyncVpfButton = ({ inList = false }: SyncVpfButtonProps) => {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<VpfSyncResult | null>(null)
  const router = useRouter()

  const handleClick = async () => {
    setLoading(true)
    setResult(null)

    try {
      const res = await fetch('/api/cron/sync-vpf', { method: 'POST' })
      const data: VpfSyncResult = await res.json()
      setResult(data)
      // Nạp lại để thấy trận / log mới
      router.refresh()
    } catch (err: unknown) {
      setResult({ success: false, error: err instanceof Error ? err.message : String(err) })
    } finally {
      setLoading(false)
    }
  }

  const color = result?.success ? 'var(--theme-success-500)' : 'var(--theme-error-500)'

  return (
    <div
      style={{
        margin: inList ? '0 0 1rem' : '0 0 1.5rem',
        padding: inList ? '0 1.25rem' : 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: inList ? 'end' : 'start',
        gap: '0.5rem',
      }}
    >
      <div>
        <button
          type="button"
          onClick={handleClick}
          disabled={loading}
          style={{
            background: 'var(--theme-elevation-800)',
            color: 'var(--theme-elevation-0)',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            fontWeight: 600,
          }}
        >
          {loading ? 'Đang lấy dữ liệu từ VPF...' : 'Đồng bộ từ VPF ngay'}
        </button>
      </div>

      {result && (
        <p style={{ margin: 0, fontSize: '0.85rem', color }}>
          {result.success ? result.message : `Lỗi: ${result.error}`}
        </p>
      )}
    </div>
  )
}

export default SyncVpfButton
