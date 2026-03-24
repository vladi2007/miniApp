import { safeRequest } from '../api'
import type { ReportData } from './reports.types'


// получить ссылку на сформированный отчёт (на S3)
export const postReport = async (reportData: ReportData): Promise<{ url: string, name: string }> =>
  safeRequest(async () => {
    const { $api } = useNuxtApp()
    const res = await $api.post(`/reports/export`, reportData)
    return res.data
  })