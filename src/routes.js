import { randomUUID as uuid } from "node:crypto" 
import { Database } from "./database.js"
import { buildRoutePath } from "./utils/build-route-path.js"

const database = new Database

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { search } = req.query

      const tasks = database.select("tasks", search ? {
        title: search,
        description: search
      } : null)
      
      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body

      if (!title || !description) return res.writeHead(400).end()

      database.insert("tasks", {
        id: uuid(),
        title,
        description,
        completedAt: null
      })

      return res.writeHead(201).end()
    } 
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body
      const task = database.select("tasks").find(task => task.id === id)

      if (!task) return res.writeHead(404).end(JSON.stringify({
        message: "Task not found or doesn't exist."
      }))

      if (!title || !description) return res.writeHead(400).end()

      database.update("tasks", id, {
        title,
        description
      })

      return res.writeHead(204).end()
    }
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      const { id } = req.params
      const task = database.select("tasks").find(task => task.id === id)

      if (!task) return res.writeHead(404).end(JSON.stringify({
        message: "Task not found or doesn't exist."
      }))

      database.update("tasks", id, {
        completedAt: task.completedAt ? null : new Date().toISOString()
      })

      return res.writeHead(204).end()
    }
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params
      const task = database.select("tasks").find(task => task.id === id)

      if (!task) return res.writeHead(404).end(JSON.stringify({
        message: "Task not found or doesn't exist."
      }))

      database.delete("tasks", id)

      return res.writeHead(204).end()
    }
  }
]