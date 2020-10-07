import { getRepository } from "typeorm";
import { Request, Response } from "express";
import { User } from "../entity/User";
import { validate } from 'class-validator';

export class UserController {

    // get all
    static getAll = async (req: Request, res: Response) => {
        const userRepository = getRepository(User);
        let users;
        try {
            users = await userRepository.find();            
        } catch (error) {
            res.status(400).json({ message: 'Some Goes Bad.!' });
        }

        if (users.length > 0) {
            res.send(users);
        } else {
            res.status(400).json({ message: 'no result' });
        }
    }

    // findbyid
    static getById = async (req: Request, res: Response) => {
        const { id } = req.params;
        const userRepository = getRepository(User);

        try {
            const users = await userRepository.findOneOrFail(id);
            res.send(users)
        } catch (error) {
            res.status(400).json({ message: 'no result' });
        }
    };

    // New User
    static newUser = async (req: Request, res: Response) => {
        const { userName, password, role } = req.body;
        const user = new User();

        user.userName = userName;
        user.Password = password;
        user.role = role;

        const errors = await validate(user, { validationError: { target: false, value: false } });

        if (errors.length > 0) {
            res.status(400).json({ errors });
            return;
        }

        const userRepository = getRepository(User);

        try {
            user.hashPassword();
            const users = await userRepository.save(user);
            // res.send(users)
            res.status(200).json({ message: 'User created', usuario: users });
        } catch (error) {
            console.log(error);
            res.status(409).json({ message: 'Username already exist' });
        }

    };

    // edit user
    static editUser = async (req: Request, res: Response) => {
        let user;
        const { id } = req.params;
        const { userName, role } = req.body;

        const userRepository = getRepository(User);

        try {
            user = await userRepository.findOneOrFail(id);
            user.userName = userName;
            user.role = role;
        } catch (error) {
            res.status(404).json({ message: 'User not found' });
        }

        const errors = await validate(user, { validationError: { target: false, value: false } });

        if (errors.length > 0) {
            return res.status(400).json({ errors }); 
        }

        try {
            await userRepository.save(user);
        } catch (error) {
            res.status(409).json({ message: 'Username already in use' });
        }

        res.status(201).json({ message: 'User Update' })
    };

    // delete User
    static deleteUser = async (req: Request, res: Response) => {
        const { id } = req.params;
        const userRepository = getRepository(User);
        let user;
        try {
            user = await userRepository.findOneOrFail(id);
        } catch (error) {
            res.status(404).json({ message: 'User not found' });
        }

        userRepository.delete(id);
        res.status(201).json({ message: 'User Deleted' });
    };

}

export default UserController;