const { Model } = require('objection');
const bcrypt = require('bcrypt');

class User extends Model {
    static get tableName() {
        return 'users';
    }

    async $beforeInsert(queryContext) {
        await super.$beforeInsert(queryContext);
        this.password = await bcrypt.hash(this.password, 10);
    }

    async verifyPassword(password) {
        return bcrypt.compare(password, this.password);
    }
}

module.exports = User;