'use client'

import React from 'react'

import ImportExcelButton from '@/components/admin/ImportExcelButton'

const ImportPlayersButton = () => (
  <ImportExcelButton
    endpoint="/api/import-players"
    templateHref="/api/import-players/template"
    itemLabel="cầu thủ"
    skipReason="đã tồn tại / trùng tên"
  />
)

export default ImportPlayersButton
