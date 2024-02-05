var knex = require('knex')({
    client: 'pg',
    connection: {
        host: '163.123.183.87',
        port : 17197,
        user: 'admin',
        password: '123456789',
        database: 'newserver'
    }
});


knex.raw("SELECT 1").then(() => {
        console.log("Database connected");
    })
    .catch((e) => {
        console.log("Database Not connected");
        console.error(e);
    });


module.exports.knex = knex;