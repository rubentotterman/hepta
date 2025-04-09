export async function fetchCSV(url: string): Promise<string> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch CSV: ${response.statusText}`)
  }
  return await response.text()
}

export function parseCSV(csvText: string): Array<Record<string, string>> {
  const lines = csvText.split("\n")
  const headers = lines[0].split(",").map((header) => header.trim())

  return lines
    .slice(1)
    .filter((line) => line.trim() !== "")
    .map((line) => {
      const values = line.split(",").map((value) => value.trim())
      return headers.reduce(
        (obj, header, index) => {
          obj[header] = values[index] || ""
          return obj
        },
        {} as Record<string, string>,
      )
    })
}

