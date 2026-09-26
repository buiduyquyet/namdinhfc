'use client'

import React, { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

interface ImportResult {
  success: boolean
  error?: string
  totalRows?: number
  inserted?: number
  /** Chỉ có ở những endpoint ghi đè bản ghi cũ (VD: import đội bóng). */
  updated?: number
  skipped?: { rowNumber: number; name: string }[]
  errors?: { rowNumber: number; message: string }[]
}

interface ImportExcelButtonProps {
  /** Endpoint POST nhận `FormData` có field `file`. */
  endpoint: string
  /** Endpoint GET trả file .xlsx mẫu. */
  templateHref: string
  /** Tên bản ghi để ghép vào câu thông báo, VD: "cầu thủ". */
  itemLabel: string
  /** Lý do một dòng bị bỏ qua, hiện trong phần tóm tắt. */
  skipReason?: string
}

/**
 * Nút "Import từ Excel" dùng chung cho các collection có endpoint import riêng.
 * Style viết inline vì component này chạy trong admin của Payload — nơi không
 * dùng design system ở `app/globals.css`.
 */
const ImportExcelButton = ({
  endpoint,
  templateHref,
  itemLabel,
  skipReason = 'trùng tên',
}: ImportExcelButtonProps) => {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setLoading(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch(endpoint, { method: 'POST', body: formData })
      const data: ImportResult = await res.json()
      setResult(data)

      if (data.success && (data.inserted || data.updated)) {
        router.refresh()
      }
    } catch (err: unknown) {
      setResult({ success: false, error: err instanceof Error ? err.message : String(err) })
    } finally {
      setLoading(false)
      // Cho phép chọn lại đúng file vừa import
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div style={{ marginBottom: '1rem', padding: '0 1.25rem' }}>
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'end', alignItems: 'center' }}>
        {/* Đây là route handler trả file .xlsx, không phải page — phải dùng <a> để trình duyệt tải về */}
        <a href={templateHref} style={{ fontSize: '0.85rem', textDecoration: 'underline' }}>
          Tải file Excel mẫu
        </a>

        <button
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          style={{
            background: loading ? '#94a3b8' : '#059669',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            transition: 'background 0.2s',
          }}
        >
          {loading ? 'Đang import...' : 'Import từ Excel'}
        </button>

        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>

      {result && (
        <div
          style={{
            marginTop: '0.75rem',
            padding: '0.75rem 1rem',
            borderRadius: '6px',
            fontSize: '0.85rem',
            border: `1px solid ${result.success ? '#10b981' : '#ef4444'}`,
          }}
        >
          {!result.success && <strong style={{ color: '#ef4444' }}>Lỗi: {result.error}</strong>}

          {result.success && (
            <>
              <strong>
                Đọc {result.totalRows} dòng — thêm mới {result.inserted} {itemLabel}
                {result.updated !== undefined && `, cập nhật ${result.updated}`}, bỏ qua{' '}
                {result.skipped?.length ?? 0}, lỗi {result.errors?.length ?? 0}.
              </strong>

              {!!result.skipped?.length && (
                <p style={{ margin: '0.5rem 0 0' }}>
                  Bỏ qua vì {skipReason}: {result.skipped.map((item) => item.name).join(', ')}
                </p>
              )}

              {!!result.errors?.length && (
                <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.25rem', color: '#ef4444' }}>
                  {result.errors.map((item) => (
                    <li key={item.rowNumber}>
                      Dòng {item.rowNumber}: {item.message}
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default ImportExcelButton
