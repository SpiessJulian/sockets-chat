const { io } = require('../server');
const { Users } = require('../classes/users');
const { makeMessage } = require('../utils/utils');


const users = new Users();


io.on('connection', (client) => {
    client.on('enterChat', (data, callback) => {

        if (!data.name || !data.room) {
            return callback({
                error: true,
                message: 'Name and Room are needed'
            });
        }

        client.join(data.room);

        users.addPerson(client.id, data.name, data.room);

        client.broadcast.to(data.room).emit('peopleList', users.getPeopleInRoom(data.room));
        callback(users.getPeopleInRoom(data.room));
    });

    client.on('makeMessage', (data) => {
        let person = users.getPerson(client.id);

        let message = makeMessage(person.name, data.message);
        client.broadcast.to(person.room).emit('makeMessage', message);
    });

    client.on('disconnect', () => {
        let personDeleted = users.deletePerson(client.id);

        client.broadcast.to(personDeleted.room).emit('peopleList', users.getPeopleInRoom());
        client.broadcast.to(personDeleted.room).emit('makeMessage', makeMessage('Admin', `${personDeleted.name} left the chat`));
    });

    //Private messages
    client.on('privateMessage', (data, callback) => {
        let person = users.getPerson(client.id);

        if (!data.message) {
            return callback({
                error: true,
                message: 'Message is needed'
            });
        }
        if (!data.to) {
            return callback({
                error: true,
                message: '"to" is needed'
            });
        }

        client.broadcast.to(data.to).emit('privateMessage', makeMessage(person.name, data.message));
    });

});