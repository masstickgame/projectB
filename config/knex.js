var knex = require('knex')({
    client: 'pg',
    connection: {
        host: '68.64.164.95',
        port : 10009,
        user: 'admin',
        password: '123456789',
        database: 'transfer_courses1'
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