exports.up = function (knex) {
  return knex.table('pod', function (table) {
    // table.dropForeign('dc_id', 'pod_dc_id_foreign');
    table.dropColumn('dc_id');
  });
};

exports.down = function (knex) {
  return knex.table('pod', function (table) {
    // table.dropForeign('dc_id', 'pod_dc_id_foreign');
    table.dropColumn('dc_id');
  });
};
