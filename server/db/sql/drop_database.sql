-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2016-05-13 19:16:42.467

-- foreign keys
ALTER TABLE commits_repos
    DROP CONSTRAINT commits_repos_commits;

ALTER TABLE commits_repos
    DROP CONSTRAINT commits_repos_repos;

ALTER TABLE commits
    DROP CONSTRAINT commits_users;

ALTER TABLE orgs_repos
    DROP CONSTRAINT orgs_repos_orgs;

ALTER TABLE orgs_repos
    DROP CONSTRAINT orgs_repos_repos;

ALTER TABLE pull_requests
    DROP CONSTRAINT pull_requests_users;

ALTER TABLE repos_branches
    DROP CONSTRAINT repos_branches_branches;

ALTER TABLE repos_branches
    DROP CONSTRAINT repos_branches_repos;

ALTER TABLE stats
    DROP CONSTRAINT stats_orgs;

ALTER TABLE stats
    DROP CONSTRAINT stats_repos;

ALTER TABLE stats
    DROP CONSTRAINT stats_users;

ALTER TABLE users_orgs
    DROP CONSTRAINT users_orgs_orgs;

ALTER TABLE users_orgs
    DROP CONSTRAINT users_orgs_users;

ALTER TABLE users_repos
    DROP CONSTRAINT users_repos_repos;

ALTER TABLE users_repos
    DROP CONSTRAINT users_repos_users;

ALTER TABLE users_users
    DROP CONSTRAINT users_users_primary_repos;

ALTER TABLE users_users
    DROP CONSTRAINT users_users_secondary_repos;

ALTER TABLE users_users
    DROP CONSTRAINT users_users_users1;

ALTER TABLE users_users
    DROP CONSTRAINT users_users_users2;

-- tables
DROP TABLE branches CASCADE;

DROP TABLE commits CASCADE;

DROP TABLE commits_repos CASCADE;

DROP TABLE orgs CASCADE;

DROP TABLE orgs_repos CASCADE;

DROP TABLE pull_requests CASCADE;

DROP TABLE repos CASCADE;

DROP TABLE repos_branches CASCADE;

DROP TABLE stats CASCADE;

DROP TABLE users CASCADE;

DROP TABLE users_orgs CASCADE;

DROP TABLE users_repos CASCADE;

DROP TABLE users_users CASCADE;

-- sequences
DROP SEQUENCE IF EXISTS Sequence_3;

-- End of file.

