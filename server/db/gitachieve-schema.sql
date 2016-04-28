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
  `username` VARCHAR(100) NOT NULL DEFAULT 'default-username' COMMENT 'GitHub username',
  `email` VARCHAR(100) NULL DEFAULT 'default@email.com',
  `avatar url` VARCHAR(255) NULL DEFAULT NULL COMMENT 'URL of image for user',
  `score` INTEGER(20) NOT NULL DEFAULT 0,
  `commits` INT(10) NOT NULL DEFAULT 0,
  `pull requests` INTEGER(10) NOT NULL DEFAULT 0,
  `merge conflicts` INTEGER(10) NOT NULL DEFAULT 0,
  `merge resolutions` INTEGER(10) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'orgs'
-- 
-- ---

DROP TABLE IF EXISTS `orgs`;
    
CREATE TABLE `orgs` (
  `id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
  `orgname` VARCHAR(100) NOT NULL DEFAULT 'default-org',
  `avatar url` VARCHAR(255) NULL DEFAULT NULL COMMENT 'URL of image for group',
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
  `id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
  `user id` INTEGER(0) NOT NULL DEFAULT NULL,
  `org id` INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) COMMENT 'Join table to establish which users are in each org';

-- ---
-- Table 'friends'
-- 
-- ---

DROP TABLE IF EXISTS `friends`;
    
CREATE TABLE `friends` (
  `id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
  `primary` INTEGER(10) NULL DEFAULT NULL,
  `secondary` INT(10) NULL DEFAULT NULL,
  `confirmed` VARCHAR(10) NOT NULL DEFAULT 'FALSE',
  PRIMARY KEY (`id`)
);

-- ---
-- Foreign Keys 
-- ---

ALTER TABLE `users-orgs` ADD FOREIGN KEY (user id) REFERENCES `users` (`id`);
ALTER TABLE `users-orgs` ADD FOREIGN KEY (org id) REFERENCES `orgs` (`id`);
ALTER TABLE `friends` ADD FOREIGN KEY (primary) REFERENCES `users` (`id`);

-- ---
-- Table Properties
-- ---

-- ALTER TABLE `users` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `orgs` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `users-orgs` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `friends` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ---
-- Test Data
-- ---

-- INSERT INTO `users` (`id`,`username`,`email`,`avatar url`,`score`,`commits`,`pull requests`,`merge conflicts`,`merge resolutions`) VALUES
-- ('','','','','','','','','');
-- INSERT INTO `orgs` (`id`,`orgname`,`avatar url`,`score`,`commits`,`pull requests`,`merge conflicts`,`merge resolutions`) VALUES
-- ('','','','','','','','');
-- INSERT INTO `users-orgs` (`id`,`user id`,`org id`) VALUES
-- ('','','');
-- INSERT INTO `friends` (`id`,`primary`,`secondary`,`confirmed`) VALUES
-- ('','','','');
