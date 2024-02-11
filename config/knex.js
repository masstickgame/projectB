var knex = require('knex')({
    client: 'pg',
    connection: {
        host: '108.181.197.180',
        port : 16622,
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