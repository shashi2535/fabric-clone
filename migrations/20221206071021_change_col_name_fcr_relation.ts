exports.up = function (knex) {
  return knex.schema.table('fcr', (table) => {
    table.dropForeign('reg_id');
  });
};

exports.down = function (knex) {
  return knex.schema.table('fcr', (table) => {
    table
      .integer('region_id')
      .references('id')
      .inTable('region')
      .onDelete('CASCADE');
  });
};
