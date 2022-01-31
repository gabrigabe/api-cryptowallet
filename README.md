<p align="center"><h1 align="Center"> Api-CryptoWallets</h1></p>


<p  align  =  "center"><a href= https://www.typescriptlang.org/><img  src  ="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white"></a><a href = https://nodejs.org/en/></img>
<img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white"></img</a> <a href=https://nestjs.com/><img  src="https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white"></img></a> <a href=https://www.postgresql.org/><img  src  =  "https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white"> </img></a>
<a href = https://www.docker.com/><img src=https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white></a> <a href=https://choosealicense.com/licenses/mit/> <img  src  ="https://img.shields.io/github/license/Ileriayo/markdown-badges?style=for-the-badge"></img></a></p>

## Description

An api that use coin cotation api from [ AwesomeAPI](https://docs.awesomeapi.com.br/api-de-moedas) to get coins and cryptocoins cotation and covert to another coins and store these coins in a wallet that you can withdraw, deposit coins or transfer for another wallets and every operation generates a transaction with the value of transaction, current cotation of coin and the wallet address of sender/receiver

## Dependencies

  

* PostgresDB
* Node.JS
* Docker (Optional)
* Nest.js


## Installation

First, up your docker container with
```bash
$ docker-compose up -d
```
then install API dependencies
```bash
$ npm instal || yarn install
```
after this, run db migration
```bash
$ npm run migration:run || yarn migration:run
```
**Change db configs in ormconfig.json if you want

## Running the app

```bash
# Run Apllication
$ npm run start || yarn start

# Run in development mode
$ npm run start:dev || yart start:dev

```



## Stay in touch

- Author - Gabriel Bezerra Rodrigues
<p align=center><a href=https://www.linkedin.com/in/gabriel-be-zerra/><img src = https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white></a> <a href=https://github.com/gabrigabe><img src=https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white></a></p>

## License

[MIT](https://choosealicense.com/licenses/mit/).