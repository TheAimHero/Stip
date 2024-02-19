/* eslint-disable @typescript-eslint/no-unused-vars */
import { db } from '@/server/db';
import { groupMembers, groups } from '@/server/db/schema/groups';

async function main() {
  console.log('Seeding database');
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
