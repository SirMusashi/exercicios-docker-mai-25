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

---

### 3. Iniciar um container da imagem ubuntu com um terminal interativo (bash). Navegue pelo sistema de arquivos e instale o pacote curl utilizando apt.

## 3.1 iniciando o Ubunto interativo:
* A primeira coisa é utilizar o seguinte comando no terminal:
```bash
docker run -it ubuntu bash
```
* ``-it`` é uma combinação de duas flags:
    * ``-i``(interactive) Mantém o STDIN aberto mesmo se não estiver anexado.
    * ``-t``(tty) Aloca um pseudo-TTY. O que permite ter uma experiência de um terminal iterativo.

* ``Ubuntu`` : É a imagem que o docker vai usar nesse caso.
* ``bash``: É o comando que será executado dentro do container assim que ele iniciar, isso faz abrir um terminal bash  dentro do container.

Após a execução do comando o ``prompt de comando`` ficou assim:

![Prompt_para_bash](imagens/exercicio_03_01.png)

A linha final escrita ``root@7dd8e6fa9ee4:/#`` indica que já estamos dentro do terminal do container ``Ubuntu``.

## 3.2 - instalando o pacote curl
Antes de instalar qualquer pacote com o comando ``apt``, a boa prática é sempre atualizar a lista de pacotes para garantir que a instalação sera feita nas versoes mais recentes do sistema.
* utilizaza o comando:
```bash
apt update
```
o resultado após esse comando é:

![POS_APT_UPDATE](imagens/exercicio_03_02.png)

a ultima linha indicando ``ALL packages are up to date.`` indica que as atualizações foram realizadas.

Após isso podemos instalar o ``curl`` com o comando:

```bash
apt install curl -y
```
* ``-y``: Responde automaticamente "sim" a quaisquer prompts de confirmação necessários na instalação.

Após a conclusão da instalação, o ``curl`` estará disponível ddentro do container. O ideal é verificar a instalação com o comando:
```bash
curl --version
```
* ``--version``: Verifica a existência do pacote instalado e sua versão.

O resultado confirmando a instalação é o seguinte:

![RESULTADO_CURL_INSTALADO](imagens/exercicio_03_03.png)

Com isso finaliza a realização do exercício proposto.

---

### 4. Suba um container do MySQL (pode usar a imagem mysql:5.7), utilizando um volume nomeado para armazenar os dados. Crie um banco de dados, pare o container, suba novamente e verifique se os dados persistem.

## 4.1 Subir o Container MySQL com um volume nomeado
* Criando um volume nomeado: pesquisando descobri que ``volumes nomeados`` são a forma preferencial de persistir dados no ``Docker``, porque são gerenciados pelo mesmo e são faceis de se fazer backup e migrar.
O comando utilizado foi:
```bash
docker volume create mysql_data_volume
```
isso criou um volume chamado ``mysql_data_volume``

![DATA_VOLUME_CONFIRM](imagens/exercicio_04_01.png)

* O próximo passo foi iniciar o Cainter MySQL, montando o volume nomeado e definindo uma senha para o usuário ``root``:
```bash
docker run -d `
  --name meu_mysql_bd `
  -p 3306:3306 `
  -e MYSQL_ROOT_PASSWORD=minhasenha `
  -v mysql_data_volume:/var/lib/mysql `
  mysql:5.7
```
* ``-d``: executa o container em segundo plano.
* ``--name meu_mysql_bd``: atribui um nome  ao container.
* ``-p 3306:3306``: mapeia a porta 3306 do host para a porta 3006 do container.
* ``-e MYSQL_ROOT_PASSWORD=minhasenha``: define a senha do usuário ``root`` do MySQL(O ideal seria substituir o campo ``minhasenha`` por uma senha forte, mas como é somente um exercício deixei assim para facilitar.)
* ``-v mysql_data_volume:/var/lib/mysql``: monta o volume nomeado ``mysql_data_volume`` dentro do diretório ``/var/lib/mysql`` dentro do container, aonde o MySQL armazena seus dados.
* ``mysql:5.7`` indica a imagen MySQL a ser utilizada pelo docker.

após isso verifiquei se a imagem estava criada com o comando:
```bash
docker images
```
e pude verificar q estava criada com a versão correta:

![CONFIRMA_MYSQL](imagens/exercicio_04_02.png)

## 4.2 acessando o MySQL e criando um Banco de Dados

* primeiro usei o cliente ``mysql`` que veio junto com a imagem do container
```bash
docker exec -it meu_mysql_bd mysql -u root -p
```
* ``docker exec -it meu_mysql_bd``:abre um terminal interativo no container ``meu_sql_bd``.
* ``mysql -u root -p``: executa o cliente MySQL com o usuário ``root`` e solicita senha, no caso usei a senha ``minhasenha`` que eu tinha mencionado anterioromente.

![MYSQL_TERMINAL](imagens/exercicio_04_03.png)

* Após isso foi criar um banco de dados dentro do prompt MySQL:
```SQL
CREATE DATABASE meu_banco_de_dados;
```
E verifiquei se o banco de dados foi realmente criado
```SQL
SHOW DATABASES;
```

![BANCO_DE_DADOS_CRIADO](imagens/exercicio_04_04.png)

Com o ``meu_banco_de_dados`` criado, foi só sair do cliente MySQL com o comando:
```SQL
exit;
```
## 4.3 parando o container
* Aqui utilizei  a linha de código para parar o container MySQL:
```Bash
docker stop meu_mysql_bd
```
Isso parou o container, mas o volume nomeado ``mysql_data_volume`` e os dados dentro dele vão permanecer.

* Verifiquei se o container foi realmente parado com o comando:
```Bash
docker ps -a
```

![Mysql_parado](imagens/exercicio_04_05.png)

Ele está lá listado como ``Exited``, o que diz que foi parado.

## 4.4 subindo o container de novo e verificando a persistencia dos dados

* iniciei novamente o container MySQL:
```Bash
docker start meu_mysql_bd
```

Como o volume já tinha sido nomeado pude chamar direto pelo seu nome.

* acessei o terminal do MySQL de novo:
```Bash
docker exec -it meu_mysql_bd mysql -u root -p
```

* dentro do prompt MySQL verifiquei se o banco de dados criado ainda existia:
```SQL
SHOW DATABASES;
```

![BANCO_DE_DADOS_PERSISTE](imagens/exercicio_04_06.png)

Com isso deu pra constatar a persistencia do Banco de dados no container!

---

### 5. Crie um container com a imagem alpine passando uma variável de ambiente chamada MEU_NOME com seu nome. Execute o container e imprima o valor da variável com o comando echo.

## 5.1 Criando o Dockerfile.
Utilizei os seguintes parâmetros dentro do ``Dockerfile``:
```Dockerfile
FROM alpine:3.21.3

ENV MEU_NOME="Bruno Duarte"

CMD ["sh", "-c", "echo Olá, $MEU_NOME!"]
```
* ``ENV``
: Define uma variável de ambiente padrão.
## 5.2 Construindo a imagem Docker:
* No terminal estando no mesmo diretório que eu salvei o ``Dockerfile`` utilizei a seguinte linha de código:
```Bash
docker build -t alpine-diz-nome .
```
* Em seguinda rodei um comando para verificar se a imagem foi criada:
```Bash
docker images
```
![IMAGEM_CRIADA](imagens/exercicio_05_01.png)

## 5.3 Executando o container

* Utilizei o comando:
```Bash
docker run --rm alpine-diz-nome
```
E observei se o resultado era o esperado:

![RESULTADO](imagens/exercicio_05_02.png)

Tudo certo como esperado!

---
### 6. Utilize um multi-stage build para otimizar uma aplicação Go, reduzindo o tamanho da imagem final. Utilize para praticar o projeto [GS PING](https://github.com/docker/docker-gs-ping) desenvolvido em Golang.

## 6.1 Clonando o repositório
* Fiz um ``git clone`` para clonar o repositório em questão:

```Bash
git clone https://github.com/docker/docker-gs-ping.git
```

Dentro do diretório em questão já havia um ``Dockerfile`` que estava da seguinte forma:

```Dockerfile
# syntax=docker/dockerfile:1

FROM golang:1.19

# Set destination for COPY
WORKDIR /app

# Download Go modules
COPY go.mod go.sum ./
RUN go mod download

# Copy the source code. Note the slash at the end, as explained in
# https://docs.docker.com/engine/reference/builder/#copy
COPY *.go ./

# Build
RUN CGO_ENABLED=0 GOOS=linux go build -o /docker-gs-ping

# To bind to a TCP port, runtime parameters must be supplied to the docker command.
# But we can (optionally) document in the Dockerfile what ports
# the application is going to listen on by default.
# https://docs.docker.com/engine/reference/builder/#expose
EXPOSE 8080

# Run
CMD [ "/docker-gs-ping" ]

```

## 6.2 Alterando o dockerfile

* Fiz algumas alterações no ``Dockerfile`` para ficar desta forma, e renomeei o antigo para ``dockerfileOLD``:

```Dockerfile
FROM golang:1.22 AS builder

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN CGO_ENABLED=0 go build -o ping ./...

FROM scratch

WORKDIR /app

COPY --from=builder /app/ping .

EXPOSE 8080

ENTRYPOINT ["./ping"]
```

* ``FROM golang:1.22 AS builder`` :Usa uma imagem ``Go`` de um tamanho suficiente para poder compilar a aplicação
* ``WORKDIR`` :Define o diretório de trabalho dentro do container.
* ``RUN go mod download`` :Baixa as dependências do ``Go``.
* ``RUN CGO_ENABLED=0 go build -o ping ./...`` : Constroi o executável e cria um binário estaticamente linkado, sem dependências externas do ``C``. O ``-o ping`` define o nome do executável final como "ping". O ``./...`` compila todos os pacotes ``Go`` no diretório atual e subidiretórios.
* ``FROM scratch`` : ``scratch`` é a imagem mais básica que não contém nada além do kernel do ``Linux``.
* ``COPY --from=builder /app/ping .`` : Copia o executável ``ping`` do estágio ``builder`` para o estágio final.
* ``EXPOSE 8080`` : Expõe a porta que a aplicação ``Go`` vai usar, em padrão.
* ``ENTRYPOINT ["./ping"]`` : Define o comando que será executado quando o container iniciar.

## 6.3 Construindo a imagem no docker

* utilizei o seguinte comando para contrução da imagem:
```Bash
docker build -t go-ping-otimizado .
```

* Após a construção da imagem utilizei para verificar o tamanho da imagem o seguinte comando:

```Bash
docker images go-ping-otimizado
```
* O resultado foi uma imagem com menos de ``10MB`` :
![IMAGENS_OTIMIZADAS_GO](imagens/exercicio_06_01.png)

## 6.3 Executando o container da aplicação otimizada
* Para executar o container utilizei o seguinte código:
```Bash
docker run -p 8080:8080 --name ping-app go-ping-otimizado
```
* Após a execução foi só abrir o navegador em http://localhost:8080 e conferir se estava tudo correto:

    ![CONFERENCIA_EX_6](imagens/exercicio_06_02.png)

Tudo certo!

---

### 7. Crie uma rede Docker personalizada e faça dois containers, um Node.js e um MongoDB, se comunicarem, sugestão, utilize o projeto React Express + Mongo

## 7.1 Clonando o projeto base

* A primeira coisa que fiz foi clonar o repositório base e acessar a pasta específica do projeto com os comandos:

```Bash
git clone https://github.com/docker/awesome-compose.git
cd awesome-compose/react-express-mongodb
```

## 7.2 Analisando o "docker compose"

* Dentro da pasta já havia um ``docker-compose.yml`` e ele estava assim:

```YAML
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      MONGO_URI: mongodb://database:27017/mydatabase 
    depends_on:
      - database
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
  database:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

* Estudando um pouco, entendi que o ``Docker Compose`` já cria uma rede padrão para todos os serviços. Mas também descobri que uma boa prática para clareza e controle é adicionar uma rede Explícita.

## 7.3 Adicionando a Rede Explícita ao "docker compose"
* O primeiro passo foi renomear o antigo arquivo para ``compose.OLD.
* Após isso criar um novo ``docker-compose.yml`` adicionando algumas informações :

```YAML
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      MONGO_URI: mongodb://database:27017/mydatabase 
    depends_on:
      - database
    networks:
      - app_network 

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
    networks:
      - app_network 

  database:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    networks:
      - app_network 

volumes:
  mongodb_data:

networks:
  app_network: 
    driver: bridge
    name: minha_rede_customizada 
```

* Eu adcionei uma seção ``networks:`` ao final, definindo ``app_network`` como uma rede do tipo ``bridge`` e dei um nome para ela. Além disso adicionei em cada serviço a diretiva ``networks:`` apontando para o ``app_network``.

## 7.4 Construindo e subindo os containers
* Utilizei a seguinte linha de comando para subir os containers:
```Bash
docker-compose up --build
```
* ``up`` :Cria e inicia os containers.
* ``--build`` : Faz com que as imagens que vem do ``frontend`` e ``backend`` sejam reconstruiídas caso haja alguma alteração.

## 7.5 Verificando a rede criada

* Para verificar a rede criada utilizei o comando:
```Bash
docker network ls
```
E ela estava lá:

![REDE_DOCKER](imagens/exercicio_07_01.png)

* Para inspecionar a rede eu utilizei o seguinte comando:

```Bash
docker network inspect minha_rede_customizada
```
* Com isso consigo ver uma seção containers que contem os serviços conectados a rede.

![Containers_conectados](imagens/exercicio_07_02.png)

* Após isso foi só entrar no http://localhost:3000/ e testar a applicação:
![APLICACAO_FUNCIONANDO](imagens/exercicio_07_03.png)

Tudo certo!

---

### 8. Utilize Docker Compose para configurar uma aplicação com um banco de dados PostgreSQL, use para isso o projeto https://github.com/docker/awesome-compose/tree/master/postgresql-pgadmin

## 8.1 Clonando o repositório

* Primeiro passo foi clonar o repositório e ir para a pasta destino:

```Bash
git clone https://github.com/docker/awesome-compose.git
cd awesome-compose/postgresql-pgadmin
```

## 8.2 Analisando o compose.yaml

* O arquivo compose.yml está dessa forma

```YAML
services:
  postgres:
    container_name: postgres
    image: postgres:latest
    environment:
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PW}
      - POSTGRES_DB=${POSTGRES_DB} #optional (specify default database instead of $POSTGRES_DB)
    ports:
      - "5432:5432"
    restart: always

  pgadmin:
    container_name: pgadmin
    image: dpage/pgadmin4:latest
    environment:
      - PGADMIN_DEFAULT_EMAIL=${PGADMIN_MAIL}
      - PGADMIN_DEFAULT_PASSWORD=${PGADMIN_PW}
    ports:
      - "5050:80"
    restart: always
```

* o arquivo está usando ``$VARIAVEIS_DE_AMBIENTE``, ao invés de usar valor fixos, com isso o ``Docker Compose`` procura automaticamente um arquivo ``.env`` no mesmo diretório, para poder carregar essa variáveis.

## 8.3 Verificando e modificando o arquivo ".env"

* O arquivo ``.env`` veioo dessa forma
```Snippet
POSTGRES_USER=yourUser
POSTGRES_PW=changeit
POSTGRES_DB=postgres
PGADMIN_MAIL=your@email.com
PGADMIN_PW=changeit
```
* preenchi com dados aleatórios por estar somente em ambiente de teste, mas o ideal em ambiente profissional é usar ``senhas fortes`` e ``e-mails`` que você realmente usa


## 8.4 Incrementando o compose com volume para persistencia de dados

* Adicionei algumas linhas ao código do ``compose.yml`` para criar uum volume e adicionar persistencia de dados ao PostgreSQL:

```YAML
services:
  postgres:
    container_name: postgres
    image: postgres:latest
    environment:
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PW}
      - POSTGRES_DB=${POSTGRES_DB}
    ports:
      - "5432:5432"
    restart: always
    volumes: # <-- 
      - db_data:/var/lib/postgresql/data # <-- 

  pgadmin:
    container_name: pgadmin
    image: dpage/pgadmin4:latest
    environment:
      - PGADMIN_DEFAULT_EMAIL=${PGADMIN_MAIL}
      - PGADMIN_DEFAULT_PASSWORD=${PGADMIN_PW}
    ports:
      - "5050:80"
    restart: always
    
    depends_on:
      - postgres # <--

volumes: # <-- 
  db_data: # <-- 
```
* também foi adicionado um ``depends_on`` para garantir que o pgAdmin se conecte ao nome do serviço ``postgres``

## 8.5 Construindo e subindo os containers

* Para subir os containers utilizei a linha de comando:

```BASH
docker-compose up -d
```

## 8.6 acessando o pgAdmin:

Após os containers subirem, abri o navegador e entrei no http://localhost:5050 o que deu pra essa tela:

![TELA_LOCALHOST](imagens/exercicio_08_01.png)

* Após entrar com as credenciais que foram modificadas no ``.env`` nos levou pra essa tela aqui:

![TELA_LOGADA_PGADMIN](imagens/exercicio_08_02.png)

## 8.7 Conectando o pgAdmin ao Banco de Dados PostgreSQL:

* o primeiro passo foi clicar na opção ``Add New Server`` e colocar na aba General um nome para um novo banco de dados:

![IMAGEM_GENERAL](imagens/exercicio_08_03.png)

* logo em seguida cliquei na aba ``Conection`` e coloquei o o ``host name`` como ``postgres`` que é o nome que está no ``compose.yml``.
  * ``Host name`` : postgres
  * ``Port`` : 5432 que é a porta padrão do PostgreSQL
  * ``Username`` : o modificado no ``.env``
  * ``Password`` : o modificdao também no ``.env``

Ficou assim:

![IMAGEM_CONECTION](imagens/exercicio_08_04.png)

## Com a conexão bem sucedida foi só conferir se o banco de dados tinha sido criado

![BANCO_DE_DADOS](imagens/exercicio_08_05.png)

Tudo certo!

---

### 9.Construa uma imagem baseada no Nginx ou Apache, adicionando um site HTML/CSS estático. Utilize a landing page do Creative Tim para criar uma página moderna hospedada no container

## 9.1 Primeiros passos

* Primeiro eu clonei o repositório com o comando:
```Bash
git clone https://github.com/creativetimofficial/material-kit.git material-kit-html
```
* Após isso criei um ``Dockerfile`` com a seguinte configuração:

  ```Dockerfile
  FROM nginx:1.27.5

  RUN rm -rf /etc/nginx/conf.d/*

  COPY ./material-kit-html /usr/share/nginx/html

  EXPOSE 80

  CMD ["nginx", "-g", "daemon off;"]
  ```
  * ``RUN rm -rf /etc/nginx/conf.d/*`` : Limpa as configurações padrão do ``Nginx`` para evitar conflitos ou servir páginas não desejadas.
  * ``COPY . /usr/share/nginx/html`` : Copia todo o conteúdo clonado para o diretório padrão aonde o ``Nginx`` procura encontrar os arquivos do site.
  * ``CMD ["nginx", "-g", "daemon off;"]`` : Define o container para iniciar o servidor ``Nginx`` em primeiro plano.

## 9.2 Construindo a imagem e rodando o container

* Para construir a imagem eu utilizei a linha de comando:
  ```Bash
  docker build -t meu-site-material-kit .
  ```

* Após isso coloquei o container para rodar com o comando:
  ```Bash
  docker run -d -p 80:80 --name material-kit-site meu-site-material-kit
  ```

## 9.3 Passos finais

* Após isso foi conferir se o container estava rodando no ``Rancher Desktop``

  ![CONTAINER_RODANDO](imagens/exercicio_09_01.png)

* Com tudo certo foi só abrir o navegador em http://localhost e conferir o resultado:

  ![LOCALHOST_RODANDO](imagens/exercicio_09_02.png)

A página não estava aparecendo

## 9.4 Resolução

* Após quebrar um pouco a cabeça descobri ao utilizar o comando ``RUN rm -rf /etc/nginx/conf.d/*`` no ``Dockerfile`` , ele removeu todos os arquivos de configuração incluindo o arquivo ``default.conf`` que serve para servir a porta ``80`` do Nginx, a solução foi criar um arquivo separado e incluir um ``COPY`` no ``Dockerfile``, e mover o mesmo para a pasta raiz do exercício para resolução:

  * ``default.conf`` ficou assim:
    
    ```Nginx
    server {
      listen 80; 
      server_name localhost;

      root /usr/share/nginx/html; 
      index index.html index.htm; 

      location / {
        try_files $uri $uri/ =404; 
      }
    }
    ```
  * Como o ``Dockerfile`` mudou de pasta , isso exigiu modificações para que ficasse assim:

    ```Dockerfile      
      FROM nginx:1.27.5

      RUN rm -rf /etc/nginx/conf.d/*

      COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf 

      COPY ./material-kit-html /usr/share/nginx/html

      EXPOSE 80

      CMD ["nginx", "-g", "daemon off;"]
    ```

* Após isso foi só fazer a build da imagem novamente e colocar o container pra rodar e o resultado foi esse:
  ![CORRIGIDO](imagens/exercicio_09_03.png)


### Tudo certo agora! :)

---

### 10. Ao rodar containers com o usuário root, você expõe seu sistema a riscos maiores em caso de comprometimento. Neste exercício, você deverá criar um Dockerfile para uma aplicação simples (como um script Python ou um servidor Node.js) e configurar a imagem para rodar com um usuário não-root. Você precisará:
### a. Criar um usuário com useradd ou adduser no Dockerfile.
### b. Definir esse usuário como o padrão com a instrução USER.
### c. Construir a imagem e iniciar o container.
### d. Verificar se o processo está rodando com o novo usuário usando docker exec container whoami.


## 10.1 Primeiros passos

* A primeira coisa que eu fiz foi procurar uma aplicação simples em Node.js já pronta:

  * Conteúdo de ``app.js``:

    ```JavaScript
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
      ```
  * Conteúdo de ``package.json`` :
    
    ```JSON
    {
      "name": "simple-node-app",
      "version": "1.0.0",
      "description": "A simple Node.js app to demonstrate non-root user in Docker",
      "main": "app.js",
      "scripts": {
        "start": "node app.js"
      },
      "keywords": [],
      "author": "",
      "license": "ISC"
    }
    ```


* Após isso feito, o próximo passo foi configurar um ``Dockerfile``:

```Dockerfile       
FROM node:lts-alpine

RUN addgroup -S appgroup && adduser -S bruno -G appgroup

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN chown -R bruno:appgroup /usr/src/app

USER bruno

EXPOSE 3000

CMD [ "npm", "start" ]
```

  * ``RUN addgroup -S appgroup && adduser -S bruno -G appgroup`` : Cria um grupo de sistema chamado ``appgroup`` e também cria um usuário de sistema chamado ``bruno``, além de o adicionar ao ``appgroup``.
  * ``RUN chown -R appuser:appgroup /usr/src/app`` : O ``chown`` aqui serve para alterar com o ``-R`` recursivamente o proprietário das copias para o usuário e o ``appgroup``.



## 10.2 Construindo a imagem e iniciando o container:

* Para construir a imagem:
  ```Bash
  docker build -t app-nao-root .
  ```

* Iniciando o container:
  ```bash
  docker run -d -p 3000:3000 --name container-nao-root app-nao-root
  ```

## 10.3 Verificando se está tudo certo

* Primeiro passo foi executar o ``whoami`` :

  ```bash
  docker exec container-nao-root whoami
  ```

    ![WHOAMI](imagens/exercicio_10_01.png)

* O segundo foi conferir os logs do container:

  ```bash
  docker logs container-nao-root
  ```

    ![LOGS](imagens/exercicio_10_02.png)

## Tudo certo (:

### 11. Trivy é uma ferramenta open source para análise de vulnerabilidades em imagens Docker. Neste exercício, você irá analisar uma imagem pública, como python:3.9 ou node:16, em busca de vulnerabilidades conhecidas. Você deverá:
### a. Instalar o Trivy na sua máquina (via script ou pacote).

### b. Rodar trivy image <nome-da-imagem> para analisar.

### c. Identificar vulnerabilidades com severidade HIGH ou CRITICAL.

### d. Anotar os pacotes ou bibliotecas afetadas e sugerir possíveis ações (como atualização da imagem base ou substituição de dependências).

## 11.1 Primeiros passos

* O primeiro passo foi instalar o ``Trivy`` via terminal com o comando:

```bash
winget install AquaSecurity.Trivy
```
* Em seguida reiniciar o terminal e para confirmar a instalação utilizar o comando:

```bash
trivy --version
```

``RESULTADO`` : ![TRIVY_INSTALADO](imagens/exercicio_11_01.png)

## 11.2 Analisando a imagem do python:3.9

* Aqui o primeiro passo foi utilizar o comando:

```bash
trivy image python:3.9
```

Assim o ``Trivy`` vai baixar os bancos de dados de vulnerabilidades e em seguida vai escanear a imagem.

``Resultado: `` ![RESULTADO_TRIVY](imagens/exercicio_11_02.png)

* 3 vulnerabilidades com severidade ``HIGH`` foram encontradas.

## 11.3 Sugestões de possíveis melhorias

* O ideal, caso essa imagem esteja sendo usada em um container do Docker seria atualizar a imagem para uma versão mais segura/estável.
* Caso a etapa anterior não seja viável o ideal seria atualizar o ``setuptools`` para uma versão mais recente e mais estável, já que é aonde a maioria das vulnerabilidades com severidade ``HIGH`` se encontra.
* Atualizar a versão do ``pip`` também seria uma boa ideia e sanaria a vulnerabilidade de severidade ``MEDIUM``.
* Revisão contínua, como implementar um processo de escaneamento de vulnerabilidade no pipeline de CI/CD para detectar e remediar problemas precocemente.

---

### 12.Após identificar vulnerabilidades com ferramentas como o Trivy, o próximo passo é corrigi-las. Imagens grandes e genéricas frequentemente trazem bibliotecas desnecessárias e vulneráveis, além de usarem o usuário root por padrão. Neste exercício, você irá trabalhar com um exemplo de Dockerfile com más práticas e aplicar melhorias para construir uma imagem mais segura e enxuta. Identifique as melhorias e gere uma nova versão de Dockerfile.

### Dockerfile vulnerável: 
```Dockerfile
FROM python:3.9
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "app.py"]
```

### requeriments.txt
```TXT
flask==1.1.1
```
### app.py
```python
from flask import Flask 
app = Flask(__name__) 
@app.route("/") 
def hello_world(): 
  return "<p>Hello, World!</p>"
```
---

## 12.1 Problemas e melhorias

1 - ``FROM python:3.9`` :
  * ``Problema`` : A imagem é grande e genérica, baseada em um sistema operacional completo, inclui muitas bibiliotecas e ferramentas que não são necessárias para executar uma aplicação ``Flask`` simples.
  * ``Melhoria`` : Usar uma imagem ``slim`` ou ``alpine`` para reduzir o tamanho da imagem e a superfício de ataque.

2 - `` RUN pip install -r requirements.txt`` :
  * ``Problema`` : Este comando instala as dependências, mas se o ``pip cache`` não for limpo o tamanho da imagem final pode ficar comprometido.
  * ``Melhoria`` : Adicionar uma flas ``--no-cache-dir`` para o ``pip install`` para evitar que o cache dos pacotes seja armazenado na imagem.

3 - ``COPY . .`` :
  * ``Problema`` : Copia todo o conteúdo do diretório para a imagem, incluindo arquivos que não são necessários para a aplicação.
  * ``Melhoria`` : Usar um arquivo ``.dockerignore`` para excluir arquivos e diretórios desnecessários. Além de copiar apenas arquivos necessário para a aplicação.

4 - Execução com ``root`` :
  * ``Problema`` : Isso é uma má prática de segurança, pois se houver vulnerabilidade na aplicação, o atacante tem acesso total ao sistema de arquivos do container e pode até conseguir acesso ao host.
  * ``Melhoria`` : Criar um usuário ``não root`` e executar a aplicação com esse usuário.

5 - ``Multi-stage builds`` :
  * ``Problema`` : Para aplicações maiores ou com dependências de compilação, um único estágio pode levar a imagens com tamanho grande.
  * ``Melhoria`` : implementar o ``Multi-stage`` para usar uma imagem de construção com as ferramenas de compilação e, em seguida, copiar apenas os artefatos compilados para uma imagem de execução limpa e mínima.

## 12.2 Dockerfile melhorado:

* Após as considerações e propostas de melhorias o dockerfile ficou assim:

```Dockerfile
FROM python:3.9-slim-buster AS builder

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

FROM python:3.9-slim-buster

WORKDIR /app

COPY --from=builder /usr/local/lib/python3.9/site-packages /usr/local/lib/python3.9/site-packages
COPY --from=builder /usr/local/bin/flask /usr/local/bin/flask
COPY --from=builder /usr/local/bin/gunicorn /usr/local/bin/gunicorn

COPY app.py .

RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser
USER appuser

EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"] 
```

* Foi também implemetado a pasta do projeto um arquivo ``.dockerignore`` que ficou assim:

```dockerignore
.git
.gitignore
__pycache__
*.pyc
*.log
.DS_Store
venv/
env/
```

* Foi adicionado o ``Gunicorn`` ao ``requirements.txt``

### RESULTADO:
![IMAGEM](imagens/exercicio_11_03.png)

![IMAGEM_2](imagens/exercicio_11_04.png)
### Assim a aplicação ficou com a construção mais rápida, tamanho reduzido e muito mais segura (:

---


### 13.Crie um Dockerfile que use a imagem python:3.11-slim, copie um script Python local (app.py) e o execute com CMD. O script pode imprimir a data e hora atual.

### a. Crie uma conta no Docker Hub.

### b. Faça login pelo terminal com docker login.

### c. Rebuild sua imagem meu-echo e a renomeie no formato seu-usuario/meu-echo:v1.

### d. Faça o push da imagem para o Docker Hub.

---

## 13.1 Primeiros passos

* Criando a conta no ``Docker Hub`` :

  * Acessar o https://hub.docker.com/ e clicar em sign up ou sign in(caso você já tenha conta) :
    ![Dockerhub](imagens/exercicio_13_01.png)

* Com a conta criada para fazer login pelo terminal digite:
  ```Bash
  docker login
  ```

    ![DOCKERLOGIN](imagens/exercicio_13_02.png)

* Preparar os arquivos para fazer um build de imagem
  * O primeiro passo foi criar um arquivo chamado ``app.py`` na pasta raiz com o seguinte conteúdo:
    ```Python
    import datetime

    def main():
    print(f"A data e hora atual é: {datetime.datetime.now()}")

    if __name__ == "__main__":
        main()  
    ```
  * Em seguida criar o ``Dockerfile`` também na pasta raiz:

    ```Dockerfile    
    FROM python:3.11-slim

    WORKDIR /app

    COPY app.py .

    CMD ["python", "app.py"]
    ```

* Após isso foi buildar a imagem pela primeira vez:
  ```Bash
  docker build -t meu-echo .
  ```

## 13.2 Rebuild e push para o docker hub

* Para Rebuildar a imagem utilizei o meu ``nome de usuário`` e adicionei o numero da versão do container:
  ```Bash
  docker tag meu-echo brunomusashiduarte/meu-echo:v1
  ```
  * utilizando o ``docker images`` se consegue ver o resultado
    ![resultado_images](imagens/exercicio_13_03.png)

* Rodando o container com o comando:
  ```Bash
  docker run brunomusashiduarte/meu-echo:v1
  ```
    ![container_rodando](imagens/exercicio_13_04.png)

* Após confirmar a funcionalidade do container é só usar o comando push para subir para o ``Docker hub``:
  	```Bash
    docker push brunomusashiduarte/meu-echo:v1
    ```

### RESULTADO :
![docker_hub_01](imagens/exercicio_13_05.png)

![docker_hub_01](imagens/exercicio_13_06.png)

## Tudo certo (:

## Esse foi o fim dos 13 exercícios propostos pelo programa Scholarship da Compass UOL!