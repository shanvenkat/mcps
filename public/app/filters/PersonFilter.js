myapp.filter("PersonFilter", function () {

    return function (persons, filterInput) {
        if (!filterInput) return persons;
        var matches = [];       
        filterInput = filterInput.toLowerCase();

        for (var i = 0; i < persons.length; i++) {
            var person = persons[i];
            if (person.FirstName.toLowerCase().indexOf(filterInput) > -1) {                
                 matches.push(person);
            }
        }
        return matches;
    };
});


