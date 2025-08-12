import http from "http";

const server = http.createServer((req, res) => {
  console.log("req.url =>", req.headers);
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Check the terminal to see the URL!");
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
