# Exercícios Docker
Este repositório contém os comandos e prints necessários para evidenciar a execução da lista de exercícios propostos com Docker.
---
### 1. Olá, Docker!

Criei um arquivo `Dockerfile` usando a imagem **alpine** como base para imprimir "Olá, Docker!". Em seguida, construí a imagem com o nome `meu-echo` e executei um container a partir dela.

**Dockerfile:**

```dockerfile
#Dockerfile
FROM alpine:3.21.3
CMD echo "Olá, Docker!"
```

**Resultado:**
![Exercício 01](imagens/exercicio_01.png)

---
### 2. Nginx com Página Customizada 

Configurei um container Nginx para servir uma página HTML customizada (index.html). Montei um volume local para garantir que o arquivo aparecesse na raiz do site (/usr/share/nginx/html). Acessível via http://localhost.

### 2.1 
A primeira parte foi fazer uma página `HTML` customizada! Este arquivo substituirá a página padrão `Welcome to Nginx!`.

**Estrutura HTML**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bem-vindo ao Nginx com Docker!</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; background-color: #f0f0f0; }
        h1 { color: #333; }
        p { color: #666; }
       .container { background-color: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); display: inline-block; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Esse é um Contêiner Nginx Customizado!</h1>
        <p>Esta página está sendo servida por um Nginx rodando em Docker, com conteúdo montado via volume.</p>
        <p>Acesso via <code>http://localhost</code></p>
    </div>
</body>
</html>
```
Este arquivo ``index.html`` será montado na raiz web padrão do contêiner Nginx, efetivamente substituindo o conteúdo padrão original do contêiner.

## 2.2  Criando o Dockerfile
Criei um ``Dockerfile`` na mesma pasta do ``index.html`` e adicionei o seguinte conteúdo a ele:

```Dockerfile
FROM nginx:1.27.5
COPY index.html /usr/share/nginx/html/index.html
```
Explicação:

* ``FROM nginx:1.27.5``: Esta linha instrui o Docker a usar a imagem oficial do Nginx como base para a sua nova imagem.

* ``COPY index.html /usr/share/nginx/html/index.html``: Esta linha copia o seu arquivo index.html (que está no mesmo diretório do Dockerfile) para o diretório /usr/share/nginx/html dentro da imagem Docker. Este é o local padrão onde o Nginx procura por arquivos HTML para servir.   

## 2.3 Montando a imagem

* Para montar a imagem usei a linha de comando:
```Bash
docker build -t meu-nginx-customizado .
```

* Após isso, conferi no terminal se o arquivo ``index.html`` tinha sido movido para a pasta correta.

![Conferir terminal](imagens/exercicio_02_01.png)

## 2.4 Executando o contêiner

* Para executar o contêiner utilizei a linha de comando:
```
docker run -d --name meu-nginx-web -p 80:80 meu-nginx-customizado
```
* ``-d`` para o processo rodar em segundo plano e eu continuar tendo acesso ao meu terminal.
* ``--name`` para dar um nome ao ao meu contêiner.
* ``-p`` para mapear as portas do host/contêiner, feito na porta 80 para ter acesso pelo http://localhost .

## Processo feito, foi só entrar no navegador e ver o resultado:
![Resultado](imagens/exercicio_02_02.png)
