const express = require('express')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')



const MemberTable  = require('../model/member')

const router  = express.Router()

router.post('/',async(req,res) => {
    if(req.body.token != null){
        try{
            jwt.verify(req.body.token,"private-key",(err,decoded)=>{
                if (err) return res.status(401).json({"result":"unauthenticated_access"})
                return res.status(200).json({"result":"ok"})
            })
        }catch(e){
            res.status(500).json({})
        }
    }else{
        const email = req.body.email
        const password = req.body.password
        const member = await MemberTable.findOne({email:email})
        if(!member){
            return res.status(404).json({"result":"notmember"})
        }
        try{
            if(await bcryptjs.compare(password,member.password)){
                const payload = {
                    _id:member._id,
                    email:email
                }
                const token = jwt.sign(payload,"private-key",{expiresIn:'1h'})

                res.status(200).json({"token":token,"result":"ok"})
            }else{
                res.status(400).json({"result":"wrong_password"})
            }
        }catch(e){
            res.status(500).json({})
        }
    }
})


module.exports = router