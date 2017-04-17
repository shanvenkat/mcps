/* Services Registered under Module named myapp, List of Javascript functions or  
Busines Logic can be written to call from Controller */

myapp.service('MyService', function () {

    this.insertperson = function (firstName, lastName, age) {
        var topID = persons.length + 1;
        persons.push({
            id: topID,
            FirstName: firstName,
            LastName: lastName,
            Age: age
            
        });
    };


    this.getpersons = function () {
        return persons;
    };


    this.deleteperson = function (id) {

        for (var i = persons.length - 1; i >= 0; i--) {
            if (persons[i].id === id) {
                persons.splice(i, 1);
                break;
            }
        }
    };


    this.getperson = function (id) {
        for (var i = 0; i < persons.length; i++) {
            if (persons[i].id === id) {
                return persons[i];
            }
        }
        return null;
    };

    var persons = [
    { id: 1, FirstName: 'Joe', LastName: 'Smith', Age: '20' },
    { id: 2, FirstName: 'Bob', LastName: 'Jones', Age: '10' },
    { id: 3, FirstName: 'Wanda', LastName: 'West', Age: '50'}
    ];

});