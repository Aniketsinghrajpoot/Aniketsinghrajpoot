import { default as program } from 'commander';
import { default as restify} from 'restify-clients';
import * as util from 'util';
import { default as bcrypt } from 'bcrypt';
const saltRounds = 10;

var client_port;
var client_host;
var client_version = '*';
var client_protocol;
var authid = 'them';
var authcode = 'D4ED43CO-8BD6-4FE2-B358-7COE23OD11EF';

async function hashpass(password) {
    let salt = await bcrypt.genSalt(saltRounds);
    let hashed  = await bcrypt.hash(password, salt);
    return hashed;
}

const client = (program) => {
    if(typeof process.env.PORT === 'string')
    client_port  = Number.parseInt(process.env.PORT);
    if(typeof program.port === 'string')
    client_port = Number.parseInt(program.port);
    if(typeof program.host === 'string')
    client_host = program.host;
    if(typeof program.url === 'string'){
        let purl = new URL(program.url);
        if(purl.host && purl.host !=='') client_host = purl.host;
        if(purl.port && purl.port !=='') client_port = purl.port;
        if(purl.protocol && purl.protocol !== '') client_protocol = purl.protocol;
    }
    let connect_url = new URL('http://localhost:5858');
    if(client_protocol) connect_url.protocol = client_protocol;
    if(client_host) connect_url.host = client_host;
    if(client_port) connect_url.port = client_port;
    let client = restify.createJsonClient({
        url: connect_url.href,
        version: client_version
    });
    client.basicAuth(authid, authcode);
    return client;
}

program
.option('-p, --port <port>',
'port number for user server, if using localhost')
.option('-h, --host <host>',
        'port number for use server, if using localhost')
.option('-u, --url <url>',
        'Conection URL for use server, if using a remote server')        




program
    .command('add <username>')
    .description('Add a user to the user server')
    .option('--password <password>', 'password for new user')
    .option('--family-name <familyName>', 'Family name, or last name, of the user')
    .option('--given-name <givenName>', 'givin name, or first name, of the user')
    .option('--middle-name <middleName>', 'middle name of the user')
    .option('--email <email>', 'Email address for the user')
    .action(async(username, cmdObj) =>{
        const topost= {
            username, password:await hashpass(cmdObj.password), provider: "local",
            familyName: cmdObj.familyName,
            givenName: cmdObj.givenName,
            middleName: cmdObj.middleName,
            emails: [], photos: []
        };
        if(typeof cmdObj.email !== 'undefined')
        topost.emails.push(cmdObj.email);
        console.log(topost);
        client(program).post('/create-user', topost,
        (err, req, res, obj) =>{
            if(err) console.error(err.stack);
            else console.log('Created '+ util.inspect(obj));
        });
    });



    program
        .command('find-or-create <username>')
        .description('Add a user to theuser server')
        .option('--password <password>', 'password for new user')
        .option('--family-name <familyName>', 'family name, or last name, of the user')
        .option('--given-name <givenName>', 'given Name, or first name, of the user')
        .option('--middle-name <middleName>', 'middle name of the user')
        .option('--email <email>', 'email address for the user')
        .action(async(username, cmdObj) =>{
                    const topost = {
                        username, password: await hashpass(cmdObj.password), provider: "local",
                        familyName: cmdObj.familyName,
                        givenName: cmdObj.givenName,
                        middleName : cmdObj.middleName,
                        emails: [], photos: []
                    };
                    if(typeof cmdObj.email !=='undefined')
                    topost.emails.push(cmdObj.email);
                    client(program).post('/find-or-create', topost,
                    (err, req, res, obj) => {
                        if(err) console.error(err.stack);
                        else console.log('found or Created '+ util.inspect(obj) );
                    });
        });



    program
        .command('find <username>')
        .description('search for a user on the user server')
        .action((username, cmdObj) =>{
            client(program).get(`/find/${username}`,
                (err, req, res, obj) => {
                    if(err) console.error(err.stack);
                    else console.log('found' + util.inspect(obj));
                });
        });

        
    program
        .command('list-users')
        .description('list all users on the user server')
        .action((cmdObj) =>{
            client(program).get('/list', (err, req, res, obj) => {
                if(err) console.error(err.stack);
                else console.log(obj);
            });
        });


    program
        .command('update <username>')
        .description('add a user to the user server')
        .option('--password <password>', 'password for new user')
        .option('--family-name <familyName>','family name, or last name, of the user')
        .option('--given-name <givenName>', 'given name, or first name, of the user')
        .option('--middle-name <middleName>', 'middle name of the user')
        .option('--email <email>', 'email address for the user')
        .action(async(username, cmdObj) =>{
            const topost = {
                username, password:await hashpass(cmdObj.password),
                familyName: cmdObj.familyName,
                givenName: cmdObj.givenName,
                middleName: cmdObj.middleName,
                emails: [], photos: []
            };
            if(typeof cmdObj.email !== 'undefined')
            topost.emails.push(cmdObj.email);
            client(program).post(`/update-user/${username}`, topost, (err,req,res,obj) => {
                if(err) console.error(err.stack);
                else console.log('Updated' + util.inspect(obj));
            });
        });


    program
        .command('destroy <username>')
        .description('Destroy a user on the user server')
        .action((username, cmdObj) => {
                client(program).del(`/destroy/${username}`,
                (err, req, res, obj) => {
                        if(err) console.error(err.stack);
                        else console.log('Deleted - result = '+ util.inspect(obj));
                });
        });


    program
        .command('password-check <username> <password>')
        .description('Check whether the user password checks out')
        .action((username, password, cmdObj) =>{
            client(program).post('/password-check', { username, password },
            (err, req, res, obj) => {
                if(err) console.error(err.stack);
                else console.log(obj);
            });
        });

        program.parse(process.argv);