/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('users', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    name: {
      type: 'VARCHAR(50)',
      notNull: false,
    },
    email: {
      type: 'TEXT',
      notNull: true,
      unique: true,
    },
    password: {
      type: 'TEXT',
      notNull: true,
    },
    verification_token: {
      type: 'TEXT',
      notNull: false,
    },
    is_verified: {
      type: 'BOOLEAN',
      notNull: true,
      default: false
    },
    created_at: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('current_timestamp')
    },
    updated_at: {
      type: 'TIMESTAMP',
      notNull: true,
    },
    login_count: {
      type: 'INTEGER',
      notNull: true,
      default: 0
    },
    last_login_at: {
      type: 'TIMESTAMP',
      notNull: false,
    },
    logout_at: {
      type: 'TIMESTAMP',
      notNull: false,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('users');
};