
const Task = require('../models/task')

async function handleGetAllTask(req, res){
    const allTasksFromDB =  await  Task.find({})
    return res.json({ status: true, message: "Task fetched", "tasks": allTasksFromDB })
}

async function handleGetTaskById(req,res) { 
    const task  = await Task.findById(req.params.id)
    if(!task) return res.status(404).json({ status: true, message: "Task not found" })
    return res.status(200).json({ status: true, message: "Task fetched", task: task });

}

async  function handleCreateNewTask(req,res) {
    const task = req.body

    const result = await Task.create({
        title: task.title,
        isCompleted: task.isCompleted
    })

    if(!result) return res.status(500).json({ status: false, message: "Something went wrong" });

    return res.status(201).json({ status: true, message: "Task added" });

}

async function handleUpdateTask(req, res) {

    const id = req.body.id;
    const task = req.body;

    await Task.findByIdAndUpdate(id, {title:task.title,isCompleted: task.isCompleted})
    return res.status(200).json({ status: true, message: "Task updated" });

   // return res.status(500).json({ status: false, message: "Something went wrong!" });
}

async  function handleDeleteTask(req, res) {
    // Delete task from MongoDB
    const result = await Task.findByIdAndDelete(req.params.id)
    if (!result) return res.status(404).json({ status: false, message: 'No such task exists' }) 
    return res.status(200).json({ status: true, message: "Task deleted" });
}

module.exports = {
    handleGetAllTask, 
    handleCreateNewTask, 
    handleUpdateTask,
    handleDeleteTask, 
    handleGetTaskById,
}