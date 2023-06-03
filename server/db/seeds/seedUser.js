const bcrypt = require('bcryptjs');
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
 const hashedPassword = bcrypt.hashSync('admin',8)
 exports.seed = async function(knex) {
    await knex('users').insert([
      {id: 1, login: 'admin',email:'admin@gmail.com',password:hashedPassword},
      {id: 2, login: 'user',email:'user@gmail.com',password:hashedPassword},
    ]);
  };
  