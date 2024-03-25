const express = require('express')
const router = express.Router()

const Task = require('../models/task')

const {
    handleGetAllTask, 
    handleCreateNewTask, 
    handleUpdateTask, 
    handleDeleteTask, 
    handleGetTaskById,
} = require('../controllers/task')


router.route('/:id')
    .get(handleGetTaskById)
    .delete(handleDeleteTask)

router.route('/')
    .get(handleGetAllTask)
    .post(handleCreateNewTask)
    .patch(handleUpdateTask)


    module.exports = router;