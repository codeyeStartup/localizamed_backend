var app = require('./config/server'); 


app.listen(process.env.PORT || 8081, () => {
    console.log("api rodando na porta 8081!");
});