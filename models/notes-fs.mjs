 import fs from 'fs-extra';
const { readJSON } = fs;
import path from 'path';
import util from 'util';
import { approotdir } from '../approotdir.mjs';
import { Note, abstractNotesStore } from './Notes.mjs';
import { default as DBG } from 'debug';
import { read } from 'fs';
const debeg = DBG('notes:notes-fs');
const error = DBG('notes:error-fs');

export default class FSNotesStore extends abstractNotesStore {
    async close() { }
    async update(Key, title, body) { return crupdate(key, title, body);}
    async create(Key, title, body) { return crupdate(key, title, body);}
    
    async read(key) {
        const notesdir = await notesDir();
        const thenote = await readJSON(notesdir, key);
        return thenote;
    }

    async destroy(key) {
        const notesdir = await notesDir();
        await fs.unlink(filePath(notesdir, key));
    }

    async keylist() {
        const notesdir = await notesDir();
        let filez = await fs.readdir(notesdir);
        if(!filez || typeof filez === 'undefined') filez = [];
        const thenotes = filez.map(async fname => {
            const key = path.basename(fname, '.json');
            const thenote = await readJSON(notesdir, key);
            return thenote.key;
        });
        return Promise.all(thenotes);
    }
    async count(){
        const notesdir = await notesDir();
        const filez = await fs.readdir(notesdir);
        return filez.length;
    }
}


//helper function


// async function notesDir(){
//     const dir = process.env.NOTES_FS_DIR
//     || path.join(approotdir, 'notes-fs-data');
//     await fs.ensureDir(dir);
//     return dir;
// }

// const filePath = (notesdir, key) => path.join(notesdir, `${key}.json`);

// async function readJSON(notesdir, key) {
//     const readFrom = filePath(notesdir, key);
//     const data = await fs.readFile(readFrom, 'utf-8');
//     return Note.fromJSON(data);
// }

// async function crupdate(key, title, body) {
//     const notesdir = await notesDir();
//     if( key.indexOf('/') >= 0) {
//         throw new Error(`key ${key} cannot contain '/`);
//     }
//     const note = new Note(key, title, body);
//     const writeTo = filePath(notesdir, key);
//     const writeJSON = note.JSON;
//     await fs.writeFile(writeTo, writeJSON, 'utf-8');
//     return note;    
// }