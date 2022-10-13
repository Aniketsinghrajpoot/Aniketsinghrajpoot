import { io } from '../app.mjs';
import * as express from 'express';
import { NotesStore as notes } from '../app.mjs';
import { twitterLogin } from './users.mjs';
import pkg from 'dotenv/lib/env-options.js';
const { debug } = pkg;
export const router = express.Router();

export function init() {

}

/* GET home page*/
router.get('/', async(req, res, next) =>{
    try{
      const keylist = await notes.keylist();
      const keyPromises = keylist.map(key =>{
        return notes.read(key);
      });
      const notelist = await getKeyTitleList();
      res.render('index', {
       title: 'Notes', notelist: notelist,
       user: req.user ? req.user: undefined,
      });
    } catch(e){
      next(e);
    }
});

async function getKeyTitleList() {
  const keylist = await notes.keylist();
  const keyPromises = keylist.map(key => notes.read(key));
  const notelist = await Promise.all(keyPromises);
  return notelist.map(note => {
    return { key: note.key, title: note.title };
  });
};

export const emitNoteTitles = async() => {
  const notelist = await getKeyTitleList();
  io.of('/home').emit('notetitles', { notelist });
};
