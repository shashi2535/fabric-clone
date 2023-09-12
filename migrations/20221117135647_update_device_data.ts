export async function up(knex) {
  const transaction = await knex.transaction();

  try {
    await transaction.schema.alterTable('device', (table) => {
      table.specificType('used_sp_vlan', 'integer ARRAY').alter();
    });
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
  }
}
export async function down(knex) {
  const transaction = await knex.transaction();

  try {
    await transaction.schema.alterTable('device', (table) => {
      table.specificType('used_sp_vlan', 'integer ARRAY').alter();
    });
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
  }
}
