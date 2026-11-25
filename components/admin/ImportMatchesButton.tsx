'use client'

import React from 'react'

import ImportExcelButton from '@/components/admin/ImportExcelButton'

const ImportMatchesButton = () => (
  <ImportExcelButton
    endpoint="/api/import-matches"
    templateHref="/api/import-matches/template"
    itemLabel="trận"
    skipReason="không có gì thay đổi"
  />
)

export default ImportMatchesButton
