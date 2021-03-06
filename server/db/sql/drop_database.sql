-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2016-05-19 18:31:01.344

-- foreign keys
ALTER TABLE IF EXISTS commits
    DROP CONSTRAINT commits_branches;

ALTER TABLE IF EXISTS commits_repos
    DROP CONSTRAINT commits_repos_commits;

ALTER TABLE IF EXISTS commits_repos
    DROP CONSTRAINT commits_repos_repos;

ALTER TABLE IF EXISTS commits
    DROP CONSTRAINT commits_users;

ALTER TABLE IF EXISTS orgs_repos
    DROP CONSTRAINT orgs_repos_orgs;

ALTER TABLE IF EXISTS orgs_repos
    DROP CONSTRAINT orgs_repos_repos;

ALTER TABLE IF EXISTS pull_requests
    DROP CONSTRAINT pull_requests_users;

ALTER TABLE IF EXISTS repos_branches
    DROP CONSTRAINT repos_branches_branches;

ALTER TABLE IF EXISTS repos_branches
    DROP CONSTRAINT repos_branches_repos;

ALTER TABLE IF EXISTS stats
    DROP CONSTRAINT stats_orgs;

ALTER TABLE IF EXISTS stats
    DROP CONSTRAINT stats_repos;

ALTER TABLE IF EXISTS stats
    DROP CONSTRAINT stats_users;

ALTER TABLE IF EXISTS users_orgs
    DROP CONSTRAINT users_orgs_orgs;

ALTER TABLE IF EXISTS users_orgs
    DROP CONSTRAINT users_orgs_users;

ALTER TABLE IF EXISTS users_repos
    DROP CONSTRAINT users_repos_repos;

ALTER TABLE IF EXISTS users_repos
    DROP CONSTRAINT users_repos_users;

ALTER TABLE IF EXISTS users_users
    DROP CONSTRAINT users_users_primary_repos;

ALTER TABLE IF EXISTS users_users
    DROP CONSTRAINT users_users_secondary_repos;

ALTER TABLE IF EXISTS users_users
    DROP CONSTRAINT users_users_users1;

ALTER TABLE IF EXISTS users_users
    DROP CONSTRAINT users_users_users2;

-- tables
DROP TABLE IF EXISTS branches CASCADE;

DROP TABLE IF EXISTS commits CASCADE;

DROP TABLE IF EXISTS commits_repos CASCADE;

DROP TABLE IF EXISTS orgs CASCADE;

DROP TABLE IF EXISTS orgs_repos CASCADE;

DROP TABLE IF EXISTS pull_requests CASCADE;

DROP TABLE IF EXISTS repos CASCADE;

DROP TABLE IF EXISTS repos_branches CASCADE;

DROP TABLE IF EXISTS stats CASCADE;

DROP TABLE IF EXISTS users CASCADE;

DROP TABLE IF EXISTS users_orgs CASCADE;

DROP TABLE IF EXISTS users_repos CASCADE;

DROP TABLE IF EXISTS users_users CASCADE;

-- sequences
DROP SEQUENCE IF EXISTS Sequence_3;

-- End of file.

