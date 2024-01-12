import { db } from '@/server/db';

async function main() {
  // prettier-ignore
  const groups = ['FE-A', 'FE-B', 'BE-A', 'BE-B', 'SE-A', 'SE-B', 'TE-A', 'TE-B'];
  await db.group.createMany({
    data: groups.map((group) => ({ name: group })),
  });
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
