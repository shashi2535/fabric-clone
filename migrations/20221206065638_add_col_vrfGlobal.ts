exports.up = function (knex) {
  return knex.schema.table('vrfGlobal', (table) => {
    table.specificType('l3vrf_used_list', 'INTEGER[]');
  });
};

exports.down = function (knex) {
  return knex.schema.table('vrfGlobal', (table) => {
    table.specificType('l3vrf_used_list', 'INTEGER[]');
  });
};
