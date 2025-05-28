const http = require('http');
const { execSync } = require('child_process'); // Importa execSync

const hostname = '0.0.0.0';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Olá do container Node.js rodando como nao-root!\n');
});

server.listen(port, hostname, () => {
  console.log(`Servidor rodando em http://${hostname}:${port}/`);

  // Tentar obter o nome do usuário de forma mais confiável
  let currentUser = 'desconhecido';
  try {
    currentUser = execSync('whoami', { encoding: 'utf-8' }).trim();
  } catch (error) {
    // console.error("Erro ao obter nome do usuário:", error.message);
  }
  console.log(`Processo rodando como usuário: ${currentUser}`);
});