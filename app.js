/*jslint devel: true */
/* eslint-disable no-console */
/*eslint no-undef: "error"*/
/*eslint-env node*/ 


const app = require('./server');

app.listen(3000, () => console.log('Local app listening on port 3000!'));