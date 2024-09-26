import http from 'http';
import dotenv from 'dotenv';

dotenv.config();

const server = http.createServer(async (req, res) => {
  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify({message: 'hello'}));

    res.end();
    return;
  }

  res.writeHead(404, {'Content-Type': 'application/json'});
  res.end(JSON.stringify({message: 'nope'}));
});

const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log(`server on ${PORT}`);
});
