-- ============================================================================
-- Sign Depot Operations PMS Database Schema
-- Fresh Schema with Default Users, Artists, and Sales Reps Roster
-- Tables: sales_requests, artists, sales_reps, directives, users, audit_logs
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `pms_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `pms_db`;

SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------------------------------------------------------
-- Table: sales_requests (Core Operations Intake & Project Orders)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `sales_requests`;
CREATE TABLE `sales_requests` (
  `id` VARCHAR(64) NOT NULL,
  `request_id` VARCHAR(50) NOT NULL,
  `jo_number` VARCHAR(50) DEFAULT '',
  `order_date` VARCHAR(30) DEFAULT '',
  `sales_rep` VARCHAR(100) DEFAULT '',
  `client` VARCHAR(255) DEFAULT '',
  `project_name` VARCHAR(255) DEFAULT '',
  `artist` VARCHAR(100) DEFAULT 'Unassigned',
  `design_deadline` VARCHAR(30) DEFAULT '',
  `releasing_date` VARCHAR(30) DEFAULT '',
  `file_sent` VARCHAR(50) DEFAULT 'N/A',
  `complete_address` TEXT,
  `location` VARCHAR(50) DEFAULT 'Indoor',
  `releasing_mode` VARCHAR(50) DEFAULT 'INSTALL',
  `contact_person` VARCHAR(150) DEFAULT '',
  `contact_number` VARCHAR(50) DEFAULT '',
  `project_status` VARCHAR(50) DEFAULT 'Pending Approval',
  `priority` VARCHAR(50) DEFAULT 'Normal',
  `head_approval` VARCHAR(50) DEFAULT 'Pending',
  `count_standard` INT NOT NULL DEFAULT 0,
  `count_special` INT NOT NULL DEFAULT 0,
  `count_printing` INT NOT NULL DEFAULT 0,
  `design_status` VARCHAR(50) DEFAULT 'Not Started',
  `revision_count` INT NOT NULL DEFAULT 0,
  `remarks` TEXT,
  `artist_accepted` VARCHAR(50) DEFAULT 'Accepted',
  `artist_accepted_date` VARCHAR(30) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_request_id` (`request_id`),
  KEY `idx_jo_number` (`jo_number`),
  KEY `idx_artist` (`artist`),
  KEY `idx_sales_rep` (`sales_rep`),
  KEY `idx_status` (`project_status`),
  KEY `idx_priority` (`priority`),
  KEY `idx_deadline` (`design_deadline`),
  KEY `idx_order_date` (`order_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table: artists (Graphic Designers & 3D Visualizers Roster)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `artists`;
CREATE TABLE `artists` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `active_tasks` INT NOT NULL DEFAULT 0,
  `availability` VARCHAR(50) NOT NULL DEFAULT 'AVAILABLE'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table: sales_reps (Account Executives & Sales Representatives)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `sales_reps`;
CREATE TABLE `sales_reps` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table: directives (Print Preview & Production Queue Directives)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `directives`;
CREATE TABLE `directives` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `jo_number` VARCHAR(50) NOT NULL,
  `request_id` VARCHAR(50) NOT NULL,
  `slot_number` INT DEFAULT 1,
  `project_name` VARCHAR(255) DEFAULT '',
  `client` VARCHAR(255) DEFAULT '',
  `artist` VARCHAR(100) DEFAULT '',
  `sales_rep` VARCHAR(100) DEFAULT '',
  `order_date` VARCHAR(30) DEFAULT '',
  `deadline` VARCHAR(30) DEFAULT '',
  `releasing_date` VARCHAR(30) DEFAULT '',
  `reference` VARCHAR(50) DEFAULT 'FILE SENT'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table: users (Enterprise Authentication & Role-Based Access Control)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(100) NOT NULL,
  `role` VARCHAR(50) NOT NULL DEFAULT 'user',
  `assigned_artist` VARCHAR(100) DEFAULT NULL,
  `status` ENUM('active','inactive') NOT NULL DEFAULT 'active',
  `permissions` LONGTEXT DEFAULT NULL,
  `oauth_provider` VARCHAR(50) DEFAULT NULL,
  `oauth_id` VARCHAR(100) DEFAULT NULL,
  `avatar_url` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_role` (`role`),
  KEY `idx_status` (`status`),
  KEY `idx_assigned_artist` (`assigned_artist`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table: audit_logs (System Audit Trail & Security Activity Tracking)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `audit_logs`;
CREATE TABLE `audit_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user` VARCHAR(100) NOT NULL,
  `role` VARCHAR(50) NOT NULL,
  `action` VARCHAR(50) NOT NULL,
  `module` VARCHAR(100) NOT NULL,
  `description` TEXT NOT NULL,
  `ip_address` VARCHAR(50) DEFAULT '127.0.0.1',
  `status` VARCHAR(50) DEFAULT 'Success',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_action` (`action`),
  KEY `idx_user` (`user`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- DEFAULT ACCOUNTS & ROSTER SEED DATA
-- ============================================================================

-- 1. Insert Artists
INSERT INTO `artists` (`name`, `availability`) VALUES
('Bob', 'AVAILABLE'),
('Dorothy', 'AVAILABLE'),
('Glen', 'AVAILABLE'),
('Goodrich', 'AVAILABLE'),
('Jules', 'AVAILABLE'),
('Raven', 'AVAILABLE'),
('Rodel', 'AVAILABLE'),
('Tim', 'AVAILABLE')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- 2. Insert Sales Reps
INSERT INTO `sales_reps` (`name`) VALUES
('Mae'),
('Mariel'),
('Jay'),
('Kim'),
('Joyce'),
('Shella'),
('Sheena'),
('Janet'),
('Flora'),
('Sol'),
('Dona'),
('Jen'),
('Seven'),
('Mike'),
('Pia'),
('Jastine'),
('Jade'),
('Joie'),
('Ed'),
('Dave'),
('Alvic'),
('Levi'),
('Joana'),
('Kate'),
('Anna'),
('Aj'),
('Tim')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- 3. Insert Users
INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `full_name`, `role`, `assigned_artist`, `status`, `permissions`) VALUES
(1, 'superadmin', 'admin@signdepot.com', '$2y$10$9oEMoc24qqsQBWLyfXAvXe7vr5qDIuY.lHMIgoTjrNvGcxEqgmFqy', 'Super Admin', 'super_admin', NULL, 'active', '{"dashboard":{"c":true,"r":true,"u":true,"d":true},"sales-requests":{"c":true,"r":true,"u":true,"d":true},"creatives-tracker":{"c":true,"r":true,"u":true,"d":true},"artist-workload":{"c":true,"r":true,"u":true,"d":true},"directives-details":{"c":true,"r":true,"u":true,"d":true},"monthly-output":{"c":true,"r":true,"u":true,"d":true},"reports":{"c":true,"r":true,"u":true,"d":true},"access-control":{"c":true,"r":true,"u":true,"d":true},"audit-trail":{"c":true,"r":true,"u":true,"d":true},"settings":{"c":true,"r":true,"u":true,"d":true}}'),
(2, 'artist_dorothy', 'dorothy@signdepot.com', '$2y$10$CwJ7DzKyRNfr/.poSDYoHO9kdLH/qumancu3Zozw7JcoKWtfOzzuS', 'Dorothy Diaz', 'artist', 'Dorothy', 'active', '{"dashboard":{"c":false,"r":true,"u":false,"d":false},"sales-requests":{"c":false,"r":false,"u":false,"d":false,"editable_columns":[]},"creatives-tracker":{"c":true,"r":true,"u":true,"d":false,"editable_columns":["designStatus","remarks"]},"artist-workload":{"c":false,"r":true,"u":false,"d":false},"directives-details":{"c":true,"r":true,"u":true,"d":false},"monthly-output":{"c":false,"r":true,"u":false,"d":false},"reports":{"c":false,"r":true,"u":false,"d":false},"access-control":{"c":false,"r":false,"u":false,"d":false},"audit-trail":{"c":false,"r":false,"u":false,"d":false},"settings":{"c":false,"r":false,"u":false,"d":false}}'),
(3, 'sales_dona', 'dona@signdepot.com', '$2y$10$9oEMoc24qqsQBWLyfXAvXe7vr5qDIuY.lHMIgoTjrNvGcxEqgmFqy', 'Dona', 'sales', NULL, 'active', '{"dashboard":{"c":false,"r":true,"u":false,"d":false},"sales-requests":{"c":true,"r":true,"u":true,"d":true},"creatives-tracker":{"c":false,"r":true,"u":false,"d":false},"artist-workload":{"c":false,"r":true,"u":false,"d":false},"directives-details":{"c":false,"r":true,"u":false,"d":false},"monthly-output":{"c":false,"r":false,"u":false,"d":false},"reports":{"c":false,"r":true,"u":false,"d":false},"access-control":{"c":false,"r":false,"u":false,"d":false},"audit-trail":{"c":false,"r":false,"u":false,"d":false},"settings":{"c":false,"r":false,"u":false,"d":false}}'),
(5, 'artist_glen', 'glen@signdepot.com', '$2y$10$y2oVIgQihWf.QT4sxSKobOsruRnIR.8AXbms7kLfDKTT6BUrQZtmO', 'Glen Artist', 'artist', 'Glen', 'active', '{"dashboard":{"c":false,"r":true,"u":false,"d":false},"sales-requests":{"c":false,"r":true,"u":false,"d":false},"creatives-tracker":{"c":true,"r":true,"u":true,"d":false},"artist-workload":{"c":false,"r":true,"u":false,"d":false},"directives-details":{"c":true,"r":true,"u":true,"d":false},"monthly-output":{"c":false,"r":true,"u":false,"d":false},"reports":{"c":false,"r":true,"u":false,"d":false},"access-control":{"c":false,"r":false,"u":false,"d":false},"audit-trail":{"c":false,"r":false,"u":false,"d":false},"settings":{"c":false,"r":false,"u":false,"d":false}}'),
(6, 'artist_jules', 'jules@signdepot.com', '$2y$10$oq9Cf3gyuBbWNsTYnpiSt.PqkKKvwHtN6u/apITx17FCzW52L6yhW', 'Jules Artist', 'artist', 'Jules', 'active', '{"dashboard":{"c":false,"r":true,"u":false,"d":false},"sales-requests":{"c":false,"r":true,"u":false,"d":false},"creatives-tracker":{"c":true,"r":true,"u":true,"d":false},"artist-workload":{"c":false,"r":true,"u":false,"d":false},"directives-details":{"c":true,"r":true,"u":true,"d":false},"monthly-output":{"c":false,"r":true,"u":false,"d":false},"reports":{"c":false,"r":true,"u":false,"d":false},"access-control":{"c":false,"r":false,"u":false,"d":false},"audit-trail":{"c":false,"r":false,"u":false,"d":false},"settings":{"c":false,"r":false,"u":false,"d":false}}'),
(7, 'artist_raven', 'raven@signdepot.com', '$2y$10$tA7EO2t1KEsJfS6IEF9/6eKiLaXpf1t4/6S5y75JTiwMrp/Y7g3lW', 'Raven Artist', 'artist', 'Raven', 'active', '{"dashboard":{"c":false,"r":true,"u":false,"d":false},"sales-requests":{"c":false,"r":true,"u":false,"d":false},"creatives-tracker":{"c":true,"r":true,"u":true,"d":false},"artist-workload":{"c":false,"r":true,"u":false,"d":false},"directives-details":{"c":true,"r":true,"u":true,"d":false},"monthly-output":{"c":false,"r":true,"u":false,"d":false},"reports":{"c":false,"r":true,"u":false,"d":false},"access-control":{"c":false,"r":false,"u":false,"d":false},"audit-trail":{"c":false,"r":false,"u":false,"d":false},"settings":{"c":false,"r":false,"u":false,"d":false}}'),
(8, 'artist_bob', 'bob@signdepot.com', '$2y$10$ZH/OWetYjAGxEqayzQtteuY/U6HEmEglZVFTE6oubBlkxwYxeXtge', 'Bob Artist', 'artist', 'Bob', 'active', '{"dashboard":{"c":false,"r":true,"u":false,"d":false},"sales-requests":{"c":false,"r":true,"u":false,"d":false},"creatives-tracker":{"c":true,"r":true,"u":true,"d":false},"artist-workload":{"c":false,"r":true,"u":false,"d":false},"directives-details":{"c":true,"r":true,"u":true,"d":false},"monthly-output":{"c":false,"r":true,"u":false,"d":false},"reports":{"c":false,"r":true,"u":false,"d":false},"access-control":{"c":false,"r":false,"u":false,"d":false},"audit-trail":{"c":false,"r":false,"u":false,"d":false},"settings":{"c":false,"r":false,"u":false,"d":false}}'),
(9, 'artist_tim', 'tim@signdepot.com', '$2y$10$MCzhbAFSLWmGQJ1FElLxbuXTwQev4.Lv.3y0iVKsbMO5TEwAwTmkG', 'Tim Artist', 'artist', 'Tim', 'active', '{"dashboard":{"c":false,"r":true,"u":false,"d":false},"sales-requests":{"c":false,"r":true,"u":false,"d":false},"creatives-tracker":{"c":true,"r":true,"u":true,"d":false},"artist-workload":{"c":false,"r":true,"u":false,"d":false},"directives-details":{"c":true,"r":true,"u":true,"d":false},"monthly-output":{"c":false,"r":true,"u":false,"d":false},"reports":{"c":false,"r":true,"u":false,"d":false},"access-control":{"c":false,"r":false,"u":false,"d":false},"audit-trail":{"c":false,"r":false,"u":false,"d":false},"settings":{"c":false,"r":false,"u":false,"d":false}}'),
(10, 'artist_goodrich', 'goodrich@signdepot.com', '$2y$10$773lLTnOgobG1Xig5wOCTucafXFdzYFVlIdmimp4jsLwVcupbcG/.', 'Goodrich Artist', 'artist', 'Goodrich', 'active', '{"dashboard":{"c":false,"r":true,"u":false,"d":false},"sales-requests":{"c":false,"r":true,"u":false,"d":false},"creatives-tracker":{"c":true,"r":true,"u":true,"d":false},"artist-workload":{"c":false,"r":true,"u":false,"d":false},"directives-details":{"c":true,"r":true,"u":false,"d":false},"monthly-output":{"c":false,"r":true,"u":false,"d":false},"reports":{"c":false,"r":true,"u":false,"d":false},"access-control":{"c":false,"r":false,"u":false,"d":false},"audit-trail":{"c":false,"r":false,"u":false,"d":false},"settings":{"c":false,"r":false,"u":false,"d":false}}'),
(11, 'artist_rodel', 'rodel@signdepot.com', '$2y$10$9oEMoc24qqsQBWLyfXAvXe7vr5qDIuY.lHMIgoTjrNvGcxEqgmFqy', 'Rodel Artist', 'artist', 'Rodel', 'active', '{"dashboard":{"c":false,"r":true,"u":false,"d":false},"sales-requests":{"c":false,"r":true,"u":false,"d":false},"creatives-tracker":{"c":true,"r":true,"u":true,"d":false},"artist-workload":{"c":false,"r":true,"u":false,"d":false},"directives-details":{"c":true,"r":true,"u":true,"d":false},"monthly-output":{"c":false,"r":true,"u":false,"d":false},"reports":{"c":false,"r":true,"u":false,"d":false},"access-control":{"c":false,"r":false,"u":false,"d":false},"audit-trail":{"c":false,"r":false,"u":false,"d":false},"settings":{"c":false,"r":false,"u":false,"d":false}}'),
(12, 'sup_angel', 'angel@gmail.com', '$2y$10$/6ba6qqJ.svMZZNdb7Dcjuq6bMW3qUR4z.4TSYZS4pMr2pnaRaDZ2', 'Angelica', 'super_admin', NULL, 'active', '{"dashboard":{"c":true,"r":true,"u":true,"d":true},"sales-requests":{"c":true,"r":true,"u":true,"d":true},"creatives-tracker":{"c":true,"r":true,"u":true,"d":true},"artist-workload":{"c":true,"r":true,"u":true,"d":true},"directives-details":{"c":true,"r":true,"u":true,"d":true},"monthly-output":{"c":true,"r":true,"u":true,"d":true},"reports":{"c":true,"r":true,"u":true,"d":true},"access-control":{"c":true,"r":true,"u":true,"d":true},"audit-trail":{"c":true,"r":true,"u":true,"d":true},"settings":{"c":true,"r":true,"u":true,"d":true}}'),
(13, 'sales_jastine', 'jastine@signdepot.com', '$2y$10$bxQWMCrTVo700qcVDo8NiOLEgZq0JobIPbKBmBGeLnMVjjknRnLcG', 'Jastine', 'sales', NULL, 'active', '{"dashboard":{"c":false,"r":true,"u":false,"d":false},"sales-requests":{"c":true,"r":true,"u":true,"d":true},"creatives-tracker":{"c":false,"r":true,"u":false,"d":false},"artist-workload":{"c":false,"r":true,"u":false,"d":false},"directives-details":{"c":false,"r":true,"u":false,"d":false},"monthly-output":{"c":false,"r":false,"u":false,"d":false},"reports":{"c":false,"r":true,"u":false,"d":false},"access-control":{"c":false,"r":false,"u":false,"d":false},"audit-trail":{"c":false,"r":false,"u":false,"d":false},"settings":{"c":false,"r":false,"u":false,"d":false}}')
ON DUPLICATE KEY UPDATE `username`=VALUES(`username`), `password_hash`=VALUES(`password_hash`), `permissions`=VALUES(`permissions`), `full_name`=VALUES(`full_name`), `role`=VALUES(`role`), `assigned_artist`=VALUES(`assigned_artist`);

SET FOREIGN_KEY_CHECKS = 1;
