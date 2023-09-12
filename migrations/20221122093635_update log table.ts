exports.up = function (knex) {
  return knex.schema.alterTable('log', function (table) {
    table.foreign('port_id').onDelete('CASCADE').onUpdate('CASCADE');
  });
};
exports.down = function (knex) {
  //   return knex.schema.alterTable('log', function (table) {
  //     table
  //       .integer('port_id')
  //       .references('id')
  //       .inTable('port')
  //       .onDelete('CASCADE')
  //       .index()
  //       .alter();
  //   });
  return knex.schema.table('log', (table) => table.dropColumn('port_id'));
};
