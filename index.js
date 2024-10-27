require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require("dns");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

let urls = [];

app.post("/api/shorturl", (req, res) => {
  // console.log( req.body.url );
  try {
    const inputUrl = new URL(req.body.url); 
    const hostname = inputUrl.hostname;
    // console.log(inputUrl);

    dns.lookup(hostname, (err, data) => {
      if (err) {
        console.log("Error at post request:", err.message, req.body);
        return res.json({ error: "invalid url" }); // Ensure to return here
      }

      let id = urls.length + 1;
      urls.push({ id: id, url: req.body.url });
      return res.json({ original_url: req.body.url, short_url: id.toString() }); // Ensure to return here
    });
  } catch (error) {
    console.log("Error parsing URL:", error.message);
    return res.json({ error: "invalid url" }); // Handle invalid URL format
  }
});

app.get("/api/shorturl/:short_url", (req, res) => {
  let urlFind = urls.find(item => item.id === parseInt(req.params.short_url));
  res.redirect(urlFind.url);
})

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
