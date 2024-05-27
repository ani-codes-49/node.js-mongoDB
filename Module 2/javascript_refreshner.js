
//spread and rest operators
const fruits = ['apple', 'bananaa', 'mango', 'orange'];
const [first, second] = fruits;
console.log(first);


const hobbies = ['Playing', 'Cooking'];
console.log(hobbies);
hobbies.push('Travelling');

console.log(hobbies);



const copyOfHobbies = [...hobbies];
console.log('copy of hobbies: ', copyOfHobbies);

const colors = (...args) => {
    return args;
};

console.log('rest operator: ', colors('red', 'yellow', 'blue', 'black'));


//destructuring
const Person = {
    name: 'Aniruddh',
    age: 22,
    address() {
        console.log('I am', this.name, ' & I live in sangli ');
    }
};


const copyOfPerson = {...Person};
console.log('spread operator: ',copyOfPerson);

const printName = ({ name }) => {
    console.log(name);
};

printName(Person);

const { name, age } = Person;
console.log(name, age);

