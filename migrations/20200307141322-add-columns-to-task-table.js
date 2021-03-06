'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  return Promise.all([  
    db.addColumn('task', 'detail_length', { type: 'character varying' }),
    db.addColumn('task', 'detail_selection', { type: 'character varying' }),

  ]);
};

exports.down = function (db) {
  return Promise.all([  
    db.removeColumn('task', 'detail_length', { type: 'character varying' }),
    db.removeColumn('task', 'detail_selection', { type: 'character varying' }),

  ]);
};

