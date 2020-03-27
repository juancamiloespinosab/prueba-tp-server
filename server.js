let express = require('express')
let app = express()
let http = require('http')
let bodyParser = require('body-parser')

class conexion {

    constructor() {

        this.mysql = require('mysql');

        this.connection

    }

    iniciar(){
        this.connection = this.mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'a123',
            database: 'prueba-angular',
            port: 3301
        });

        this.connection.connect(function (error) {
            if (error) {
                throw error;
            } else {
                console.log('Conexion correcta.');
            }
        });
    }

    terminar() {
        this.connection.end();
    }


}

class consultas {


    constructor() {
        this.conexion = new conexion();
    }

    insertarReporte(data, returnData) {

        this.conexion.iniciar()

        let query = this.conexion.connection.query(`INSERT INTO reportes VALUES(null, ${data.documento}, '${data.nombres}', '${data.fechaInicio}', '${data.fechaFin}', ${data.horaInicio}, ${data.horaFin}, ${data.horaInicioExtra}, ${data.horaFinExtra}, '${data.motivoExtra}')`, (error, result) => {
            if (error) {
                returnData(error)
                throw error;
            } else {
                returnData(result)
            }
        }
        );

        this.conexion.terminar()
    }

    consultarReporte(returnData) {
        this.conexion.iniciar()

        let query = this.conexion.connection.query(`SELECT * FROM reportes`, (error, result) => {
            if (error) {
                returnData(error)
                throw error;
            } else {
                returnData(result)
            }
        }
        );

        this.conexion.terminar()
    }

}

let sql = new consultas();

app.use(bodyParser.json({ extended: false }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


app.get('/consultarReportes', (req, res) => {
    sql.consultarReporte(data => {
        res.status(200).send(data)
    })
})

app.post('/insertarReporte', (req, res) => {
    sql.insertarReporte(req.body, data => {

        res.status(200).send(data)
    })
})

http.createServer(app).listen(8001, () => {
    console.log("start server")
})