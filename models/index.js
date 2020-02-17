'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);

db.sequelize = sequelize;//프로퍼티 추가후 초기화
db.Sequelize = Sequelize;

db.Follow = require('./follow')(sequelize, Sequelize);

module.exports = db;
