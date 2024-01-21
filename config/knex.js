var knex = require('knex')({
    client: 'pg',
    connection: {
        host: '108.181.157.252',
        port : 12830,
        user: 'admin',
        password: '123456789',
        database: 'postgres'
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