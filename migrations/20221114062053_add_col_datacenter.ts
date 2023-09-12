exports.up = function (knex) {
  return knex.schema.table('datacenter', (table) => {
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.table('datacenter', (table) => {
    table.timestamps(true, true);
  });
};
