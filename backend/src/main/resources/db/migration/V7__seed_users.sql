-- Demo passwords will be hashed later via Java code.
INSERT INTO users (id, username, password_hash, role, display_name)
VALUES
  (gen_random_uuid(), 'admin',  'PLACEHOLDER', 'ADMIN',  'Admin User'),
  (gen_random_uuid(), 'worker', 'PLACEHOLDER', 'WORKER', 'Worker User');
