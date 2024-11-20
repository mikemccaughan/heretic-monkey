import express from 'express';
import path from 'node:path';
import os from 'node:os';
const website = process.env.website || path.resolve('../dist/browser');
const app = express();
const hostname = os.hostname();
console.log(website);
app.use(express.static(website));
app.get('*', (req, res) => {
  res.sendFile('index.html', { root: website });
});

const port = process.env.PORT || '8118';
const scheme = '' + port === '443' ? 'https' : 'http';
app.listen(port, () => console.log(`app running on port ${port}; ${scheme}://${hostname}:${port}/`));
