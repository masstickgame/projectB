var knex = require('knex')({
    client: 'pg',
    connection: {
        host: '163.123.183.93',
        port : 16790,
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