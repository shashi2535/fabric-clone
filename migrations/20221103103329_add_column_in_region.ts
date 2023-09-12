exports.up = function (knex) {
  return knex.schema.createTable('region', function (table) {
    table.increments('id').primary();
    table.string('region_name', 255).notNullable();
    table.string('region_code', 255).notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('region');
};
