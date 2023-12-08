# Video-streaming-backend

#### Authentication and uploading videos and processing videos.

## Tech Stack

![Node.js](https://img.shields.io/badge/Node.js-%3E?style=for-the-badge&logo=Node.js&logoColor=white)
&nbsp;&nbsp;![Express.js](https://img.shields.io/badge/Express.js-%5E4.17.1-000000?style=for-the-badge&logo=Express.js-%5E4.17.1-000000&logoColor=white)
&nbsp;&nbsp;![MongoDB](https://img.shields.io/badge/MongoDB-%5E4.4.4-47A248?style=for-the-badge&logo=MongoDB-%5E4.4.4-47A248&logoColor=white)
&nbsp;&nbsp;![Mongoose](https://img.shields.io/badge/Mongoose-%5E6.0.9-880B6E?style=for-the-badge&logo=Mongoose-%5E6.0.9-880B6E&logoColor=white)
&nbsp;&nbsp;![Docker](https://img.shields.io/badge/Docker-Latest-2496ED?style=for-the-badge&logo=Docker-Latest-2496ED&logoColor=white)

### Installing

A step by step series of examples that tell you how to get a development environment running:

1. Clone the repository

```
git clone https://github.com/harun-rucse/video-streaming-backend.git
```

2. Install dependencies

```
yarn
```

3. Start the development server

```
yarn dev
```

## Run Docker in development

```
docker-compose -f docker-compose.dev.yml up -d --build
```

## Run Docker in production

```
docker-compose -f docker-compose.prod.yml up -d --build
```

## Built With

- [Node.js](https://nodejs.org/) - The JavaScript runtime used on the back-end
- [MongoDB](https://www.mongodb.com/) - The database used to store data
- [Express](https://expressjs.com/) - The back-end web framework used to build the API
