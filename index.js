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
app.use(cors());
const io = new Server(server);
server.listen(PORT, () => {
    console.log('app dang chay')
});

let userArray = [];
io.on('connection', (socket) => {
    console.log(`${socket.id} is connected!!!`);
    socket.on('client-send-username', (data) => {
        if (userArray.includes(data)) {
            socket.emit('server-send-register-fail');
        } else {
            userArray.push(data);
            socket.Username = data;
            socket.emit('server-send-register-success', data);
            io.sockets.emit('server-send-list-user', userArray);
        }
    })

    socket.on('is-typing', () => {
        const s = `${socket.Username} is typing`;
        io.sockets.emit('someone-is-typing', s);
    })

    socket.on('stop-typing', () => {
        io.sockets.emit('someone-stop-typing');
    })

    socket.on('client-send-message', (message) => {
        io.sockets.emit('server-send-message', { username: socket.Username, message });
    })

    socket.on('logout', () => {
        userArray = userArray.filter(user => socket.Username !== user);
        socket.broadcast.emit('server-send-list-user', userArray);
    })
    // socket.on('send', (data) => {
    //     //io.sockets.emit('Server-send-data', data);
    //     //socket.emit('Server-send-data', data);
    //     socket.broadcast.emit('Server-send-data', data);
    // })
    socket.on('disconnect', () => {
        console.log(`${socket.id} disconnected!!!`);
        userArray = userArray.filter(user => socket.Username !== user);
        io.sockets.emit('server-send-list-user', userArray);
    })
})

app.get('/', (req, res) => {
    res.render('home');
})

