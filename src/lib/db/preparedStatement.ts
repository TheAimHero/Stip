import { db } from '@/server/db';
import { sql } from 'drizzle-orm';

export const getGrpModMember = db.query.groupMembers
  .findFirst({
    where: (gm, { eq, and }) =>
      and(
        and(
          and(
            eq(gm.userId, sql.placeholder('userId')),
            eq(gm.groupId, sql.placeholder('groupId')),
          ),
          eq(gm.role, 'MOD'),
        ),
        eq(gm.joined, true),
      ),
  })
  .prepare('getGrpModMember');

export const getGrpMember = db.query.groupMembers
  .findFirst({
    where: (gm, { eq, and }) =>
      and(
        and(
          eq(gm.userId, sql.placeholder('userId')),
          eq(gm.groupId, sql.placeholder('groupId')),
        ),
        eq(gm.joined, true),
      ),
  })
  .prepare('getGrpMember');
