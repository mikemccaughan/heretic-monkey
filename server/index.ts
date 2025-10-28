import express from 'express';
import path from 'node:path';
import os from 'node:os';
const website = process.env.website || path.resolve('../dist/browser');
const app = express();
const host = os.hostname();
app.use(express.static(website));
app.get('/#/{*splat}', async (req: { params: { splat: string; }}, res) => {
  console.log(req.params.splat, 'good');
  res.sendFile(`index.html/#/${req.params.splat}`, { root: website });
});
app.get('/{*splat}', async (req: { params: { splat: string; }}, res) => {
  console.log(req.params.splat, 'bad');
  res.sendFile('index.html', { root: website });
});

const port = process.env.PORT || '8118';
const scheme = '' + port === '443' ? 'https' : 'http';
app.listen(port, () => console.log(`app running on port ${port}; ${scheme}://${host}:${port}/`));
