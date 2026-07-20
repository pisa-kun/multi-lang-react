const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 4000;
const dataPath = path.join(__dirname, 'user-settings.json');

app.use(cors());
app.use(express.json());

function readSettings() {
  const raw = fs.readFileSync(dataPath, 'utf-8');
  return JSON.parse(raw);
}

function writeSettings(settings) {
  fs.writeFileSync(dataPath, JSON.stringify(settings, null, 2), 'utf-8');
}

app.post('/api/login', (req, res) => {
  res.json({ success: true, userId: 'sample-user' });
});

app.get('/api/user-settings', (req, res) => {
  try {
    const settings = readSettings();
    res.json(settings.user);
  } catch (error) {
    res.status(500).json({ error: 'Unable to read user settings.' });
  }
});

app.post('/api/user-settings', (req, res) => {
  try {
    const current = readSettings();
    const next = {
      ...current,
      user: {
        ...current.user,
        ...req.body,
      },
    };
    writeSettings(next);
    res.json(next.user);
  } catch (error) {
    res.status(500).json({ error: 'Unable to save user settings.' });
  }
});

const publicPath = path.join(__dirname, '../dist');
if (fs.existsSync(publicPath)) {
  app.use(express.static(publicPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
