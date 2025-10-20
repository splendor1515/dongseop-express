import express from 'express';
import tasks from './mock.js';
const PORT = 3000;
const app = express();

app.get('/', (req, res) => {
  res.send('Hello Express');
});

app.get('/tasks', (req, res) => {
  const sort = req.query.sort;
  const count = Number(req.query.count);

  const compareFn = sort === 'oldest' ? (a, b) => a.createdAt - b.createdAt : (a, b) => b.createdAt - a.createdAt;
  let newTasks = tasks.sort(compareFn);
  if (count) {
    newTasks = newTasks.slice(0, count);
  }
  res.send(tasks);
});
app.listen(PORT, (err) => {
  console.log(`Server Started on ${PORT}`);
  console.log(err);
});
