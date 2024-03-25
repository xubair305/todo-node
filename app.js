const express = require('express')
const mongoose = require('mongoose')
const logUser = require('./logger')
const customHeader = require('./custom_header')
const app = express()
const port = 3000


// Connection to mongoDB
mongoose.connect("mongodb://127.0.0.1:27017/todo-app",)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB', err))

// Create schema for mongoDb 
const taskScheme = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    isCompleted: {
        type: Boolean,
        required: true
    }
}, { timestamps: true })
let Task = mongoose.model('task', taskScheme);

// middleware for parsing URL-encoded data 
app.use(express.json());
app.use(express.urlencoded({ extended: false }))


// Custom middleware - Log rest api
app.use(logUser)
app.use(customHeader)

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/api/tasks', async (req, res) => {
    const allTasksFromDB =  await  Task.find({})
    return res.json({ status: true, message: "Task fetched", "tasks": allTasksFromDB })
}
)


app.route('/api/task/:id')
    .get( async (req, res) => {
        const task  = await Task.findById(req.params.id)
        if(!task) return res.status(404).json({ status: true, message: "Task not found" })
        return res.status(200).json({ status: true, message: "Task fetched", task: task });
    }
    )
    .delete( async (req, res) => {
        // Delete task from MongoDB
        const result = await Task.findByIdAndDelete(req.params.id)
        if (!result) return res.status(404).json({ status: false, message: 'No such task exists' }) 
        return res.status(200).json({ status: true, message: "Task deleted" });
    })

app.route('/api/task')
    .post(async (req, res) => {
        const task = req.body

        const result = await Task.create({
            title: task.title,
            isCompleted: task.isCompleted
        })

        if(!result) return res.status(500).json({ status: false, message: "Something went wrong" });

        return res.status(201).json({ status: true, message: "Task added" });

    })
    .patch( async (req, res) => {

        const id = req.body.id;
        const task = req.body;

        await Task.findByIdAndUpdate(id, {title:task.title,isCompleted: task.isCompleted})
        return res.status(200).json({ status: true, message: "Task updated" });

       // return res.status(500).json({ status: false, message: "Something went wrong!" });
        
    })

app.get("*", (req, res) => {
    res.status(501).send("PAGE NOT FOUND");
}
);

app.listen(port, () => console.log(`TODO app listening on port ${port}!`))