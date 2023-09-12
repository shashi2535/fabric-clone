exports.up = function (knex) {
  return knex.schema.createTable('fcr', function (table) {
    table.increments('id').primary();
    table.string('fcrName', 255);
    table.string('type', 255);
    table.string('term', 255);
    table.string('router_id', 255);
    table.string('bgp_state', 255);
    table.integer('vrf_number');
    table.integer('l3vrf_table_number');
    table.string('display_fcr_id', 255);
    table.string('admin_status', 255);
    table.string('oper_status', 255);
    table.string('user_email', 255);
    table.string('user_name', 255);
    table.string('org_code', 255);
    table.string('org_name', 255);
    table.string('used_BW', 255);
    table.string('available_BW', 255);
    table.string('speed', 255);
    table.string('fcr_code', 255);
    table.integer('asn');
    table
      .integer('dc_id')
      .references('id')
      .inTable('datacenter')
      .onDelete('CASCADE');
    table
      .integer('reg_id')
      .references('id')
      .inTable('region')
      .onDelete('CASCADE');
    table.integer('pod_id').references('id').inTable('pod').onDelete('CASCADE');
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('fcr');
};
