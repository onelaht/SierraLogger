# Sierra Chart Tagging and Logging

## Prerequisites  

### 1. Configure Go 
- https://go.dev/doc/install  

### 2. Configure NodeJS (npm)  
- https://nodejs.org/en/download/current  

## Development Build (Run server and client locally)

### 1. Download project repo  
- `git clone https://github.com/onelaht/LogApp.git`   

### 2. Install NPM dependencies  
- `cd LogApp && npm install`  

### 3. Install Go dependencies  
- `cd gin-server && go mod tidy && cd ..`  

### 4. Run backend server.  
- `npm run server`  

### 5. Run frontend/client (in a separate terminal)  
- `npm start` 
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.  

## Addition Information  

### `/sample-data`  
- Contains a Sierra Chart Log; used for upload testing