import {Router} from 'express';
import { sample_users } from '../data';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { User, UserModel } from '../models/user.model';
import { HTTP_BAD_REQUEST } from '../constants/http_status';
import bcrypt from 'bcryptjs';
const router = Router();

router.get("/seeds", asyncHandler(
    async (req,resp)=>{
        const userCount =await UserModel.countDocuments();
        if(userCount>0){
            resp.send('Food is already send');
            return;
        } 
        await UserModel.create(sample_users);
        resp.send('seed send successfull');
    }
))

router.post("/login", asyncHandler(
    async (req, res) => {
      const {email, password} = req.body;
      const user = await UserModel.findOne({email , password});
        
       if(user) {
        res.send(generateTokenReponse(user));
       }
       else{
         res.status(HTTP_BAD_REQUEST).send("Username or password is invalid!");
       }
    
    }
  ))
  router.post('/register', asyncHandler(
    async (req, res) => {
      const {name, email, password, address} = req.body;
      const user = await UserModel.findOne({email});
      if(user){
        res.status(HTTP_BAD_REQUEST)
        .send('User is already exist, please login!');
        return;
      }
  
      const encryptedPassword = await bcrypt.hash(password, 10);
  
      const newUser:User = {
          id: '',
          name,
          email: email.toLowerCase(),
          password: password,
          address,
          isAdmin: false,
      }
  
      const dbUser = await UserModel.create(newUser);
      res.send(generateTokenReponse(dbUser));
    }
  ))
  
const generateTokenReponse = (user :any) => {
    const token = jwt.sign({
      email:user.email,isAdmin:user.isAdmin
    },'SomeRandomText',{
      expiresIn:"30d"
    });
    user.token=token
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      address: user.address,
      isAdmin: user.isAdmin,
      token: token
    };

}


export default router;