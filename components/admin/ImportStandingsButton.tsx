'use client'

import React from 'react'

import ImportExcelButton from '@/components/admin/ImportExcelButton'

const ImportStandingsButton = () => (
  <ImportExcelButton
    endpoint="/api/import-standings"
    templateHref="/api/import-standings/template"
    itemLabel="đội"
  />
)

export default ImportStandingsButton
