const   USERS_TABLE = 'users',
        bcrypt = require('bcryptjs'),
        jwt = require('jsonwebtoken'),
        {validationResult} = require('express-validator'),
        {secret_access, secret_refresh, secret_mails} = require('../config'),
        User = require('../models/user'),
        Mailer = require('../middleware/mailer'),
        {CustomError, errorReplier} = require('../models/error');
//
const mailer = new Mailer();

const generateAccessToken = (user, hours) => {
    const payload = {
        id: user._id,
        login: user.login,
        email :user.email,
        profile_pic: user.profile_pic
    }
    return jwt.sign(payload, secret_access, {expiresIn: hours})
}
const generateRefreshToken = (user, hours) => {
    const payload = {
        id: user.id,
        login: user.login,
        email: user.email,
        profile_pic: user.profile_pic
    }
    return jwt.sign(payload, secret_refresh, {expiresIn: hours})
}

class authController{
    async registration(req, res){
        try{
            const errors = validationResult(req)
            if(! errors.isEmpty()){
                throw new CustomError(10);
            }

            const {login, password, email} = req.body;
            const user = new User(USERS_TABLE);
            const candidate = await user.get(login, email);
            if(candidate){
                console.log(candidate)
                if(candidate.login === login)
                    throw new CustomError(1004);
                throw new CustomError(1005);
            }

            const hashedPassword = bcrypt.hashSync(password,8)
            const userData = {
                login: login,
                password: hashedPassword,
                email: 'unconfirmed@@' + email,
            }
            const [pawn] = await user.set(userData);
            console.log(pawn)

            mailer.sendConfirmEmail(email, jwt.sign({
                email: email,
                login: login,
                id: pawn.id
            }, secret_mails, {expiresIn: '1h'}))
            return res.json({userData})
        }catch(e){
            e.addMessage = 'registration';
            errorReplier(e, res);
        }

    }

    async confirmEmail(req, res) {
        try{
            const {token} = req.params;
            const payload = jwt.verify(token, secret_mails);
            const user = new User(USERS_TABLE);
            await user.set({id: payload.id, email: payload.email});
            res.status(200).json({message: 'Email confirmed successfuly!'});
        }catch(e){
            e.addMessage = 'Email confirmation';
            errorReplier(e, res);
        }
    }

    async login(req, res){
        try{
            const {login, password} = req.body
            console.log(login, password)
            const user = new User(USERS_TABLE);
            const pawn = await user.get(login);

            if(!pawn){
                return res.status(400).json({message:`User with ${login} not found`})
            }
            const validPassword = bcrypt.compareSync(password,pawn.password)
            if (!validPassword){
                return res.status(400).json({message: `Wrong password`})
            }
            if (pawn.email.startsWith('unconfirmed@@')) {
                return res.status(400).json({message: `You need to confirm your email first`})
            }
            const accessToken = generateAccessToken(pawn,"15m")
            const refreshToken = generateRefreshToken(pawn,"1d")
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: 86400000,
                credentials: "include"
            });
            res.status(200).json({...pawn, accessToken, password: ''});
        }catch(e){
            e.addMessage = 'login';
            errorReplier(e, res);
        }

    }

    async profile(req, res) {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        try {
            const decoded = jwt.verify(refreshToken, secret_refresh, { ignoreExpiration: true });
            if (decoded.exp > Date.now()) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            try {
                jwt.verify(req.headers.authorization, secret_access)
                return res.status(200).json({...decoded});
            } catch (error) {
                const accessToken = generateAccessToken(decoded, "15m")
                return res.status(200).json({...decoded, password: '', accessToken});
            }

        } catch (e) {
            e.addMessage = 'registration';
            errorReplier(e, res);
        }
    }

    async logout (req, res) {
        if(!req.cookies.refreshToken) 
            res.status(401).json({message: "Unauthorised"});
        else 
            res.status(200).clearCookie('refreshToken', {path: '/'}).json({message: "Logged out"});
    }

    
}
module.exports = new authController()