import { Request, Response, NextFunction } from "express";
import * as jwt from 'jsonwebtoken';
import CONFIG from '../config/config';

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
    // console.log(req.headers);
    const token = <string>req.headers['auth'];
    let jwtPAyload;
    try {
        jwtPAyload = <any>jwt.verify(token,CONFIG.jwtSecret);
        res.locals.jwtPayload = jwtPAyload;
    } catch (error) {
        res.status(404).json({message: 'Not authorized'});
    }

    const { userId, username } = jwtPAyload;
    const newToken = jwt.sign({userId, username }, CONFIG.jwtSecret, {expiresIn: '1h'});
    res.setHeader('token', newToken);
    next();
};