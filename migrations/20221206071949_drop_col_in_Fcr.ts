exports.up = function (knex) {
  return knex.schema.table('fcr', (table) => {
    table.dropColumn('reg_id');
  });
};
exports.down = function (knex) {
  return knex.schema.table('fcr', (table) => {
    table.dropColumn('reg_id');
  });
};
