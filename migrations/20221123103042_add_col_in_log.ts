exports.up = function (knex) {
  return knex.schema.table('log', (table) => {
    table.integer('fcr_id').references('id').inTable('fcr').onDelete('CASCADE');
    table.integer('del_fcr_id');
  });
};

exports.down = function (knex) {
  return knex.schema.table('log', (table) => {
    table.integer('fcr_id');
  });
};
