import { QueryResult } from './types'

export default async function measure(
  label: string,
  cb: () => Promise<any>
): Promise<QueryResult> {
  const startTime = performance.now()
  await cb()
  const endTime = performance.now()

  const elapsedTime = endTime - startTime

  console.log(`${label}: ${elapsedTime}ms`)

  return {
    query: label,
    time: elapsedTime
  }
}
