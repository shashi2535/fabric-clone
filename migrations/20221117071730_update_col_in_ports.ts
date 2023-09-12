export async function up(knex) {
  const transaction = await knex.transaction();

  try {
    await transaction.schema.alterTable('port', (table) => {
      table.integer('sp_vlan_id').alter();
    });
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
  }
}
export async function down(knex) {
  const transaction = await knex.transaction();

  try {
    await transaction.schema.alterTable('port', (table) => {
      table.integer('sp_vlan_id').alter();
    });
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
  }
}
