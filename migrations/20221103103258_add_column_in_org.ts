exports.up = function (knex) {
  return knex.schema.table('org', (table) => {
    table.integer('user_id').references('id').inTable('user');
  });
};

exports.down = function (knex) {
  return knex.schema.table('org', (table) => {
    table.dropColumn('user_id');
  });
};
