const WTE_UserServices = {
    //  Inserts user into the table with and id, account name, username, password and email
    insertUser(knex, userInfo) {
        return knex
            .insert(userInfo)
            .into('whats_to_eat_user_table')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    //  Grabs user if a username and password match
    getByUserAndPass(knex, username, user_password) {
        return knex.from('whats_to_eat_user_table').select('id').where('username', username).where('user_password', user_password)
    },
    
    deleteUserById(knex, id, username, user_password) {
        return knex('whats_to_eat_user_table')
            .where({id, username, user_password})
            .delete()
    }
}

module.exports = WTE_UserServices;