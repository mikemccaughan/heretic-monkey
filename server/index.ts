const express = require('express');
const website = process.env.website || require('path').resolve('../dist');
const app = express();
console.log(website);
app.use(express.static(website));
app.get('*', (req, res) => {
  res.sendFile('index.html', { root: website });
});

const port = process.env.port || '8118';
app.listen(port, () => console.log(`app running on port ${port}`));
