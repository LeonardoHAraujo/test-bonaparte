# Teste técnico Bonaparte

Olá, primeiramente gostaria de agradecer a oportunidade e espero que goste do conteúdo desenvolvido,
pois foi com carinho e dedicação que realizei este teste.

## Bônus

Para melhor experiência com este projeto, tomei a liberdade de realizar o deploy
do mesmo em um `droplet` na `digital ocean`. Sendo assim, você poderá testar
os `endpoits` abaixo antes de rodar o projeto em sua máquina. Espero que goste.

```
GET - http://159.223.202.147
```

Resposta:

```
{
  "message": "Welcome Bonaparte!!!"
}
```

## Desafio

Então vamos lá! O desafio proposto era desenvolver uma api em Express com Typescript
e um banco de dados de minha escolha (MongoDB), com autenticação de rotas e com
testes unitários. A api deve ter os seguintes recursos:

- Cadastro de usuários.
- Busca de endereço por CEP.
- Login de usuário.
- Listagem de ﬁlmes.
- Detalhe de um ﬁlme.
- Edição de um ﬁlme.

### Cadastro de usuários

Para o cadastro de usuário era necessário os dados abaixo, sendo que as informações
de endereço devem ser complementadas através da api `ViaCEP`.

- nome
- data de nascimento
- e-mail
- logradouro
- número
- complemento
- bairro
- cidade
- estado
- senha

Então a partir disso foi disponibilizado um `endpoit` na api desenvolvida, que
por trás do panos consulta a api `ViaCEP` e cria um usuário em uma base de dados
`MongoDB` que funciona em um container em paralelo com o container da API.

Segue o `endpoit` e seu `payload`:

```
POST - /create-user

payload

{
	"name": "test",
	"birthDate": "30/05/1998",
	"email": "test@gmail.com",
	"password": "1234",
	"num": 22,
	"cep": "31573405",
	"complement": "casa"
}
```

Resposta:

```
{
	"status": 201,
	"message": "User created successfuly."
}

```

*Observação: Rota pública. (não necessita autenticação)*

### Busca de endereço por CEP

Conforme citado no `Cadastro de usuários` a comunicação com a api `ViaCEP` é
realizada por debaixo dos panos no momento da criação do usuário para complementar
os dados de endereço.

### Login de usuário

Na parte de `Login do usuário` foram disponibilizados dois `endpoits`,
um para login do próprio usuário que espera seu login e senha para te autenticar
e outro para a autenticação do `refresh_token`, afinal de contas a autenticação
via `JWT` trabalha assim e é uma ótima maneira de controlar acessos em uma api.

Segue o `endpoit` e seu `payload`:

```
POST - /auth

payload

{
	"email": "test@gmail.com",
	"password": "1234"
}
```

Resposta:

```
{
	"status": 201,
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NTMxM...",
	"refreshToken": {
		"expiresIn": 1653309919,
		"refreshTokenId": "6288dedff7ce73c671dbcd96"
	}
}
```

```
POST - /refresh-token

payload

{
	"refreshTokenId": "6288dedff7ce73c671dbcd96"
}
```
Resposta:

```
{
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NTMyN..."
}
```

*Observação: Rota pública. (não necessita autenticação)*

### Listagem de ﬁlmes

Para este `endpoit` tivemos a regra que o retorno de registros deve ser paginado,
sendo assim, disponibilizamos um `endpoit` que recebe dois paramenos `page` e `limit`.
O `endpoit` valida estes parâmetros, portanto não é possível retorno sem paginação.

Segue o `endpoit` e seu `payload`:

```
GET - /filmes?limit=5&page=1
```

Resposta:

```
{
	"status": 200,
	"movies": [
        ...
    ]
}
```

*Observação: Rota privada, portanto é necessário passar o `bearer token` via
requisição.*

### Detalhe de um ﬁlme

Para este caso disponibilizados um `endpoit` no qual você informa o `id` do
filme e o restornamos com todos os seus detalhes.

Segue o `endpoit` e seu `payload`:

```
GET - /filmes/{id}
```

Resposta:

```
{
	"status": 200,
	"movie": {
		"_id": "ObjectId",
		"tconst": "tt0000001",
		"titleType": "short",
		"primaryTitle": "Carmencita",
		"originalTitle": "Carmencita",
		"isAdult": "0",
		"startYear": "1894",
		"endYear": "\\N",
		"runtimeMinutes": "1",
		"genres": "Documentary,Short",
		"averageRating": "5.7",
		"numVotes": "1879"
	}
}
```

*Observação: Rota privada, portanto é necessário passar o `bearer token` via
requisição.*

### Edição de um ﬁlme

Para este recurso é também bem simples. Basta você informar o id no `endpoit` e
enviar um payload válido, para que possamos editar o filme existente.

Segue o `endpoit` e seu `payload`:

```
PUT - /filmes/{id}

payload

{
	"tconst": "tt0000001",
	"titleType": "short",
	"primaryTitle": "Carmencita",
	"originalTitle": "Carmencita",
	"isAdult": "0",
	"startYear": "1894",
	"endYear": "\\N",
	"runtimeMinutes": "1",
	"genres": "Documentary,Short",
	"averageRating": "5.7",
	"numVotes": "1879"
}
```

Resposta:

```
{
	"status": 200,
	"message": "Movie updated successfully."
}
```

*Observação: Rota privada, portanto é necessário passar o `bearer token` via
requisição. Além disso, todos os parâmetros do payload são opcionais.*

## Como rodar a API

Falar sobre as funcionalidades da api é muito bom, mas preciso te explicar
como rodar essa api. Então vamos la!

Antes de mais nada, preciso que você tenha em sua máquina três recursos muito
importantes para este projeto:

- [Docker](https://docs.docker.com/desktop/linux/install/)
- [Docker compose](https://docs.docker.com/compose/install/)
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#debian-stable)

Se está tudo certo com esses caras, vamos começar.

### Testes unitários

A aplicação está orquestrada pelo `docker-compose` porém preferi deixar a parte
de rodar os testes fora desta orquestração, porém como os testes precisam de um
banco de dados para rodarem certinhos, precisamos seguir os passos abaixo para
rodar os testes.

- Clone o repositório em sua máquina.
- Para instalar as dependências, rode o comando:
    - `yarn`
- Para levantar um banco MongoDB via docker, rode o comando:
    - `docker run -d -p 27017:27017 --name mongo-test mongo:latest`
- Renomeie o arquivo `.env.example` para `.env`, com o comando:
    - `mv .env.example .env`
- Enfim rode os testes e verifique se todos passaram, com o comando:
    - `yarn test`

### Rodando a API

Como já citado em `Testes unitários` a aplicação é orquestrada, sendo assim,
rodar a mesma é bem mais simples que o normal. Antes de seguir os passos, você
já deve ter notado que existem dois arquivo no diretório raiz da aplicação,
que são:

- `data.tsv`
- `data-r.tsv`

Estes arquivos são dois arquivos `tsv` disponibilizados pela `Bonaparte` que
contém dados de filmes em `data` e as notas dos respectivos filmes em `data-r`.
Os arquivos são para servir como fonte de dados para compor o projeto e
são menores que os originais, pois optei por não usar tantos filmes.

Quando a orquestração de containers é rodada, há uma migração que pega estes
arquivos, cruza os dados de `filmes` e `notas de filmes` e insere no banco MongoDB.

Sobre o arquivo `.env.example` (que você renomeou ou não para `.env`) contém
as informações necessárias para rodar o projeto. **Lembrando que não é a convenção
adequada subir informações sigilosas do projeto em nenhum `.env`**, porém como
se trata de um teste e eu não tinha como enviar as informações de outro jeito,
optei por fazer assim.

Contudo dito, vamos rodar a api:

- Entre no arquivo `.env` que você renomeou e troque a seguinte variável de ambiente:
    - De `ENVIRONMENT=dev` para `ENVIRONMENT=docker`
- Se você tiver rodado os testes, preciso parar o banco MongoDB que subiu no docker:
    - Rode `docker ps` e este comando vai listar o containers ativos.
    - Pegue o `id` do container mongo e rode `docker stop <id_container>`
- Agora basta rodar este comando para subir a orquestra de containers.
    - `docker-compose up --build -d`

Após isso a api estará rodando em `http://localhost:3333` e você poderá
testar os recursos.