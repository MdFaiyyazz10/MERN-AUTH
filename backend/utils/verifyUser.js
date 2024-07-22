import jwt from 'jsonwebtoken'

// export const verifyToken = async (req,res , next)=> {
//     const token = req.cookies.access_token;

//     if(!token) return res.status(401).json({success: false , message: "You need to Login"})


//         jwt.verify(token , process.env.JWT_SECRET , (err , user) => {
//             if(err) return res.status(403).json({success: false , message: "Token is not valid"})

//                 req.user = user
                
//                 next()
//         });

// }

export const verifyToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) return res.status(401).json({ success: false, message: "You need to Login" });
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ success: false, message: "Token is not valid" });
  
      req.user = user;
      next();
    });
  };
  