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
  exclude?: string[];
}

const defaultOptions: OptionsSearch = {
  mode: Mode.LIST,
  recursive: true,
  stats: false,
  ignoreFolders: true,
  extensions: false,
  exclude: [],
};

/**
 * Function that returns the Stats data of the file specified as a parameter
 * @param file File path
 * @returns The file data
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
 * Function that excludes a file if the name partially matches the strings passed in listReg
 * @param name File name
 * @param listReg List containing the exclusion strings
 * @returns Trure or False
 */
async function exclude(name: string, listReg: string[] = []): Promise<boolean> {
  return new Promise<boolean>((done) => {
    for (const exp of listReg) {
      let regex = new RegExp(exp, 'i');
      if (name.match(regex)) {
        return done(true);
      }
    }
    return done(false);
  });
}

/**
 * async recursive readdir
 * Asynchronous recursive function that parses all files and folders starting from dir
 * @param dir Name of the path to be scanned
 * @returns File data list
 */
export async function list(
  dir: string,
  options: OptionsSearch | null = {}
): Promise<Filetype[] | []> {
  options = { ...defaultOptions, ...options };
  try {
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
      if (!(await exclude(filetype.fullname, options.exclude))) {
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
    }
    return results;
  } catch (error) {
    throw error;
  }
}
