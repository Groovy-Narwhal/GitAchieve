-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2016-05-11 00:38:14.558

-- tables
-- Table: branches
CREATE TABLE branches (
    id_ga serial  NOT NULL,
    updated_ga timestamp  NOT NULL,
    sha varchar(40)  NULL,
    name varchar(100)  NULL,
    CONSTRAINT branches_pk PRIMARY KEY (id_ga)
);

-- Table: commits
CREATE TABLE commits (
    id_ga serial  NOT NULL,
    updated_ga timestamp  NOT NULL,
    sha varchar(40)  NULL,
    commit_message varchar(100)  NULL,
    commit_author_date timestamp  NULL,
    user_id int  NOT NULL,
    CONSTRAINT commits_pk PRIMARY KEY (id_ga)
);

-- Table: commits_repos
CREATE TABLE commits_repos (
    id_ga serial  NOT NULL,
    created_ga timestamp  NOT NULL,
    commit_id_ga int  NOT NULL,
    repo_id int  NOT NULL,
    CONSTRAINT commits_repos_pk PRIMARY KEY (id_ga)
);

-- Table: orgs
CREATE TABLE orgs (
    id int  NOT NULL,
    updated_ga timestamp  NOT NULL,
    orgname varchar(100)  NULL,
    avatar_url varchar(200)  NULL,
    followers int  NULL,
    following int  NULL,
    score int  NULL,
    CONSTRAINT orgs_pk PRIMARY KEY (id)
);

-- Table: orgs_repos
CREATE TABLE orgs_repos (
    id_ga int  NOT NULL,
    created_ga timestamp  NOT NULL,
    org_id int  NOT NULL,
    repo_id int  NOT NULL,
    CONSTRAINT orgs_repos_pk PRIMARY KEY (id_ga)
);

-- Table: pull_requests
CREATE TABLE pull_requests (
    id int  NOT NULL,
    updated_ga timestamp  NOT NULL,
    user_id int  NOT NULL,
    state varchar(10)  NULL,
    diff_url varchar(200)  NULL,
    created_at timestamp  NULL,
    closed_at timestamp  NULL,
    milestone varchar(100)  NULL,
    base_ref varchar(50)  NULL,
    base_repo_watchers_count int  NULL,
    base_repo_stargazers_count int  NULL,
    CONSTRAINT pull_requests_pk PRIMARY KEY (id)
);

-- Table: repos
CREATE TABLE repos (
    id int  NOT NULL,
    updated_ga timestamp  NULL,
    created_at timestamp  NULL,
    name varchar(100)  NULL,
    owner varchar(100)  NULL,
    watchers_count int  NULL,
    stargazers_count int  NULL,
    forks_count int  NULL,
    org_commit_activity text  NULL,
    CONSTRAINT repos_pk PRIMARY KEY (id)
);

-- Table: repos_branches
CREATE TABLE repos_branches (
    id_ga serial  NOT NULL,
    created_ga timestamp  NOT NULL,
    repo_id int  NOT NULL,
    branch_id_ga int  NOT NULL,
    CONSTRAINT repos_branches_pk PRIMARY KEY (id_ga)
);

-- Table: repos_stats
CREATE TABLE repos_stats (
    id_ga serial  NOT NULL,
    created_ga timestamp  NOT NULL,
    repo_id int  NOT NULL,
    stats_id_ga int  NOT NULL,
    CONSTRAINT repos_stats_pk PRIMARY KEY (id_ga)
);

-- Table: stats
CREATE TABLE stats (
    id_ga serial  NOT NULL,
    updated_ga timestamp  NOT NULL,
    author_id int  NULL,
    total int  NULL,
    weeks text  NULL,
    CONSTRAINT stats_pk PRIMARY KEY (id_ga)
);

-- Table: users
CREATE TABLE users (
    id int  NOT NULL,
    created_ga timestamp  NOT NULL,
    updated_ga timestamp  NULL,
    signed_up boolean  NULL,
    username varchar(100)  NULL,
    email varchar(100)  NULL,
    avatar_url varchar(200)  NULL,
    followers int  NULL,
    following int  NULL,
    score int  NULL,
    longest_streak int  NULL,
    current_streak int  NULL,
    contributions_past_year int  NULL,
    commits_count int  NULL,
    repos_count int  NULL,
    pull_requests_count int  NULL,
    CONSTRAINT users_pk PRIMARY KEY (id)
);

-- Table: users_orgs
CREATE TABLE users_orgs (
    id_ga serial  NOT NULL,
    created_ga timestamp  NOT NULL,
    user_id int  NOT NULL,
    org_id int  NOT NULL,
    CONSTRAINT users_orgs_pk PRIMARY KEY (id_ga)
);

-- Table: users_repos
CREATE TABLE users_repos (
    id_ga serial  NOT NULL,
    created_ga timestamp  NOT NULL,
    repo_id int  NOT NULL,
    user_id int  NOT NULL,
    CONSTRAINT users_repos_pk PRIMARY KEY (id_ga)
);

-- Table: users_users
CREATE TABLE users_users (
    id_ga serial  NOT NULL,
    created_ga timestamp  NOT NULL,
    confirmed_at timestamp  NULL,
    primary_user_id int  NOT NULL,
    secondary_user_id int  NOT NULL,
    CONSTRAINT users_users_pk PRIMARY KEY (id_ga)
);

-- foreign keys
-- Reference: commits_repos_commits (table: commits_repos)
ALTER TABLE commits_repos ADD CONSTRAINT commits_repos_commits
    FOREIGN KEY (commit_id_ga)
    REFERENCES commits (id_ga)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: commits_repos_repos (table: commits_repos)
ALTER TABLE commits_repos ADD CONSTRAINT commits_repos_repos
    FOREIGN KEY (repo_id)
    REFERENCES repos (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: commits_users (table: commits)
ALTER TABLE commits ADD CONSTRAINT commits_users
    FOREIGN KEY (user_id)
    REFERENCES users (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: orgs_repos_orgs (table: orgs_repos)
ALTER TABLE orgs_repos ADD CONSTRAINT orgs_repos_orgs
    FOREIGN KEY (org_id)
    REFERENCES orgs (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: orgs_repos_repos (table: orgs_repos)
ALTER TABLE orgs_repos ADD CONSTRAINT orgs_repos_repos
    FOREIGN KEY (repo_id)
    REFERENCES repos (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: pull_requests_users (table: pull_requests)
ALTER TABLE pull_requests ADD CONSTRAINT pull_requests_users
    FOREIGN KEY (user_id)
    REFERENCES users (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: repos_branches_branches (table: repos_branches)
ALTER TABLE repos_branches ADD CONSTRAINT repos_branches_branches
    FOREIGN KEY (branch_id_ga)
    REFERENCES branches (id_ga)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: repos_branches_repos (table: repos_branches)
ALTER TABLE repos_branches ADD CONSTRAINT repos_branches_repos
    FOREIGN KEY (repo_id)
    REFERENCES repos (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: repos_stats_repos (table: repos_stats)
ALTER TABLE repos_stats ADD CONSTRAINT repos_stats_repos
    FOREIGN KEY (repo_id)
    REFERENCES repos (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: repos_stats_stats (table: repos_stats)
ALTER TABLE repos_stats ADD CONSTRAINT repos_stats_stats
    FOREIGN KEY (stats_id_ga)
    REFERENCES stats (id_ga)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: users_orgs_orgs (table: users_orgs)
ALTER TABLE users_orgs ADD CONSTRAINT users_orgs_orgs
    FOREIGN KEY (org_id)
    REFERENCES orgs (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: users_orgs_users (table: users_orgs)
ALTER TABLE users_orgs ADD CONSTRAINT users_orgs_users
    FOREIGN KEY (user_id)
    REFERENCES users (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: users_repos_repos (table: users_repos)
ALTER TABLE users_repos ADD CONSTRAINT users_repos_repos
    FOREIGN KEY (repo_id)
    REFERENCES repos (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: users_repos_users (table: users_repos)
ALTER TABLE users_repos ADD CONSTRAINT users_repos_users
    FOREIGN KEY (user_id)
    REFERENCES users (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: users_users_users1 (table: users_users)
ALTER TABLE users_users ADD CONSTRAINT users_users_users1
    FOREIGN KEY (primary_user_id)
    REFERENCES users (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: users_users_users2 (table: users_users)
ALTER TABLE users_users ADD CONSTRAINT users_users_users2
    FOREIGN KEY (secondary_user_id)
    REFERENCES users (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- sequences
-- Sequence: Sequence_3
CREATE SEQUENCE Sequence_3
      NO MINVALUE
      NO MAXVALUE
      NO CYCLE
;

-- End of file.

