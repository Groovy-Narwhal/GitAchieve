-- ---
-- Globals
-- ---

-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
-- SET FOREIGN_KEY_CHECKS=0;

-- ---
-- Table 'users'
-- 
-- ---

DROP TABLE IF EXISTS `users`;
    
CREATE TABLE `users` (
  `id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
  `username` VARCHAR(100) NOT NULL DEFAULT 'UsersDefaultUsername' COMMENT 'GitHub username',
  `email` VARCHAR(100) NOT NULL DEFAULT 'UsersDefaultEmail',
  `avatar url` VARCHAR(255) NOT NULL DEFAULT 'UsersDefaulAvatarUrl' COMMENT 'URL of image for user',
  `score` INTEGER NOT NULL DEFAULT 0,
  `pull requests` INTEGER NOT NULL DEFAULT 0,
  `merge conflicts` INTEGER NOT NULL DEFAULT 0,
  `merge resolutions` INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'orgs'
-- 
-- ---

DROP TABLE IF EXISTS `orgs`;
    
CREATE TABLE `orgs` (
  `id` INTEGER NOT NULL AUTO_INCREMENT DEFAULT 0,
  `orgname` VARCHAR(100) NOT NULL DEFAULT 'OrgsDefaultOrgname',
  `avatar url` VARCHAR(255) NOT NULL DEFAULT 'OrgsDefaultAvatarUrl' COMMENT 'URL of image for group',
  `score` INTEGER(20) NOT NULL DEFAULT 0,
  `commits` INTEGER(10) NOT NULL DEFAULT 0,
  `pull requests` INTEGER(10) NOT NULL DEFAULT 0,
  `merge conflicts` INTEGER(10) NOT NULL DEFAULT 0,
  `merge resolutions` INTEGER(10) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'users-orgs'
-- Join table to establish which users are in each org
-- ---

DROP TABLE IF EXISTS `users-orgs`;
    
CREATE TABLE `users-orgs` (
  `id` INTEGER NOT NULL AUTO_INCREMENT DEFAULT 0,
  `user id` INTEGER NULL DEFAULT NULL,
  `org id` INTEGER NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) COMMENT 'Join table to establish which users are in each org';

-- ---
-- Table 'users-users'
-- 
-- ---

DROP TABLE IF EXISTS `users-users`;
    
CREATE TABLE `users-users` (
  `id` INTEGER NOT NULL AUTO_INCREMENT DEFAULT 0,
  `primary` INTEGER NULL DEFAULT NULL,
  `secondary` INTEGER NULL DEFAULT NULL,
  `confirmed` VARCHAR(5) NOT NULL DEFAULT 'FALSE' COMMENT 'TRUE if game session was accepted by secondary user',
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'commits'
-- 
-- ---

DROP TABLE IF EXISTS `commits`;
    
CREATE TABLE `commits` (
  `id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
  `sha` VARCHAR(40) NULL DEFAULT NULL COMMENT 'Unique hash for a commit',
  `author id` INTEGER NULL DEFAULT NULL,
  `commiter id` INTEGER NULL DEFAULT NULL,
  `stats additions` INTEGER NOT NULL DEFAULT 0,
  `stats deletions` INTEGER NOT NULL DEFAULT 0,
  `stats total` INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'pull requests'
-- 
-- ---

DROP TABLE IF EXISTS `pull requests`;
    
CREATE TABLE `pull requests` (
  `id` INTEGER NOT NULL AUTO_INCREMENT DEFAULT 0,
  `user id` INTEGER NULL DEFAULT NULL,
  `head sha` VARCHAR(40) NULL DEFAULT NULL COMMENT 'Hash at head of commit',
  `number` INTEGER NULL DEFAULT NULL,
  `state` VARCHAR(10) NULL DEFAULT NULL,
  `title` VARCHAR(100) NOT NULL DEFAULT 'PullRequestDefaultTitle',
  `milestone url` VARCHAR(255) NOT NULL DEFAULT 'PullRequestDefaultMilestoneUrl',
  PRIMARY KEY (`id`)
);

-- ---
-- Foreign Keys 
-- ---

ALTER TABLE `users-orgs` ADD FOREIGN KEY (user id) REFERENCES `users` (`id`);
ALTER TABLE `users-orgs` ADD FOREIGN KEY (org id) REFERENCES `orgs` (`id`);
ALTER TABLE `users-users` ADD FOREIGN KEY (primary) REFERENCES `users` (`id`);
ALTER TABLE `users-users` ADD FOREIGN KEY (secondary) REFERENCES `users` (`id`);
ALTER TABLE `commits` ADD FOREIGN KEY (author id) REFERENCES `users` (`id`);
ALTER TABLE `commits` ADD FOREIGN KEY (commiter id) REFERENCES `users` (`id`);
ALTER TABLE `pull requests` ADD FOREIGN KEY (user id) REFERENCES `users` (`id`);

-- ---
-- Table Properties
-- ---

-- ALTER TABLE `users` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `orgs` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `users-orgs` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `users-users` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `commits` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `pull requests` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ---
-- Test Data
-- ---

-- INSERT INTO `users` (`id`,`username`,`email`,`avatar url`,`score`,`pull requests`,`merge conflicts`,`merge resolutions`) VALUES
-- ('','','','','','','','');
-- INSERT INTO `orgs` (`id`,`orgname`,`avatar url`,`score`,`commits`,`pull requests`,`merge conflicts`,`merge resolutions`) VALUES
-- ('','','','','','','','');
-- INSERT INTO `users-orgs` (`id`,`user id`,`org id`) VALUES
-- ('','','');
-- INSERT INTO `users-users` (`id`,`primary`,`secondary`,`confirmed`) VALUES
-- ('','','','');
-- INSERT INTO `commits` (`id`,`sha`,`author id`,`commiter id`,`stats additions`,`stats deletions`,`stats total`) VALUES
-- ('','','','','','','');
-- INSERT INTO `pull requests` (`id`,`user id`,`head sha`,`number`,`state`,`title`,`milestone url`) VALUES
-- ('','','','','','','');
