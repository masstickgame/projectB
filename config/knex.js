var knex = require('knex')({
    client: 'pg',
    connection: {
        host: '108.181.197.183',
        port : 10031,
        user: 'admin',
        password: '123456789',
        database: 'project'
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