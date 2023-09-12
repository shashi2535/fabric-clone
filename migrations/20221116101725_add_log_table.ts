exports.up = function (knex) {
  return knex.schema.createTable('log', function (table) {
    table.increments('id').primary();
    table.string('name', 255);
    table.string('speed', 255);
    table.string('dis_id', 255);
    table.string('log_type', 255);
    table.string('category', 255);
    table.string('user_name', 255);
    table.string('user_email', 255);
    table.string('org_code', 255);
    table.string('org_name', 255);
    table.string('conn_source_name', 255);
    table.string('conn_destination_name', 255);
    table.integer('port_id').references('id').inTable('port');
    table.timestamps(true, true);
  });
};
exports.down = function (knex) {
  return knex.schema.table('log', (table) => {
    table.string('action', 255);
  });
};
