// @ts-check
import 'dotenv/config'
import { createServer, IncomingMessage, Server, ServerResponse } from 'http';

class HealthChecker {

    server: Server<typeof IncomingMessage, typeof ServerResponse> = new Server()

    start() {
        const port: number = Number(process.env.PORT) ?? 1337;
        const hostname: string = process.env.HOST ?? "0.0.0.0"
        this.server = createServer((req, res) => {
            res.statusCode = 200;
        });
        this.server.listen(port, hostname, () => {
            console.log(`Server running at http://${hostname}:${port}/`)
        })
    }

    stop() {
        this.server.close();
    }
}

export default HealthChecker