const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const User = require('../../models/User');

//register
const registerUser = async (req, res) => {
    const { userName, email, password } = req.body;
    try {
        const checkUser=await User.findOne({email});
        if(checkUser){
            return res.json({success:false,message:"User already exists wit same email"})
        }
        const hashPassword=await bcrypt.hash(password,12);
        const newUser=new User({
            userName,email,password:hashPassword
        })
        await newUser.save()
        res.status(200).json({
            success:true,
            message:"Registertion succeessfull"
        })
    } catch (error) {
        res.status(500).json({ success: false, message: "Some error occured" })
    }
}

//login
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const checkUser = await User.findOne({ email });
        if (!checkUser) {
            return res.status(404).json({ success: false, message: "User doesn't exist" });
        }

        const checkPassword = await bcrypt.compare(password, checkUser.password);
        if (!checkPassword) {
            return res.status(401).json({ success: false, message: "Incorrect password" });
        }

        // Hardcoded secret key for debugging
        const hardcodedSecretKey = 'myHardcodedSecretKey';

        const token = jwt.sign({
            id: checkUser._id,
            role: checkUser.role,
            email: checkUser.email,
            userName:checkUser.userName
        }, hardcodedSecretKey, { expiresIn: '60m' });

        // res.cookie('token', token, { httpOnly: true, secure: true , maxAge: 24 * 60 * 60 * 1000});
        // return res.status(200).json({
        //     success: true,
        //     message: "Logged in successfully",
        //     user: { email: checkUser.email, role: checkUser.role, id: checkUser._id,userName:checkUser.userName }
        // });

          res.status(200).json({
            success:true,
            message:'Logged in successfully',
            token,
            user: { email: checkUser.email, role: checkUser.role, id: checkUser._id,userName:checkUser.userName }

          })

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ success: false, message: "Some error occurred", error: error.message });
    }
};

const logoutUser=(req,res)=>{
    res.clearCookie('token').json({success:true,message:"Logged out successfully"})
}

// const authMiddleware = async(req,res,next)=>{
//     const hardcodedSecretKey = 'myHardcodedSecretKey';
//     const token=req.cookies.token;
//     if(!token) return res.json({
//         success:false,
//         message:'Unauthorized user!'
//     })
//    try {
//     const decoded=jwt.verify(token ,hardcodedSecretKey);
//     req.user=decoded;
//     next()
//    } catch (error) {
//     res.status(401).json({
//         success:false,
//         message:'error in catch block!'
//     })
//    }


// }


const authMiddleware = async(req,res,next)=>{
   const authHeader = req.headers['authorization']
   const token = authHeader && authHeader.split(' ')[1]
    if(!token) return res.json({
        success:false,
        message:'Unauthorized user!'
    })
   try {
    const decoded=jwt.verify(token ,hardcodedSecretKey);
    req.user=decoded;
    next()
   } catch (error) {
    res.status(401).json({
        success:false,
        message:'error in catch block!'
    })
   }


}



module.exports={ registerUser ,loginUser ,logoutUser ,authMiddleware}



