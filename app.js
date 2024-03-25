const express = require('express')
const tasks = require('./task_data.json')
const logUser = require('./logger')
const customHeader = require('./custom_header')
const fs = require('fs')
const app = express()
const port = 3000


// middleware for parsing URL-encoded data 
app.use(express.json());
app.use(express.urlencoded({ extended: false }))


// Custom middleware - Log rest api
app.use(logUser)
app.use(customHeader)

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/api/tasks', (req, res) => {
    return res.json({status: true,message:"Task fetched", "tasks": tasks })
}
)


app.route('/api/task/:id')
    .get((req, res) => {
        const id = Number(req.params.id)
        const task = tasks.find((task) => task.id === id)
        return res.status(200).json({ status: true, message: "Task fetched", task: task });
    }
    )
    .delete((req, res) => {

        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ status: false, message: "Invalid ID provided" });
        }


        const index = tasks.findIndex((task) => {
            const taskId = parseInt(task.id)
            return taskId === id
        })

        if (index === -1) {
            return res.status(404).json({ status: false, message: "Record not found" });
        }
        const deleteTask = tasks.splice(index, 1)

        console.log(deleteTask)

        fs.writeFile('./task_data.json', JSON.stringify(tasks), (error) => {
            if (!error) {
                return res.status(200).json({ status: true, message: "Task deleted" });
            } else {
                return res.status(500).json({ status: false, message: "Something went wrong!" });
            }
        })

    })

app.route('/api/task')
    .post((req, res) => {
        const task = req.body
        tasks.push({ "id": tasks.length + 1, ...task })
        fs.writeFile('./task_data.json', JSON.stringify(tasks), (err, data) => {
            console.log(err);
            if (!err) {
                return res.status(201).json({ status: true, message: "Task added" });
            } else {
                return res.status(500).json({ status: false, message: "Something went wrong" });
            }
        })
    })
    .patch((req, res) => {

        const id = parseInt(req.body.id);
        if (isNaN(id)) {
            return res.status(400).json({ status: false, message: "Invalid ID provided" });
        }
        const updatedTask = { ...req.body }

        const index = tasks.findIndex((task) => {
            const taskId = parseInt(task.id)
            return taskId === id
        })

        if (index === -1) {
            return res.status(404).json({ status: false, message: "Record not found" });
        }

        tasks[index] = updatedTask;

        fs.writeFile('./task_data.json', JSON.stringify(tasks), (error) => {
            if (!error) {
                return res.status(200).json({ status: true, message: "Task updated" });
            } else {
                return res.status(500).json({ status: false, message: "Something went wrong!" });
            }
        })
    })

app.get("*", (req, res) => {
    res.status(501).send("PAGE NOT FOUND");
}
);

app.listen(port, () => console.log(`TODO app listening on port ${port}!`))