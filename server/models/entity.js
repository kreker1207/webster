const  db = require('knex')(require('../db/knexfile'));

const { attachPaginate } = require('knex-paginate');
attachPaginate();

module.exports = class Entity {
    constructor(tableName) {
        this.tableName = tableName;
    }

    table () {
        return db(this.tableName)
    }

    async get(searchObj, isAll = false) {
        const result =  await this.table().select('*').where(searchObj);
        if (isAll) return result;
        else return result[0];
    }

    async getById(id) {
        return await this.table().select('*').where({id: id}).first();
    }

    async getAll(page = null, limit = 20) {
        if (page === null || page === undefined) {
          page = 0;
        }
        return await this.table().paginate({ isLengthAware: true, perPage: limit, currentPage: page });

      }

    async set(setObj) {
        console.log('-----------------------------')
        console.log(setObj)
        console.log('-----------------------------')
        if (setObj.id) {
            return await this.table().returning('*').where({id: setObj.id}).update(setObj)
            .catch((error)=>{console.error(`Error inserting into ${this.tableName}:`, error); throw error});
        }
        return await this.table().returning('*').insert(setObj)
        .catch((error)=>{console.error(`Error inserting into ${this.tableName}:`, error); throw error});
    }

    async del(searchObj) {
        return await this.table().where(searchObj).del();
    }
}