const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server')

const SECRET_KEY = 'SECRET_KEY'

module.exports = (context) =>{
    const authHeader = context.req.headers.authorization;
    if(authHeader){
        const token = authHeader.split('Bearer ')[1];
        if(token){
            try{
                return jwt.verify(token,SECRET_KEY);
            }catch(err){
                  throw new AuthenticationError('Invalid / Expired Token');  
            }
        }
        throw new Error('Authentication token must be \'Bearer [token]');
    }
    throw new Error('Authorization header must be provided');    
}