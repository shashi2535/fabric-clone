exports.up = function (knex) {
  return knex.schema.createTable('org', function (table) {
    table.increments('id').primary();
    table.string('org_name', 255).notNullable();
    table.string('org_code', 255).notNullable();
    // table.integer('user_id').notNullable().references('id').inTable('user');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('org');
};
