const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('creator', 'username email')
      .populate('assignedUser', 'username email');
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description, status, assignedUser } = req.body;
    
    let targetAssignee = null;
    if (req.user.role === 'admin') {
      targetAssignee = assignedUser || null;
    } else {
      if (assignedUser && assignedUser !== req.user.id) {
        return res.status(403).json({ error: 'Normal users can only assign tasks to themselves.' });
      }
      targetAssignee = assignedUser === req.user.id ? req.user.id : null;
    }

    const task = await Task.create({
      title,
      description,
      status: status || 'To Do',
      creator: req.user.id,
      assignedUser: targetAssignee
    });

    const populatedTask = await Task.findById(task._id)
      .populate('creator', 'username email')
      .populate('assignedUser', 'username email');

    res.status(201).json(populatedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, assignedUser } = req.body;
    const task = await Task.findById(id);

    if (!task) return res.status(404).json({ error: 'Task not found.' });

    if (req.user.role !== 'admin') {
      if (assignedUser !== undefined) {
        if (task.assignedUser && task.assignedUser.toString() !== req.user.id) {
          return res.status(403).json({ error: 'Cannot modify assignment of tasks assigned to other users.' });
        }
        if (assignedUser !== req.user.id && assignedUser !== null) {
          return res.status(403).json({ error: 'Normal users can only assign tasks to themselves.' });
        }
      }
    }

    task.title = title !== undefined ? title : task.title;
    task.description = description !== undefined ? description : task.description;
    task.status = status !== undefined ? status : task.status;
    if (assignedUser !== undefined) {
      task.assignedUser = assignedUser;
    }

    await task.save();
    
    const updatedTask = await Task.findById(task._id)
      .populate('creator', 'username email')
      .populate('assignedUser', 'username email');

    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ error: 'Task not found.' });

    if (req.user.role !== 'admin' && task.creator.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to delete this task.' });
    }

    await task.deleteOne();
    res.status(200).json({ message: 'Task deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};