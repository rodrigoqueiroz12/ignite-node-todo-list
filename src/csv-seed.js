import fs from "node:fs/promises"
import { parse } from "csv"
import { log } from "node:console";

const databasePath = new URL('../tasks.csv', import.meta.url);

(async () => {
  const csvContentBuffer = await fs.readFile(databasePath)
  const csvContent = csvContentBuffer.toString()
  const parser = parse(csvContent)

  let isFirstIteration = true;

  for await (const record of parser) {
    if (isFirstIteration) {
      isFirstIteration = false
      continue
    }

    const data = {
      title: record[0],
      description: record[1]
    }

    await fetch("http://localhost:3333/tasks", {
      method: "POST",
      body: JSON.stringify(data)
    })
  }
})()