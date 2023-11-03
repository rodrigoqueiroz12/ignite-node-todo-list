import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf8').then(data => {
      this.#database = JSON.parse(data)
    }).catch(() => {
      this.#persist()
    })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  select(table, search) {
    let data = this.#database[table] ?? []

    if (search) {
      data = data.filter(row => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase())
        })
      })
    }

    return data
  }

  insert(table, data) {
    if (this.#database[table]) {
      this.#database[table].push({
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })

      this.#persist()

      return true
    } else {
      this.#database[table] = [{
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }]

      this.#persist()

      return true
    }
  }

  update(table, id, data) {
    if (!this.#database[table]) return false
    
    let rowIndex = this.#database[table].findIndex(row => {
      return row.id === id
    })

    if (rowIndex > -1) {
      const row = this.#database[table][rowIndex]
      const updatedRow = {
        ...row,
        ...data,
        updatedAt: new Date().toISOString()
      }

      this.#database[table][rowIndex] = updatedRow

      this.#persist()
      
      return true
    } else {
      return false
    }
  }

  delete(table, id) {
    if (!this.#database[table]) return false

    let rowIndex = this.#database[table].findIndex(row => {
      return row.id === id
    })

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1)

      this.#persist()
      
      return true
    } else {
      return false
    }
  }
}
