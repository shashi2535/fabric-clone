exports.up = function (knex) {
  return knex.schema.createTable('pod', function (table) {
    table.increments('id').primary();
    table.string('name', 255);
    table.string('pod_code', 255);
    table.string('Switch_number', 255);
    table.integer('region_id').references('id').inTable('region');
    table.integer('dc_id').references('id').inTable('datacenter');
    table.integer('ce_vlan_total_range').defaultTo(4093);
    table.specificType('used_ce_vlan', 'INTEGER[]');

    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('pod');
};
