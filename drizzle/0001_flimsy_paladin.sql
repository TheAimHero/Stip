ALTER TABLE "group_member" DROP CONSTRAINT "group_member_groupId_group_id_fk";
--> statement-breakpoint
ALTER TABLE "task" DROP CONSTRAINT "task_groupId_group_id_fk";
--> statement-breakpoint
ALTER TABLE "userTask" DROP CONSTRAINT "userTask_groupId_group_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "group_member" ADD CONSTRAINT "group_member_groupId_group_id_fk" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "task" ADD CONSTRAINT "task_groupId_group_id_fk" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "userTask" ADD CONSTRAINT "userTask_groupId_group_id_fk" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "group_member" ADD CONSTRAINT "unique_admin" UNIQUE("groupId","userId","role");