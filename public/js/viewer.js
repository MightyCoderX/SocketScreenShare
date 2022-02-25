const socket = io(location.origin);

const player = document.getElementById('player');
const pStreamClose = document.getElementById('streamClose');

socket.emit('joinRoom', ROOM_ID);

socket.on('desktopStream', image =>
{
    player.src = image;
});

socket.on('streamClose', () =>
{
    window.open('/view', '_self');
});