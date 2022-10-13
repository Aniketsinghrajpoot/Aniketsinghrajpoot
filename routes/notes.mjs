import { default as express, response} from 'express';
import { NotesStore as notes } from '../app.mjs';
import { emitNoteTitles } from './index.mjs';
import { io } from '../app.mjs';

import { postMessage, destroyMessage, recentMessages, emitter as msgEvents } from '../models/message-seqlize.mjs';
import DBG from 'debug';
const debug = DBG('notes:home');
const error = DBG('notes:error-home');

import { ensureAuthenticated } from './users.mjs';
import { twitterLogin } from './users.mjs';
import { fn } from 'sequelize';
export const router = express.Router();

/* GET home page*/
router.get('/add', ensureAuthenticated, async (req, res, next) =>{
    try{
        res.render('noteedit', {
         title: "Add a Note",
         docreate: true,
         notekey: ' ',
         user: req.user,
         note: undefined,
         twitterLogin: twitterLogin
        });
      } catch(err) { next(err); }
});

//Save Note(update)

router.post('/save', ensureAuthenticated, async(req, res, next) =>{
    try{
        let note;
        if(req.body.docreate === "create"){
            note = await notes.create(req.body.notekey, 
                req.body.title, req.body.body);
        }else{
            note = await notes.update(req.body.notekey,
                req.body.title, req.body.body);
        }
        res.redirect('/notes/view?key='+ req.body.notekey);
    }catch(err){ next(err);}
});

//Read notes (read)

router.get('/view', async(req, res, next) =>{
    try{
       const note = await notes.read(req.query.key);
       const messages = await recentMessages('/notes', req.query.key);
       res.render('noteview',{
        title: note ? note.title: "",
        notekey: req.query.key, 
        user: req.user ? req.user : undefined,
        note: note,messages
       });
    }catch(err){ next(err);}
});

//Edit notes(update)

router.get('/edit', ensureAuthenticated, async(req, res, next) =>{
    try{
       const note = await notes.read(req.query.key);
       res.render('noteedit',{
        title: note ? ("edit" + note.title): "Add a Note",
        notekey: req.query.key, 
        user: req.user,
        note: note,
        twitterLogin: twitterLogin
       });
    }catch(err){ next(err);}
});

//Ask to delete note (destroy)

router.get('/destroy', ensureAuthenticated, async(req, res, next) =>{
    try{
       const note = await notes.read(req.query.key);
       res.render('notedistroy',{
        title: note ? `Delete ${note.title}` : "",
        notekey: req.query.key, 
        user: req.user,
        note: note,
        twitterLogin: twitterLogin
       });
    }catch(err) { next(err);}
});
//realy destroy note(destroy)
router.post('/destroy/confirm', ensureAuthenticated, async(req, res, next) =>{
    try{
        await notes.destroy(req.body.notekey);
        res.redirect('/');
    }catch(err) {
        next(err);
    }
});


msgEvents.on('newmessage', newmsg => {
    io.of(newmsg.namespace).to(newmsg.room).emit('newmessage', newmsg);
});
msgEvents.on('destroymessage', data =>{
    io.of(data.namespace).to(data.room).emit('destroymessage', data);
});

export function init() {

    io.of('/notes').on('connect', socket => {
            if(socket.handshake.query.key){
                socket.join(socket.handshake.query.key);
            }
    });

    notes.on('noteupdated', note =>{
        const toemit = {
            key:note.key, title:note.title, body:note.body
        };
        io.of('/notes').to(note.key).emit('noteupdated', toemit);
        emitNoteTitles();
    });

    notes.on('notedestroyed', key => {
        io.of('/notes').to(key).emit('notedestroyed', key);
        emitNoteTitles();
    })
  
    io.of('/notes').on('connect', async(socket) => {
        let notekey = socket.handshake.query.key;
        if(notekey) {
            socket.join(notekey);
    
            socket.on('create-message', async(newmsg, fn) => {
                try{
                    await postMessage( newmsg.from, newmsg.namespace, newmsg.room, newmsg.message);
                    fn('ok');
                }catch(err){
                    error(`FAIL to create message ${err.stack}`);
                }
            });
            socket.on('delete-message', async(data) => {
                try{
                    await destroyMessage(data.id);
                }catch(err){
                    error( `FAIL to delete message${err.stack}`);
                }
            });
        }
    });
}    
