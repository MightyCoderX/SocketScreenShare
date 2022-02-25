const socket = io(location.origin);

const video = document.getElementById('video');
const canvas = document.getElementById('preview');
const context = canvas.getContext('2d');

socket.emit('joinRoom', ROOM_ID);

navigator.mediaDevices.getDisplayMedia(
{
    video: 
    { 
        mediaSource: 'screen',
        cursor: 'always',
        frameRate: 60.0
    },
    audio: 
    {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100
    }
})
.then(desktopStream => 
{
    const mediaStream = new MediaStream(desktopStream, {mimeType: 'video/webm; codecs=vp9'});
    console.log(mediaStream);
    
    video.srcObject = mediaStream;
    video.play();

    mediaStream.addEventListener('inactive', e =>
    {
        console.log('Stream closed');
        socket.emit('streamClose');
    });

    setInterval(() =>
    {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        context.width = canvas.width;
        context.height = canvas.height;

        context.drawImage(video, 0, 0, context.width, context.height);
        socket.emit('desktopStream', canvas.toDataURL('image/webp'));
    }, 0.1);
})
.catch(console.error);


