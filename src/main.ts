import 'dotenv/config'
import logsole from "./vendor/logsole";
import App from '@infra/http/App';

const worker = new App();

worker.server.listen(process.env.PORT, () => logsole.success("Server listening at: " + process.env.PORT));


export default worker;