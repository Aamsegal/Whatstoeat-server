const path = require('path');
const express = require('express');
const xss = require('xss');
const WTE_UserServices = require('./WTE_users-services');
const { v4: uuidv4 } = require('uuid');
const { serialize } = require('v8');

const userRouter = express.Router();
const jsonParser = express.json();

const serializeUser = userInfo => ({
    id: xss(userInfo.id),
    account_name: xss(userInfo.account_name),
    username: xss(userInfo.username),
    user_password: xss(userInfo.user_password),
    user_email: xss(userInfo.user_email)
})

userRouter
    .route('/')

    //  create a new user. After creating a user it also creates a login token
    .post(jsonParser, (req, res, next) => {
        const { account_name, username, user_password, user_email } = req.body;
        let id = req.body.id;

        if(id === undefined) {
            id = uuidv4();
        }
        
        const newUserInfo = { id, account_name, username, user_password, user_email };
        for(const [key, value] of Object.entries(newUserInfo)) {
                if(value === undefined || value === '')
                    return res.status(400).json({
                        error: {message: `Missing '${key}' value.`}
                    })
        }

        WTE_UserServices.insertUser(
            req.app.get('db'),
            newUserInfo
        )

        .then(user => {
            let uniqueLoginKey = uuidv4();
            let user_Id = user.id;

            const loginTableInfo = {id: uniqueLoginKey, login_table_user_id: user_Id}

            WTE_UserServices.insertLoginKey(
                req.app.get('db'),
                loginTableInfo
            )
            
            .then(loginToken => {

                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${user.id}`))
                    .json(loginToken)
            })
            
        })

        .catch(next)
    })

userRouter
    .route('/:username/:user_password')

    //  checks if there is an account with the username and password. If there is
    //return the login token for that
    .get((req, res, next) => {

        let account_name = '';

        WTE_UserServices.getByUserAndPass(
            req.app.get('db'),
            req.params.username,
            req.params.user_password
        )
   
        .then(user => {

            let user_id = user[0].id;
            account_name = user[0].account_name;

            const loginTableInfo = user_id

            WTE_UserServices.getLoginTokenByUserId(
                req.app.get('db'),
                loginTableInfo
            )

            .then(loginKey => {
                loginKey.push({account_name: account_name});
                res
                    .status(200)
                    .json(loginKey)
            })
        })

        .catch(next)
    })

//  Only for testing purposes. Users cannot access this api normally and even if 
//they could, it would require a lot of specific info to delete an account.
userRouter
    .route('/:id/:username/:user_password')

    .delete((req, res, next) => {

        WTE_UserServices.deleteUserById(
            req.app.get('db'),
            req.params.id,
            req.params.username,
            req.params.user_password
        )

        .then(deletedUser => {
            res
                .status(204)
                .json(deletedUser)
                .end()
        })
        .catch(next)
    })

module.exports = userRouter