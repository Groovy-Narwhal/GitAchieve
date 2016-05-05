-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2016-05-04 18:15:02.758

-- foreign keys
ALTER TABLE IF EXISTS commits_repos
    DROP CONSTRAINT commits_repos_commits;

ALTER TABLE IF EXISTS commits_repos
    DROP CONSTRAINT commits_repos_repos;

ALTER TABLE IF EXISTS commits
    DROP CONSTRAINT commits_users;

ALTER TABLE IF EXISTS pull_requests
    DROP CONSTRAINT pull_requests_users;

ALTER TABLE IF EXISTS repos_branches
    DROP CONSTRAINT repos_branches_branches;

ALTER TABLE IF EXISTS repos_branches
    DROP CONSTRAINT repos_branches_repos;

ALTER TABLE IF EXISTS repos_stats
    DROP CONSTRAINT repos_stats_repos;

ALTER TABLE IF EXISTS repos_stats
    DROP CONSTRAINT repos_stats_stats;

ALTER TABLE IF EXISTS users_orgs
    DROP CONSTRAINT users_orgs_orgs;

ALTER TABLE IF EXISTS users_orgs
    DROP CONSTRAINT users_orgs_users;

ALTER TABLE IF EXISTS users_repos
    DROP CONSTRAINT users_repos_repos;

ALTER TABLE IF EXISTS users_repos
    DROP CONSTRAINT users_repos_users;

ALTER TABLE IF EXISTS users_users
    DROP CONSTRAINT users_users_users1;

ALTER TABLE IF EXISTS users_users
    DROP CONSTRAINT users_users_users2;

-- tables
DROP TABLE IF EXISTS branches;

DROP TABLE IF EXISTS commits;

DROP TABLE IF EXISTS commits_repos;

DROP TABLE IF EXISTS orgs;

DROP TABLE IF EXISTS pull_requests;

DROP TABLE IF EXISTS repos;

DROP TABLE IF EXISTS repos_branches;

DROP TABLE IF EXISTS repos_stats;

DROP TABLE IF EXISTS stats;

DROP TABLE IF EXISTS users;

DROP TABLE IF EXISTS users_orgs;

DROP TABLE IF EXISTS users_repos;

DROP TABLE IF EXISTS users_users;

-- sequences
DROP SEQUENCE IF EXISTS Sequence_3;

-- End of file.

