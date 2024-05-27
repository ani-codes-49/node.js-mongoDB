
const fetchData = textToCall => {
        setTimeout(() => {
            textToCall('Done 1');
        }, 1500);
};

setTimeout(() => {
    console.log('First Timer is done');
    fetchData(textThatReceived => {
        console.log('text received: ', textThatReceived);
    });
}, 2000);


//with promise

// const fetchData_1 = () => {
//     const promise = new Promise((resolve, reject) => {
//         setTimeout(() => {
//             resolve('Done 1');
//         }, 1500);
//     });
//     return promise;
// };

// const fetchData_2 = () => {
//     const promise = new Promise((resolve, reject) => {
//         setTimeout(() => {
//             resolve('Done 2');
//         }, 1500);
//     });
//     return promise;
// };


// setTimeout(() => {
//     console.log('First Timer is done');
//     fetchData_1()
//         .then(textThatReceived => {
//             console.log('text from first method: ', textThatReceived);
//             return fetchData_2();
//         }).then(textThatReceived => {
//             console.log('text from second method: ', textThatReceived);
//         });
// }, 2000);


