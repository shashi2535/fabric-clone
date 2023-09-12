exports.up = function (knex) {
  return knex.schema.table('region', (table) => {
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.table('region', (table) => {
    table.timestamps(true, true);
  });
};
