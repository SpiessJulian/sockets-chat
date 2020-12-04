class Users {
    constructor() {
        this.people = [];
    }

    addPerson(id, name, room) {
        let person = { id, name, room };

        this.people.push(person);

        return this.people;
    }

    getPerson(id) {
        let person = this.people.filter(eachP => eachP.id === id)[0];

        return person;
    }

    getPeople() {
        return this.people;
    }

    getPeopleInRoom(room) {
        let peopleInRoom = this.people.filter(eachP => eachP.room === room);
        return peopleInRoom;
    }

    deletePerson(id) {
        let personDeleted = this.getPerson(id);

        this.people = this.people.filter(eachP => eachP.id != id);

        return personDeleted;
    }


}

module.exports = {
    Users
}