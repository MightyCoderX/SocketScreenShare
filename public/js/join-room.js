const txtRoomId = document.getElementById('txtRoomId');
const btnJoinRoom = document.getElementById('btnJoinRoom');

btnJoinRoom.addEventListener('click', e =>
{
    window.open(`${location.href}/${txtRoomId.value}`, '_self');
});

