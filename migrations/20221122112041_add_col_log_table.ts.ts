exports.up = function (knex) {
  return knex.schema.table('log', (table) => {
    table.string('action', 255);
  });
};

exports.down = function (knex) {
  return knex.schema.table('log', (table) => {
    table.integer('del_port_id');
  });
};
