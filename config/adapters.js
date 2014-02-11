/**
 * Global adapter config
 * 
 * The `adapters` configuration object lets you create different global "saved settings"
 * that you can mix and match in your models.  The `default` option indicates which 
 * "saved setting" should be used if a model doesn't have an adapter specified.
 *
 * Keep in mind that options you define directly in your model definitions
 * will override these settings.
 *
 * For more information on adapter configuration, check out:
 * http://sailsjs.org/#documentation
 */

module.exports.adapters = {

  // If you leave the adapter config unspecified 
  // in a model definition, 'default' will be used.
  'default': process.env.NODE_ENV || 'development',

  // In-memory adapter for DEVELOPMENT ONLY
  memory: {
    module: 'sails-memory'
  },

  // Persistent adapter for DEVELOPMENT ONLY
  // (data IS preserved when the server shuts down)
  disk: {
    module: 'sails-disk'
  },

  // Heroku Postgre SQL has connection limit up to 500
  // psql "dbname=d8n4i2f6q5clp2 host=ec2-54-225-88-13.compute-1.amazonaws.com user=u7nsa3j4q3ng05 password=pf3koh48m9br384km90u7kng962 port=5642 sslmode=require"
  production: {
    module   : 'sails-postgresql',
    host     : 'ec2-54-225-88-13.compute-1.amazonaws.com',
    port     : 5642,
    user     : 'u7nsa3j4q3ng05',
    password : 'pf3koh48m9br384km90u7kng962',
    database : 'd8n4i2f6q5clp2',
    ssl      : true
  },

  // Heroku Postgre SQL has connection limit up to 500
  // psql "dbname=dc7df0gak3bkvh host=ec2-54-197-241-97.compute-1.amazonaws.com user=mpurikshxalrea password=8n2N7DlIeC5CaZyQMHuk4C8f1s port=5432 sslmode=require"
  development: {
    module   : 'sails-postgresql',
    host     : 'ec2-54-197-241-97.compute-1.amazonaws.com',
    port     : 5432,
    user     : 'mpurikshxalrea',
    password : '8n2N7DlIeC5CaZyQMHuk4C8f1s',
    database : 'dc7df0gak3bkvh',
    ssl      : true
  }

};