//conf servidor
const express= require('express')
const server = express()

//conf servidor para apresentar arquivos estaticos
server.use(express.static('public'))

//habilitar body do formulário
server.use(express.urlencoded({extended: true}))

//cof a conexão com banco de dados
const Poll = require('pg').Pool
const db = new Poll({
    user: 'postgres',
    password: '98653189',
    host:'localhost',
    port:5432,
    database: 'doe'   
})

//conf a templete engine
const nunjucks= require('nunjucks')
nunjucks.configure('./',{
    express: server,
    noCache: true
})

//conf apresentação da página
server.get('/', function(req, res){
    db.query("SELECT * FROM donors", function(err, result){
        if(err) return res.send('Erro de banco de dados')

        const donors= result.rows
        return res.render('index.html', {donors})
    })
    })
   

server.post('/', function(req, res){
    const name = req.body.name
    const email = req.body.email
    const blood= req.body.blood

    const query= `
        INSERT INTO donors("name", "email", "blood")
        VALUES($1, $2, $3 )`

    if(name== "" || email== "" ||blood=="")
    {
        return res.send('Todos os campos são obrigatórios')
    }

    const values=[name, email, blood] 
    db.query(query, values, function(err){
        if(err) return res.send("Erro no banco de dados")
        
        return res.redirect('/')
    }) 
})

server.listen(3000, function(){
    console.log('Inicie o servidor!')
})