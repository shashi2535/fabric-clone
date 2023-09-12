exports.up = function (knex) {
  return knex.schema.createTable('port', function (table) {
    table.increments('id').primary();
    table.string('minTerm', 255);
    table.string('link_loa', 255);
    table.string('marketPlace', 255);
    table.string('port_code', 255);
    table.string('available_BW', 255);
    table.string('used_BW', 255);
    table.string('portName', 255);
    table.string('port_speed', 255);
    table.string('type', 255);
    table
      .enu('operational_state', ['Active', 'Inactive'])
      .defaultTo('Inactive');
    table.enu('status', ['Saved', 'Order']);
    table
      .enu('admin_status', ['Provisioning', 'Provisioned', 'Deployed', 'Error'])
      .defaultTo('Provisioning');
    table.string('sp_vlan_id', 255);
    table.string('Assigned_port_number', 255);
    table.string('display_port_id', 255);
    table.string('sp_vlan_name', 255);
    table.string('user_email', 255);
    table.string('user_name', 255);
    table.string('org_code', 255);
    table.string('org_name', 255);
    table.integer('region_id').references('id').inTable('region');
    table.integer('dc_id').references('id').inTable('datacenter');
    table.integer('pod_id').references('id').inTable('pod');
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('port');
};
