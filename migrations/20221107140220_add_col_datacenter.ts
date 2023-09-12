exports.up = function (knex) {
  return knex.schema.table('datacenter', (table) => {
    table.integer('minterm_id').references('id').inTable('min_term');
  });
};

exports.down = function (knex) {
  return knex.schema.table('datacenter', (table) => {
    table.dropColumn('minterm_id');
  });
};
