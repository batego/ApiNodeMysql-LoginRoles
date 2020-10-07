import { getRepository } from 'typeorm';
import { Request, Response } from "express";
import { User } from "../entity/User"
import { checkJwt } from '../middleware/jwt';
import * as jwt from 'jsonwebtoken';
import config from '../config/config';
import { validate } from 'class-validator';


export class AuthController {
    static login = async (req: Request, res: Response) => {
        const { userName, password } = req.body;

        if (!(userName && password)) {
            res.status(400).json({ message: 'Username & Password are Required' });
        }

        const userRepository = getRepository(User);

        let user: User;

        try {
            user = await userRepository.findOneOrFail({ where: { userName } });
        } catch (error) {
            return res.status(400).json({ message: 'username or password incorrect!' });
        }

        if(!user.checkPassword(password)){
            return res.status(400).json({ message: 'username or password incorrect!' });
        }

        const token = jwt.sign({userId: user.id, username: user.userName}, config.jwtSecret,{expiresIn: '1h'});
        res.json({message: 'Ok', Token: token});
    };

    static changePassword = async(req: Request, res: Response) => {
        const { userId } = res.locals.jwtPayload;
        const { oldPassword, newPassword } = req.body;

        if (!(oldPassword && newPassword)) {
            return res.status(400).json({ message: 'oldPassword and newPassword are required!' });
        } 

        const userRepository = getRepository(User);
        let user: User;

        try {
            user = await userRepository.findOneOrFail(userId);
        } catch (error) {
            return res.status(400).json({ message: 'something paso.!!' });
        }

        if (!user.checkPassword(oldPassword)) {
            return res.status(401).json({ message: 'Check your old Password' });
        }

        user.Password = newPassword;
        const validationOps = { validationError: { target: false, value: false }};
        const errors = await validate(user, validationOps);

        if (errors.length > 0) {
            return res.status(401).json(errors);           
        }

        user.hashPassword();
        userRepository.save(user);
        res.json({message: 'Password change!'})

    };
}


export default AuthController;
