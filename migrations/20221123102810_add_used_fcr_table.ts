exports.up = function (knex) {
  return knex.schema.createTable('usedFcr', function (table) {
    table.increments('id').primary();
    table
      .integer('device_id')
      .references('id')
      .inTable('device')
      .onDelete('CASCADE')
      .index();
    table
      .integer('fcr_id')
      .references('id')
      .inTable('fcr')
      .onDelete('CASCADE')
      .index();
    table.timestamps(true, true);
  });
};
exports.down = function (knex) {
  return knex.schema.dropTable('usedFcr');
};
