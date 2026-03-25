import './style.css'

class TodoApp {
  constructor() {
    this.tasks = this.loadTasks()
    this.taskInput = document.getElementById('taskInput')
    this.addBtn = document.getElementById('addBtn')
    this.tasksList = document.getElementById('tasksList')

    this.init()
  }

  init() {
    this.addBtn.addEventListener('click', () => this.addTask())
    this.taskInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.addTask()
    })

    this.render()
  }

  loadTasks() {
    const stored = localStorage.getItem('tasks')
    return stored ? JSON.parse(stored) : []
  }

  saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks))
  }

  addTask() {
    const text = this.taskInput.value.trim()

    if (!text) return

    const task = {
      id: Date.now(),
      text: text,
      completed: false,
      createdAt: new Date().toISOString()
    }

    this.tasks.unshift(task)
    this.saveTasks()
    this.taskInput.value = ''
    this.render()
  }

  toggleTask(id) {
    const task = this.tasks.find(t => t.id === id)
    if (task) {
      task.completed = !task.completed
      this.saveTasks()
      this.render()
    }
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter(t => t.id !== id)
    this.saveTasks()
    this.render()
  }

  editTask(id) {
    const taskElement = document.querySelector(`[data-id="${id}"]`)
    const textElement = taskElement.querySelector('.task-text')
    const actionsElement = taskElement.querySelector('.task-actions')

    const currentText = textElement.textContent

    textElement.innerHTML = `<input type="text" class="task-text-input" value="${currentText}" maxlength="200">`
    const input = textElement.querySelector('.task-text-input')
    input.focus()
    input.select()

    actionsElement.innerHTML = `
      <button class="btn-save">Guardar</button>
      <button class="btn-cancel">Cancelar</button>
    `

    const saveBtn = actionsElement.querySelector('.btn-save')
    const cancelBtn = actionsElement.querySelector('.btn-cancel')

    saveBtn.addEventListener('click', () => {
      const newText = input.value.trim()
      if (newText) {
        this.updateTask(id, newText)
      } else {
        this.render()
      }
    })

    cancelBtn.addEventListener('click', () => this.render())

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const newText = input.value.trim()
        if (newText) {
          this.updateTask(id, newText)
        }
      }
    })
  }

  updateTask(id, newText) {
    const task = this.tasks.find(t => t.id === id)
    if (task) {
      task.text = newText
      this.saveTasks()
      this.render()
    }
  }

  formatDate(isoString) {
    const date = new Date(isoString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Ahora mismo'
    if (diffMins < 60) return `Hace ${diffMins} min`
    if (diffHours < 24) return `Hace ${diffHours}h`
    if (diffDays < 7) return `Hace ${diffDays}d`

    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  render() {
    if (this.tasks.length === 0) {
      this.tasksList.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📋</div>
          <div class="empty-state-text">No hay tareas. ¡Agrega una para empezar!</div>
        </div>
      `
      return
    }

    this.tasksList.innerHTML = this.tasks.map(task => `
      <div class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
        <div class="task-header">
          <input
            type="checkbox"
            class="task-checkbox"
            ${task.completed ? 'checked' : ''}
            data-action="toggle"
          />
          <div class="task-content">
            <div class="task-text">${this.escapeHtml(task.text)}</div>
            <div class="task-date">${this.formatDate(task.createdAt)}</div>
          </div>
          <div class="task-actions">
            <button class="btn-edit" data-action="edit">Editar</button>
            <button class="btn-delete" data-action="delete">Eliminar</button>
          </div>
        </div>
      </div>
    `).join('')

    this.tasksList.querySelectorAll('[data-action]').forEach(el => {
      el.addEventListener('click', (e) => {
        const action = e.target.dataset.action
        const taskItem = e.target.closest('.task-item')
        const id = parseInt(taskItem.dataset.id)

        if (action === 'toggle') this.toggleTask(id)
        if (action === 'edit') this.editTask(id)
        if (action === 'delete') this.deleteTask(id)
      })
    })
  }

  escapeHtml(text) {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }
}

new TodoApp()
