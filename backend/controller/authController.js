import { User } from "../modules/User.js";
import bcrypt from 'bcrypt';
import { generateToken } from "../utils/generateToken.js";

export const RegisterUser = async(req,res) => {
    try {
        const {username, email, password} = req.body;
        let user = await User.findOne({email:email})
        if(user) return res.status(201).json({message: "You have already have account"});
    
        bcrypt.genSalt(10, (err,salt) => {
            bcrypt.hash(password, salt, async(err,hash)=>{
                if(err) return res.status(401).json({message: err.message});
                else {
                    let user = await User.create({
                        email,
                        password: hash,
                        username
                    })
    
                    let token = generateToken(user);
                    res.cookie("token", token)
                    res.status(201).json({
                        success: true,
                        message: "User Created Successfully"
                    })
                }
            })
        })
        
    } catch (error) {
        console.log("Error in register User", error);
        res.status(400).json({
            success: false,
            message: "Failed to register"
        })
    }

    
}

export const LoginUser = async (req,res) => {
    const {email ,password}=req.body;
    let user=await  User.findOne({email:email});
    if(!user) return res.send("Email or Password incorrect");
    bcrypt.compare(password,user.password,function(err,result){
        if(result){
            let token= generateToken(user);
            console.log(token);
            res.cookie("token",token);
            const email = user.email;
            res.status(201).json({
                success: true,
                message: "User login Successfully",
                token,
            })
                 
        }
        else{
            return res.send("Email or Password incorrect");
          }
    })
}

