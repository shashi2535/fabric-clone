exports.up = function (knex) {
  return knex.schema.createTable('datacenter', function (table) {
    table.increments('id').primary();
    table.integer('no_ports_org_dc').defaultTo(1);
    table.integer('no_fcrs_org_dc').defaultTo(1);
    table.integer('asn');
    table.string('dc_code', 255);
    table.string('name', 255);
    table.string('portSpeed', 255);
    table.string('state', 255);
    table.string('country', 255);
    table.string('city', 255);
    table.string('address', 255);
    table.string('latitude', 255);
    table.string('longitude', 255);
    table.enu('stage', ['staging', 'beta', 'production', 'province']);
    table.enu('status', ['saved', 'order']);
    table.enu('role', ['hub', 'spoke']);
    table.integer('region_id').references('id').inTable('region');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('datacenter');
};

// region_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Region',
//     require: true,
//   },
//   min_term: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'minTerm',
//     require: true,
//   },
