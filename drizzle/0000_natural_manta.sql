CREATE TABLE `account` (
	`userId` text(255) NOT NULL,
	`type` text(255) NOT NULL,
	`provider` text(255) NOT NULL,
	`providerAccountId` text(255) NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` integer,
	`token_type` text(255),
	`scope` text(255),
	`id_token` text,
	`session_state` text(255),
	PRIMARY KEY(`provider`, `providerAccountId`),
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `session` (
	`sessionToken` text(255) PRIMARY KEY NOT NULL,
	`userId` text(255) NOT NULL,
	`expires` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `verificationToken` (
	`identifier` text(255) NOT NULL,
	`token` text(255) NOT NULL,
	`expires` integer NOT NULL,
	PRIMARY KEY(`identifier`, `token`)
);
--> statement-breakpoint
CREATE TABLE `file` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`key` text(255) NOT NULL,
	`link` text(255) NOT NULL,
	`name` text(255) NOT NULL,
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` integer NOT NULL,
	`userId` text(255) NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `group` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text(255) DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `task` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`dueDate` integer NOT NULL,
	`groupId` integer NOT NULL,
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`assignedById` text(255) NOT NULL,
	`state` text DEFAULT 'OPEN' NOT NULL,
	FOREIGN KEY (`groupId`) REFERENCES `group`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`assignedById`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `userTask` (
	`userId` text(255) NOT NULL,
	`taskId` integer NOT NULL,
	`completed` integer DEFAULT false NOT NULL,
	`completedAt` integer,
	`cancelled` integer DEFAULT false NOT NULL,
	`cancelledAt` integer,
	PRIMARY KEY(`taskId`, `userId`),
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`taskId`) REFERENCES `task`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `todo` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text(256) NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`completed` integer DEFAULT false NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`due_date` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`createdById` text(255) NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`createdById`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `attendance` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` text(255) NOT NULL,
	`groupId` integer NOT NULL,
	`present` integer DEFAULT false NOT NULL,
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`groupId`) REFERENCES `group`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`name` text(255),
	`email` text(255) NOT NULL,
	`emailVerified` integer DEFAULT CURRENT_TIMESTAMP,
	`image` text(255),
	`role` text DEFAULT 'USER' NOT NULL,
	`groupId` integer,
	`rollNo` integer,
	FOREIGN KEY (`groupId`) REFERENCES `group`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `account_userId_idx` ON `account` (`userId`);--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `session` (`userId`);--> statement-breakpoint
CREATE UNIQUE INDEX `group_name_unique` ON `group` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `attendance_userId_groupId_createdAt_unique` ON `attendance` (`userId`,`groupId`,`createdAt`);