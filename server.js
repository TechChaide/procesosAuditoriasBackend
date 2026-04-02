require('dotenv').config();

const app = require('./src/app');
const http = require('http');
const { inicializarCronJobs } = require('./src/crons/auditoria-notificacion.cron');
const port = process.env.PORT || 5400;

const server = http.createServer(app);

server.listen(port, () => {
    console.log("=============================================");
    console.log("=                                           =");
    console.log(`= Backend running: http://localhost:${port} =`);
    console.log("=                                           =");
    console.log("=============================================");
    
    // Inicializar tareas cron después de que el servidor esté activo
    setTimeout(() => {
        inicializarCronJobs();
    }, 2000);
});

server.on('error', error => {
    if (error.syscall !== 'listen') throw error;

    switch (error.code) {
        case 'EACCES':
            console.error(`Port ${port} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`Port ${port} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
});