import { useEffect, useState } from 'react';
import { getQuery } from '../../api/queries/get.query';
import { CharactersType } from '../../types/characters.type';
import { Utils } from '../../utils';
import { AnimatedBackgroundInterface } from './AnimatedBackground.interface';
import './AnimatedBackground.sass';

export function AnimatedBackground({ className }: AnimatedBackgroundInterface) {
  const [imgs, setImgs] = useState<string[]>([]);

  const [characters, setCharacters] = useState<CharactersType[]>([]);

  useEffect(() => {
    getQuery(Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.CHARACTERS).then((response) => {
      setCharacters(response);
    });
  }, []);

  useEffect(() => {
    if (characters) {
      if (characters.length === 0) {
        setImgs([]);
        return;
      }

      let buff: Array<CharactersType> = [];

      if (characters.length > 10) {
        buff = Utils.Array.shuffle(characters).slice(0, 10);
      }

      let _i = 0;

      if (characters.length === 1) {
        buff = new Array(10).fill(characters[0]);
      }

      while (buff.length <= 10) {
        buff.push(characters[_i]);
        _i++;
        if (_i === characters.length) {
          _i = 0;
        }
      }

      setImgs(
        buff.map((ch) => {
          return ch.imageLink;
        }),
      );
    }
  }, [characters]);

  return (
    <div className={`abg ${className ? className : ''}`}>
      <ul className="abg-elems">
        {imgs.length > 0
          ? imgs.map((url) => {
              return (
                <li>
                  <img className="abg-elem-img" alt="img" src={url} />
                </li>
              );
            })
          : new Array(10).fill(<li />)}
      </ul>
    </div>
  );
}
