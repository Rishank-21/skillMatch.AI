// import jwt from 'jsonwebtoken';
// //helper
// export const isAuth = (req , res , next) => {
//     const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ' , '') || req.body.token;
//     if(!token){
//         return res.status(401).json({ error : 'No token , authorization denied' });
//     }
//     try {
//         const decoded = jwt.verify(token , process.env.JWT_SECRET);
//         req.user = decoded;
//         next();
//     } catch (error) {
//         return res.status(401).json({ error : 'Token is not valid' });
//     }
// }

import jwt from "jsonwebtoken";

export const isAuth = (req, res, next) => {
  const token =
    req.cookies?.token ||
    req.header("Authorization")?.replace("Bearer ", "") ||
    req.body?.token;

  if (!token) {
    return res.status(401).json({ error: "No token , authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ error: "Token is not valid" });
  }
};
