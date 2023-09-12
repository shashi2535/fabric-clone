exports.up = function (knex) {
  return knex.schema.createTable('device', function (table) {
    table.increments('id').primary();
    table.string('device_name', 255);
    table.string('vendor', 255);
    table.string('device_type', 255);
    table.integer('total_ports').defaultTo(48);
    table.integer('available_ports').defaultTo(48);
    table.integer('total_fcr').defaultTo(8000);
    table.integer('available_fcr').defaultTo(8000);
    table.string('label_name', 255);
    table.string('location', 255);
    table.string('hosted_on', 255);
    table.integer('ce_vlan_range');
    table.string('interface_type', 255);
    table.integer('interface_bandwidth').defaultTo(1000);
    table.integer('interface_total_bandwidth').defaultTo(8000);
    table.integer('interface_contentionRatio').defaultTo(8);
    table.integer('interface_available_bandwidth').defaultTo(8000);
    table.integer('interface_used_bandwidth').defaultTo(0);
    table.string('interface_name', 255);
    table.string('interface_next_hope_ip', 255);
    table.string('interface_my_ip', 255);
    table.integer('throughput_total_bandwidth').defaultTo(8000);
    table.integer('throughput_available_bandwidth').defaultTo(8000);
    table.integer('sp_vlan_total_range', 255).defaultTo(196);
    //   '{\'\'foo\'\',\'\'bar\'\'}'
    table
      .specificType('available_sp_vlan', 'INTEGER[]')
      .defaultTo(
        '{101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114,115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128,129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142,143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156,157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170,171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184,185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196 }',
      );
    table.specificType('Used_sp_vlan', 'integer ARRAY');
    table
      .integer('pod_id')
      .references('id')
      .inTable('pod')
      .onDelete('CASCADE')
      .index();
    table.timestamps(true, true);
  });
};
exports.down = function (knex) {
  return knex.schema.dropTable('device');
};
