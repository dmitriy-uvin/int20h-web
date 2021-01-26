# Test Task for Int20h - #Web

### Installation

```
git clone https://github.com/dmitriy-uvin/int20h-web
cd int20h-web
```

### Local
```
./build.sh
OR
cd client
npm install && npm run build
cd ..
npm install
npm run start
```
App will be available at http://localhost:3333

### Docker
```
docker build -t <username>/node-app .
docker run -p {your-local-port}:3333 -d <username>/node-app
```
App will be available at http://localhost:{your-local-port}

### Heroku app
[Int20h Web](https://int20h-web-docker.herokuapp.com/)
