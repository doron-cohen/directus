import Knex from 'knex';

export async function up(knex: Knex) {
	await knex.schema.alterTable('directus_relations', (table) => {
		table.string('sort_field');
	});

	const fieldsWithSort = await knex
		.select('collection', 'field', 'options')
		.from('directus_fields')
		.whereIn('interface', ['one-to-many', 'm2a-builder', 'many-to-many']);

	for (const field of fieldsWithSort) {
		const options = typeof field.options === 'string' ? JSON.parse(field.options) : field.options ?? {};

		if ('sortField' in options) {
			await knex('directus_relations')
				.update({
					sort_field: options.sortField,
				})
				.where({
					one_collection: field.collection,
					one_field: field.field,
				});
		}
	}
}

export async function down(knex: Knex) {
	await knex.schema.alterTable('directus_relations', (table) => {
		table.dropColumn('sort_field');
	});
}
