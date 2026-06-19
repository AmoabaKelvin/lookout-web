CREATE TABLE `account` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`expires_at` integer NOT NULL,
	`token` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer NOT NULL,
	`image` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `monitor_events` (
	`id` text PRIMARY KEY NOT NULL,
	`monitor_id` text NOT NULL,
	`type` text NOT NULL,
	`from_status` text,
	`to_status` text,
	`message` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`monitor_id`) REFERENCES `monitors`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `monitor_events_monitor_id_idx` ON `monitor_events` (`monitor_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `monitor_pings` (
	`id` text PRIMARY KEY NOT NULL,
	`monitor_id` text NOT NULL,
	`received_at` integer NOT NULL,
	`remote_ip` text,
	`user_agent` text,
	FOREIGN KEY (`monitor_id`) REFERENCES `monitors`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `monitor_pings_monitor_id_idx` ON `monitor_pings` (`monitor_id`,`received_at`);--> statement-breakpoint
CREATE TABLE `monitors` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`kind` text DEFAULT 'heartbeat' NOT NULL,
	`token_hash` text NOT NULL,
	`token_prefix` text NOT NULL,
	`interval_seconds` integer DEFAULT 60 NOT NULL,
	`grace_seconds` integer DEFAULT 120 NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`last_ping_at` integer,
	`last_checked_at` integer,
	`down_since` integer,
	`last_alerted_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `monitors_token_hash_unique` ON `monitors` (`token_hash`);--> statement-breakpoint
CREATE INDEX `monitors_user_id_idx` ON `monitors` (`user_id`);--> statement-breakpoint
CREATE INDEX `monitors_status_idx` ON `monitors` (`status`);--> statement-breakpoint
CREATE TABLE `notification_channels` (
	`user_id` text PRIMARY KEY NOT NULL,
	`discord_webhook_url` text,
	`google_chat_webhook_url` text,
	`webhook_url` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
