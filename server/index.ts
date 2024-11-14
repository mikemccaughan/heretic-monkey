import express from 'express';
import path from 'node:path';
const website = process.env.website || path.resolve('../dist/browser');
const app = express();
console.log(website);
app.use(express.static(website));
app.get('*', (req, res) => {
  res.sendFile('index.html', { root: website });
});

const port = process.env.port || '8118';
app.listen(port, () => console.log(`app running on port ${port}; http://localhost:${port}/`));
