import express from "express";
import http from 'http';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

//set view engine
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.static('./public'));
const io = new Server(server);
server.listen(PORT, () => {
    console.log('app dang chay')
});

io.on('connection', (socket) => {
    console.log(`${socket.id} connected!!!`);

    socket.on('send', (data) => {
        //io.sockets.emit('Server-send-data', data);
        //socket.emit('Server-send-data', data);
        socket.broadcast.emit('Server-send-data', data);
    })

    socket.on('disconnect', () => {
        console.log(`${socket.id} disconnected!!!`)
    })
})

app.get('/', (req, res) => {
    res.render('home');
})

