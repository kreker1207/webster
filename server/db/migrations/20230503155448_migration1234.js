/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return Promise.all([
        knex.schema.createTable('users', (table) => {
          table.increments('id').primary();
          table.string('login', 40).notNullable().unique();
          table.string('email', 80).notNullable().unique();
          table.string('password', 128).notNullable();
          table.string('profile_pic', 128).notNullable().defaultTo('none.png');
          table.boolean('is_active').defaultTo(true);
          table.timestamps(true, true);
        }),
    
        knex.schema.createTable('project',(table)=>{
          table.increments('id').primary();
          table.integer('owner_id').unsigned().notNullable();
          table.string('project_name').defaultTo('unnamedProj');
          table.boolean('changeGlobalState').notNullable().defaultTo(false);
          table.integer('scale').notNullable();
          table.integer('editLayer').notNullable();
          table.integer('lastX').notNullable();
          table.integer('lastY').notNullable();
          table.integer('adjustedX').notNullable();
          table.integer('adjustedY').notNullable();
          table.integer('width').notNullable();
          table.integer('height').notNullable();
          table.boolean('changeObjectsState').notNullable().defaultTo(false);
          table.boolean('layerButtonsLogic').notNullable().defaultTo(false);

          table.foreign('owner_id').references('id').inTable('users').onDelete('cascade');        }),
        
        knex.schema.createTable('layer', (table) => {
          table.increments('id').primary();
          table.integer('project_id').unsigned().notNullable();       
          table.string('type').notNullable();
          table.integer('x').notNullable();
          table.integer('y').notNullable();
          table.integer('visibleWidth').notNullable();
          table.integer('visibleHeight').notNullable();
          table.integer('lastX').notNullable();            
          table.integer('lastY').notNullable();
          table.integer('adjustedX').notNullable();
          table.integer('adjustedY').notNullable();
          table.integer('rotate').notNullable();
          table.integer('resize').notNullable();
          table.integer('image_id').unsigned();
          table.integer('index');
          table.integer('text_id').unsigned(); 
          table.integer('graphic_img_id').unsigned();  
          table.integer('graphic_id').unsigned();

          table.foreign('image_id').references('id').inTable('image').onDelete('cascade');
          table.foreign('text_id').references('id').inTable('text').onDelete('cascade');
          table.foreign('graphic_img_id').references('id').inTable('graphic_img').onDelete('cascade');
          table.foreign('graphic_id').references('id').inTable('graphic').onDelete('cascade');

          table.foreign('project_id').references('id').inTable('project').onDelete('cascade');
        }),

        knex.schema.createTable('image',(table)=>{
          table.increments('id').primary();
          table.string('name').notNullable();
          table.integer('width').notNullable();
          table.integer('height').notNullable();
        }),
        knex.schema.createTable('text',(table)=>{
          table.increments('id').primary();
          table.string('name').notNullable();
          table.integer('maxWidth').notNullable();
          table.string('fillStyle').notNullable();
          table.string('textAlign').notNullable();
          table.smallint('fontSize').unsigned().notNullable();
          table.enu('fontFamily', ['Arial', 'Times', 'Helvetica', 'Verdana', 'Calibri','Georgia','Garamond','Futura','Roboto','Sans'],
                { useNative: true, enumName: 'fontFamily' }).defaultTo('Arial');
          table.boolean('italic').defaultTo(false);
          table.boolean('bold').defaultTo(false);
          table.boolean('textUnderlined').defaultTo(false);
          table.boolean('textCrossedOut').defaultTo(false);
        }),

        knex.schema.createTable('graphic_img',(table)=>{
          table.increments('id').primary();
          table.string('name').notNullable();
          table.integer('width').notNullable();
          table.integer('height').notNullable();
        }),
        knex.schema.createTable('graphic',(table)=>{
          table.increments('id').primary();
          table.integer('angles').notNullable();
          table.string('color').notNullable();
          table.string('name').notNullable();
          table.integer('width').notNullable();
          table.integer('height').notNullable();
          table.integer('baseWidth').notNullable();
          table.integer('baseHeight').notNullable();
        }),
        knex.schema.createTable('filter',(table)=>{
          table.increments('id').primary();
          table.integer('project_id').unsigned().notNullable();

          table.integer('brightness').unsigned().notNullable();
          table.integer('blur').unsigned().notNullable();
          table.integer('greyScale').unsigned().notNullable();
          table.integer('hueRotate').unsigned().notNullable();
          table.integer('saturation').unsigned().notNullable();
          table.integer('contrast').unsigned().notNullable();

          table.foreign('project_id').references('id').inTable('project').onDelete('cascade');
        })

    ])
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
