const fs = require('fs');
const res = fs.writeFileSync('hello.txt', 'file created successfully');
console.log(res);
