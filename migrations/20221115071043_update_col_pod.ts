exports.up = function (knex) {
  return knex.schema.alterTable('pod', function (table) {
    table
      .integer('device_id')
      .references('id')
      .inTable('device')
      .onDelete('CASCADE')
      .index();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('pod', function (t) {
    t.integer('device_id').alter().onDelete('CASCADE').index();
  });
};
