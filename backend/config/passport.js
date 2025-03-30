//passport.js
const passport=require("passport");
const LocalStrategy=require("passport-local").Strategy;
const bcrypt=require("bcryptjs");


module.exports=(client)=>{
    passport.use(
        new LocalStrategy({usernameField:"username"},async(username,password,done)=>{
            try{
                const result = await client.query("SELECT * FROM users WHERE username=$1",[username]);
                if(result.rows.length===0){
                    return done(null,false,{message:"No user found with that username"});
                }

                const user= result.rows[0];
                const isMatch =await bcrypt.compare(password,user.password);
                if(!isMatch){
                    return done(null,false,{message:"Incorrect password."});
                }
                return done(null,user);
            }catch(err){
                return done(err);
            }

        })
    );
    passport.serializeUser((user,done)=>{
        done(null,user.user_id);
    })

    passport.deserializeUser(async (user_id,done)=>{
        try{
            const result= await client.query("SELECT * FROM users WHERE user_id=$1",[user_id]);
            if(result.rows.length===0){
                return done(null,false);
            }
            done(null,result.rows[0]);
        }catch(err){
            done(err);
        }
    });

    return passport;
};
