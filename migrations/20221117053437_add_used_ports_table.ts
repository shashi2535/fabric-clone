exports.up = function (knex) {
  return knex.schema.createTable('usedPort', function (table) {
    table.increments('id').primary();
    table
      .integer('device_id')
      .references('id')
      .inTable('device')
      .onDelete('CASCADE')
      .index();
    table
      .integer('port_id')
      .references('id')
      .inTable('port')
      .onDelete('CASCADE')
      .index();
    table.timestamps(true, true);
  });
};
exports.down = function (knex) {
  return knex.schema.dropTable('usedPort');
};
