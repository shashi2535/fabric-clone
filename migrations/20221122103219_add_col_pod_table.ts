exports.up = function (knex) {
  return knex.schema.table('pod', (table) => {
    table
      .integer('device_id')
      .references('id')
      .inTable('device')
      .onDelete('CASCADE');
  });
};

exports.down = function (knex) {
  return knex.schema.table('pod', (table) => {
    table.timestamps(true, true);
  });
};
