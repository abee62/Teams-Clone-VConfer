# VCONFER 

This is a video calling and text chatting web app built using WebRTC. It has been made as a part of Microsoft Enagage 2021 program. [Link](https://microsoft.acehacker.com/engage2021/index.html).

The task was to build a Microsoft Teams clone. 
It is hosted on heroku. [Link](https://vconfer-chat.herokuapp.com/)

### Technologies used

* WebRTC
* Node.js.
* React on client side
* Socket.io

### Features

1. Video Audio communication and connects two users
2. Text chatting
3. Toggle video
4. Toggle audio
5. Screen sharing

## Getting Started
Needs two terminals running to get this going. There is an express and socket.io server for the backend. There is a client side with react application bootstarpped to it.

In the development mode, server side runs on [http://localhost:8000](http://localhost:8000) and client side on [http://localhost:3000](http://localhost:3000).

### Installing dependencies
* Run **`yarn`** on root of the application folder.
* Go to client directory and run **`yarn`** command.

### To get it running:
* Run **`node server.js`** on the root side in one terminal
* Run **`yarn start`** on the client directory in another terminal 

Data channel in WebRTC is used for text chatting
