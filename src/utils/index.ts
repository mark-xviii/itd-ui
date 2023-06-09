import { Constants } from './constants';
import { generateApiSourceUrl } from './string-formatting/generate-api-source.url';
import { shuffle } from './array/shuffle';

export const Utils = {
  Constants,
  StringFormatting: {
    generateApiSourceUrl,
  },
  Array: { shuffle },
};
