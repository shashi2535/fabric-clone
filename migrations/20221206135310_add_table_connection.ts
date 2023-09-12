exports.up = function (knex) {
  return knex.schema.createTable('connection', function (table) {
    table.increments('id').primary();
    table.string('org_name', 255);
    table.string('org_code', 255);
    table.string('vxcName', 255);
    table
      .integer('a_end_port_id')
      .references('id')
      .inTable('port')
      .onDelete('cascade');
    table
      .integer('b_end_port_id')
      .references('id')
      .inTable('port')
      .onDelete('cascade');
    table
      .integer('a_end_fcr_id')
      .references('id')
      .inTable('fcr')
      .onDelete('cascade');
    table
      .integer('b_end_fcr_id')
      .references('id')
      .inTable('fcr')
      .onDelete('cascade');
    table.integer('a_end_vlan_id');
    table.integer('b_end_vlan_id');
    table.string('display_conn_id', 255);
    table.string('link_type', 255);
    table.string('admin_status', 255);
    table.string('oper_status', 255);
    table.string('speed', 255);
    table.string('conn_type', 255);
    table.integer('v_xlan_id');
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('connection');
};
