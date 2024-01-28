import { db } from '../server/db';
import { groups } from '../server/db/schema/groups';

async function main() {
  console.log('Seeding database...');
  await db
    .insert(groups)
    .values([
      { name: 'FE-A', description: '' },
      { name: 'FE-B', description: '' },
      { name: 'FE-C', description: '' },
      { name: 'BE-A', description: '' },
      { name: 'BE-B', description: '' },
      { name: 'BE-C', description: '' },
      { name: 'TE-A', description: '' },
      { name: 'TE-B', description: '' },
      { name: 'TE-C', description: '' },
      { name: 'SE-A', description: '' },
      { name: 'SE-B', description: '' },
      { name: 'SE-C', description: '' },
    ])
    .onConflictDoNothing();
}

main()
  .then(() => {
    console.log('Database seeded');
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
