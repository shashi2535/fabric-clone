exports.up = function (knex) {
  return knex.schema.createTable('user', function (table) {
    table.increments('id').primary();
    table.string('name', 255).notNullable();
    table.string('email', 255).unique().notNullable();
    // table.integer('org_id').notNullable().references('id').inTable('org');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('user');
};
