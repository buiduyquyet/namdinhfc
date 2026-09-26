'use client'

import React from 'react'

import ImportExcelButton from '@/components/admin/ImportExcelButton'

const ImportClubsButton = () => (
  <ImportExcelButton
    endpoint="/api/import-clubs"
    templateHref="/api/import-clubs/template"
    itemLabel="đội bóng"
    skipReason="trùng tên ngay trong file"
  />
)

export default ImportClubsButton
