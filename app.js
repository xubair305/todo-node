const express = require('express')
const tasks = require('./task_data.json')
const logUser = require('./logger')
const fs = require('fs')
const app = express()
const port = 3000


// middleware for parsing URL-encoded data 
app.use(express.json());
app.use(express.urlencoded({ extended: false }))


// Custom middleware - Log rest api
app.use(logUser)

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/api/tasks', (req, res) => {
        return res.json({ "tasks": tasks })
    }
)


app.route('/api/task/:id')
    .get((req, res) => {
        const id = Number(req.params.id)
        const task = tasks.find((task) => task.id === id)
        return res.json({ "task": task })
    }
    )

app.post('/api/task', (req, res) => {
    const task = req.body
    tasks.push({ "id": tasks.length + 1, ...task })
    fs.writeFile('./task_data.json', JSON.stringify(tasks), (err, data) => {
        console.log(err);
        if (!err) {
            return res.status(200).json({ status: true, message: "Task added" });
        } else {
            return res.status(500).json({ status: false, message: "Something went wrong" });
        }
    })
})

app.listen(port, () => console.log(`TODO app listening on port ${port}!`))