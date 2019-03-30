const express = require('express');
const website = process.env.website || '.';
const app = express();

app.use(express.static(website));
app.get('*', (req, res) => {
  res.sendFile('index.html', { root: website });
});

const port = process.env.port || '80';
app.listen(port, () => console.log(`app running on port ${port}`));
