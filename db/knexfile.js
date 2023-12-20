const { knexSnakeCaseMappers } = require('objection');
module.exports = {

  development: {
    client: 'mysql',
    connection: {
      database: 'mynewdb',
      user: 'root',
      password: 'password',
    },

    migrations: {
      tableName: 'knex_migrations',
    },
    ...knexSnakeCaseMappers,
  },
};