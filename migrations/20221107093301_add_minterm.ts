exports.up = function (knex) {
  return knex.schema.createTable('min_term', function (table) {
    table.increments('id').primary();
    table.string('term_name', 255);
    table.integer('term_number');
    // table.integer('org_id').notNullable().references('id').inTable('org');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('min_term');
};
