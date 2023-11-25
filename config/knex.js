var knex = require('knex')({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        port : 5432,
        user: 'postgres',
        password: '486919',
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