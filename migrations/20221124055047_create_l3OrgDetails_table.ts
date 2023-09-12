exports.up = function (knex) {
  return knex.schema.createTable('l3OrgDetails', function (table) {
    table.increments('id').primary();
    table.string('org_name', 255).notNullable();
    table.string('org_code', 255).notNullable();
    table.integer('vrf_number');
    table.integer('l3_vrf_number');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('l3OrgDetails');
};
