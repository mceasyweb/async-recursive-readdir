# async-recursive-readdir

Module to recursive read directory async (non blocking). NO dependencies.

## Installation

```
npm i https://github.com/mceasyweb/async-recursive-readdir.git
build package
```

After install, you can use the module using _import_ key (ES6):

```typescript
// Import ES6 module
import { list, Mode, OptionsSearch } from './recursive-readdir-async';
```

## Usage

Example of basic usage:

```typescript
const result = await list('.');
console.log(result);
```

```typescript
list('.').then((res) => console.log(res));
```

Example with full features:

```typescript
const options: OptionsSearch = {
  mode: Mode.LIST,
  recursive: true,
  stats: false,
  ignoreFolders: true,
  extensions: true,
};
const result = await list('.', options);
console.log(result);
```

## Options

An options object can be passed to configure the module.

- **mode (LIST | TREE)** : The LIST option will return an array containing the items. The TREE option will return items structured as in the file system. _Default: list_
- **recursive (true | false)** : If true, the files and folders and sub folders will be listed. If it is false, only files and folders will be listed. _Default: true_
- **stats (true | false)** : If it is true, an object of type 'Stats' will be returned, obtained through the 'fs.stat' function. _Default: false_
- **ignoreFolders (true | false)** : If it is true and the Mode is LIST it returns a list of files only.
  If it is true and the Mode is TREE and recursive is true, empty folders are not listed. If it is false all empty or non-empty folders are displayed. _Default: true_
- **extension (true | false)** : If true it will be added to the object's `extension` property. _Default: false_
- **exclude (Array of String)** : A list of names that are not returned if they find a partial match. _Default: []_

## Object structure

The function will return an object.
List type:

```json
[
  {
    "name": "dir1-file1.txt",
    "title": "dir1-file1",
    "extension": ".txt",
    "fullname": "/absolute/path/to/dir/dir1/dir1-file1.txt",
    "isDirectory": false,
    "path": "/absolute/path/to/dir/dir1",
    "stats": {}
  },
  {
    "name": "dir1-file2.txt",
    "title": "dir1-file2",
    "extension": ".txt",
    "fullname": "/absolute/path/to/dir/dir1/dir1-file2.txt",
    "isDirectory": false,
    "path": "/absolute/path/to/dir/dir1",
    "stats": {}
  },
  {
    "name": "dir1",
    "title": "dir1",
    "extension": "",
    "fullname": "/absolute/path/to/dir/dir1",
    "isDirectory": true,
    "path": "/absolute/path/to/dir",
    "stats": {}
  },
  {
    "name": "dir2-file1.txt",
    "title": "dir2-file1",
    "extension": ".txt",
    "fullname": "/absolute/path/to/dir/dir2/dir2-file1.txt",
    "isDirectory": false,
    "path": "/absolute/path/to/dir/dir2",
    "stats": {}
  },
  {
    "name": "dir2",
    "title": "dir2",
    "extension": "",
    "fullname": "/absolute/path/to/dir/dir2",
    "isDirectory": true,
    "path": "/absolute/path/to/dir",
    "stats": {}
  },
  {
    "name": "file1.txt",
    "title": "file1",
    "extension": ".txt",
    "fullname": "/absolute/path/to/dir/file1.txt",
    "isDirectory": false,
    "path": "/absolute/path/to/dir",
    "stats": {}
  }
]
```

Tree type:

```json
[
  {
    "name": "dir1",
    "title": "dir1",
    "extension": "",
    "fullname": "/absolute/path/to/dir/dir1",
    "isDirectory": true,
    "path": "/absolute/path/to/dir",
    "stats": {},
    "content": [
      {
        "name": "dir1-file1.txt",
        "title": "dir1-file1",
        "extension": ".txt",
        "fullname": "/absolute/path/to/dir/dir1/dir1-file1.txt",
        "isDirectory": false,
        "path": "/absolute/path/to/dir/dir1",
        "stats": {}
      },
      {
        "name": "dir1-file2.txt",
        "title": "dir1-file2",
        "extension": ".txt",
        "fullname": "/absolute/path/to/dir/dir1/dir1-file2.txt",
        "isDirectory": false,
        "path": "/absolute/path/to/dir/dir1",
        "stats": {}
      }
    ]
  },
  {
    "name": "dir2",
    "title": "dir2",
    "extension": "",
    "fullname": "/absolute/path/to/dir/dir2",
    "isDirectory": true,
    "path": "/absolute/path/to/dir",
    "stats": {},
    "content": [
      {
        "name": "dir2-file1.txt",
        "title": "dir2-file1",
        "extension": ".txt",
        "fullname": "/absolute/path/to/dir/dir2/dir2-file1.txt",
        "isDirectory": false,
        "path": "/absolute/path/to/dir/dir2",
        "stats": {}
      }
    ]
  },
  {
    "name": "file1.txt",
    "title": "file1",
    "extension": ".txt",
    "fullname": "/absolute/path/to/dir/file1.txt",
    "isDirectory": false,
    "path": "/absolute/path/to/dir",
    "stats": {}
  }
]
```
