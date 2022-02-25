const http = require('http');
const express = require('express');
const { v4 : uuidV4 } = require('uuid');

const app = express();

const server = http.createServer(app);

const io = require('socket.io')(server);

const users = [];
const rooms = [];

server.listen(3000, () =>
{
    console.log('Listening at "http://localhost:3000/"...');
});

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/host', (req, res) =>
{
    res.redirect(`/host/${uuidV4()}`);
});

app.get('/host/:room', (req, res) =>
{
    const ip = req.connection.remoteAddress.split(':').splice(-1)[0];
    console.log('New User Streaming: ', ip);
    users.push(ip);
    rooms.push(req.params.room);
    res.render('host', { roomId: req.params.room });
});

app.get('/view', (req, res) =>
{
    res.render('join-room'); 
});

app.get('/view/:room', (req, res) =>
{
    const ip = req.connection.remoteAddress.split(':').splice(-1)[0];
    console.log('New User Viewing: ', ip);
    users.push(ip);

    if(!rooms.includes(req.params.room))
    {
        return res.redirect('/view');
    }

    res.render('viewer', { roomId: req.params.room });
});

io.on('connection', socket =>
{
    socket.on('joinRoom', roomId =>
    {
        socket.join(roomId);

        socket.on('desktopStream', image =>
        {
            socket.to(roomId).broadcast.emit('desktopStream', image);
        });

        socket.on('streamClose', () =>
        {
            socket.to(roomId).broadcast.emit('streamClose');
        });
    });
});
