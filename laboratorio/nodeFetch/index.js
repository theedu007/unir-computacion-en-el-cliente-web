// Para poder usar fetch se debe installr la version 2 de node-fetch
// npm install node-fetch@2
// en la v18 de node ya es posble usar ES modules
const fetch = require("node-fetch")

const printJokes = () => fetch('http://api.icndb.com/jokes/random/10')
    .then(response => response.json())
    .then(json => {
        const jokes = json.value;
        jokes.forEach(item => console.log(item.joke));
        console.log();
    });

printJokes();