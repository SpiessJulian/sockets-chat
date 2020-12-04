var socket = io();


//Get params
var params = new URLSearchParams(window.location.search);

if (!params.has('name') || !params.has('room')) {
    window.location = 'index.html';
    throw new Error('Name and Room are needed');
}
var user = {
    name: params.get('name'),
    room: params.get('room')
}



//Server Connection
socket.on('connect', function() {
    console.log('Connected to Server');

    socket.emit('enterChat', user, function(resp) {
        console.log('Users Connected: ', resp);
    });
});

// Listen for server diconnection
socket.on('disconnect', function() {
    console.log('Connection Lost');
});


// Send info
/* socket.emit('makeMessage', {
    message: 'Hola Mundo'
}, function(resp) {
    console.log('Server Response: ', resp);
}); */

// recive msgs
socket.on('makeMessage', function(message) {
    console.log('Server:', message);
});

//List of users update
socket.on('peopleList', function(people) {
    console.log(people);
});


//Private Msgs
socket.on('privateMessage', function(message) {
    console.log('Private Msg: ', message);
});