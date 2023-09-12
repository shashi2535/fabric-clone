import type { Knex } from 'knex';

// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'postgres',
    connection: {
      host: '127.0.0.1',
      user: 'postgres',
      password: '1234',
      database: 'fabric-nest',
    },
  },
};

module.exports = config;
