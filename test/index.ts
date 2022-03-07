import { list, Mode, OptionsSearch } from '../src/index';

(async () => {
  const options = {
    mode: Mode.LIST,
    recursive: true,
    stats: false,
    ignoreFolders: false,
    extensions: true,
    exclude: ['dir2', 'dir1'],
  };
  const result = await list('dir', options);
  console.log(result);
})();
