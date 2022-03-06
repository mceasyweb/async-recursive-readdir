import { readdir } from 'fs/promises';
import { extname, basename, resolve, dirname } from 'path';
import * as fs from 'fs';

interface Filetype {
  name: string;
  title: string;
  path: string;
  fullname: string;
  extension: string;
  isDirectory: boolean;
  stats: {};
  content?: Filetype[];
}

export enum Mode {
  LIST,
  TREE,
}

export interface OptionsSearch {
  mode?: Mode;
  recursive?: boolean;
  stats?: boolean;
  ignoreFolders?: boolean;
  extensions?: boolean;
}

const defaultOptions: OptionsSearch = {
  mode: Mode.LIST,
  recursive: true,
  stats: false,
  ignoreFolders: true,
  extensions: false,
};

/**
 * Funzione che ritorna i dati Stats del file specificato come parametro
 * @param file Percorso del file
 * @returns i dati del file
 */
async function getStats(file: string) {
  return new Promise<fs.Stats | void>((done) =>
    fs.stat(file, (err, stats) => {
      if (err) {
        return done();
      }
      return done(stats);
    })
  );
}

/**
 * recursive readdir async
 * Funzione ricorsiva asyncrona che analizza tutti i file e cartelle a partire da dir
 * @param dir Nome della directory da analizzare
 * @returns Lista dei dati dei file
 */
export async function list(
  dir: string,
  options: OptionsSearch | null = {}
): Promise<Filetype[] | []> {
  options = { ...defaultOptions, ...options };
  const dirents = await readdir(dir, { withFileTypes: true });
  let results: any = [];
  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name);
    const fileStats = options.stats ? (await getStats(res)) || {} : {};
    const extension = options.extensions ? extname(dirent.name) : '';
    const filetype: Filetype = {
      name: dirent.name,
      title: basename(dirent.name, extension),
      extension,
      fullname: res,
      isDirectory: dirent.isDirectory(),
      path: dirname(res),
      stats: fileStats,
    };
    if (dirent.isDirectory()) {
      if (options.recursive) {
        if (options.mode == Mode.LIST) {
          results = [...results, ...(await list(res, options))];
        } else {
          filetype.content = await list(res, options);
        }
      }
      if (!options.ignoreFolders) {
        results.push(filetype);
      }
    } else {
      results.push(filetype);
    }
  }
  return results;
}
