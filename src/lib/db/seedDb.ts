import { db } from '@/server/db';
import { groupMembers, groups } from '@/server/db/schema/groups';

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
  const user = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.email, 'vsghodekar1@gmail.com'),
  });
  if (user) {
    const groupIds = await db.query.groups.findMany();
    const insertArr: (typeof groupMembers.$inferSelect)[] = groupIds.map(
      (grp) => ({
        groupId: grp.id,
        joined: true,
        role: 'MOD',
        userId: user.id,
        joinedAt: new Date(),
        leftAt: null,
      }),
    );
    if (insertArr.length > 0) {
      await db.insert(groupMembers).values(insertArr).onConflictDoNothing();
    }
  }
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
