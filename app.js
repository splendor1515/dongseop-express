import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { DATABASE_URL } from './constants.js';
import Task from './task.js';

const PORT = 3000;
const app = express();
app.use(cors());
app.use(express.json());

await mongoose.connect(DATABASE_URL);
app.post('/tasks', async (req, res) => {
  const newTask = await Task.create(req.body);
  res.send(newTask);

  res.status(201).send(newTask);
});
app.get('/tasks', async (req, res) => {
  /** 쿼리 목록
   *  - count: 아이템 개수
   *  - sort: 정렬
   */
  const count = Number(req.query.count) || 0;

  if (count === 0) {
    return res.json([]);
  }

  const sortOption = req.query.sort === 'oldest' ? ['createdAt', 'asc'] : ['createdAt', 'desc'];
  const tasks = await Task.find().limit(count).sort([sortOption]);
  res.send(tasks);
});
app.get('/tasks/:id', async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (task) {
    res.send(task);
  } else {
    res.status(404).send({ message: 'Cannot find given id' });
  }
});

app.patch('/tasks/:id', async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (task) {
    const { body } = req;
    Object.keys(body).forEach((key) => {
      task[key] = body[key];
    });
    await task.save();
    res.send(task);
  } else {
    res.status(404).send({ message: 'cannot find given id' });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (task) {
    res.sendStatus(200);
  } else {
    res.status(404).send({ message: 'cannot find given id' });
  }
});

app.listen(PORT, (err) => {
  console.log(`Server Started on ${PORT}`);
  console.log(err);
});
