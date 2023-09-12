exports.up = function (knex) {
  return knex.schema.alterTable('min_term', (table) => {
    table.string('term_number', 255).alter();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('min_term', (table) => {
    table.dropColumn('term_number', 255).alter();
  });
};
