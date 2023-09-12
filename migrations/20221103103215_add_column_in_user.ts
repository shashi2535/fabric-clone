exports.up = function (knex) {
  return knex.schema.table('user', (table) => {
    table.integer('org_id').references('id').inTable('org');
  });
};

exports.down = function (knex) {
  return knex.schema.table('user', (table) => {
    table.dropColumn('org_id');
  });
};
