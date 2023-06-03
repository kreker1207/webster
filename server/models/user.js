const Entity = require('./entity');

module.exports = class User extends Entity {
    constructor(tableName) {
        super(tableName);
    }

    async get(login, email){
        if (email) {
            return await super.table().select('*')
            .where('login', '=', login)
            .orWhere('email', 'like', `%${email}`)
            .first();
        }
        return super.get({login: login});
    }
   
    async findByIdAndUpdate(userId,password){
        return await super.table().where({id:userId}).update({password: password});
    }
    
    async getUserByEmail(email){
        if(email){
            return await super.table().select('users.*').where('email',email).first();
        }
    }
}
