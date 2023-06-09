import { useContext, useEffect, useState } from 'react';
import { getQuery } from '../../../api/queries/get.query';
import { CharactersType } from '../../../types/characters.type';
import { Utils } from '../../../utils';
import './CharacterList.sass';
import {
  ArrowDownwardRounded,
  ArrowUpwardRounded,
  DeleteRounded,
  EditRounded,
  FilterAltOffRounded,
  SortRounded,
} from '@mui/icons-material';
import Modal from '../../Modal/Modal';
import { deleteQuery } from '../../../api/queries/delete.query';
import { AuthContext } from '../../../stores/auth.store';
import { useNavigate } from 'react-router';
import { dateStringToUnix } from '../../Cards/List/CardList';

export type CharactersSortType = {
  param: 'createdAt' | 'updatedAt' | 'character.name';
  direction: 'asc' | 'desc' | null;
};

export function CharacterList() {
  const [sorting, setSorting] = useState<CharactersSortType>({} as CharactersSortType);
  const [characters, setCharacters] = useState<CharactersType[]>([]);
  const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);
  const [idToInteract, setIdToIneract] = useState<string | null>(null);
  const navigate = useNavigate();

  const AuthSingleton = useContext(AuthContext);

  function handleDelete() {
    if (AuthSingleton.accessToken) {
      deleteQuery(
        `${Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.CHARACTERS}/${idToInteract}`,
        AuthSingleton.accessToken,
      ).then(async (response) => {
        if (response.status !== 200) {
          alert(`Ошибка удаления сущности. ${await response.json()}`);
          setIdToIneract(null);
        } else {
          setIsDeleteModal(false);
          setIdToIneract(null);
          getQuery(`${Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.CHARACTERS}`).then((response) => {
            setCharacters(response);
          });
        }
      });
    }
  }

  function sortAsInUseEffect() {
    console.log(sorting);

    if (characters.length > 1) {
      const _chars = [
        ...characters.sort((c1, c2) => {
          if (sorting.param === 'createdAt' || sorting.param === 'updatedAt') {
            if (dateStringToUnix(c1[`${sorting.param}`]) === dateStringToUnix(c2[`${sorting.param}`])) {
              return 0;
            }

            if (dateStringToUnix(c1[`${sorting.param}`]) > dateStringToUnix(c2[`${sorting.param}`])) {
              return sorting.direction === 'asc' ? 1 : -1;
            }

            if (dateStringToUnix(c1[`${sorting.param}`]) < dateStringToUnix(c2[`${sorting.param}`])) {
              return sorting.direction === 'asc' ? -1 : 1;
            }
          }

          if (sorting.param === 'character.name') {
            if (c1.name === c2.name) {
              return 0;
            }

            if (c1.name > c2.name) {
              return sorting.direction === 'asc' ? 1 : -1;
            }

            if (c1.name < c2.name) {
              return sorting.direction === 'asc' ? -1 : 1;
            }
          }
          return 0;
        }),
      ];
      setCharacters(_chars);
    }
  }

  useEffect(() => {
    sortAsInUseEffect();
  }, [sorting]);

  useEffect(() => {
    getQuery(Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.CHARACTERS).then((response) => {
      setCharacters(response);
    });
  }, []);

  return (
    <div className="ap-char-container">
      <div className="cc-sorters">
        <div
          className="cc-sorter"
          onClick={() => {
            setSorting({
              direction: sorting.param !== 'createdAt' ? 'asc' : sorting.direction === 'asc' ? 'desc' : 'asc',
              param: 'createdAt',
            });
          }}
        >
          Отсортировать по дате создания
          <SortRounded className="cc-icon" />
          {sorting.param === 'createdAt' &&
            (sorting.direction === 'asc' ? (
              <ArrowUpwardRounded className="cc-icon" />
            ) : (
              <ArrowDownwardRounded className="cc-icon" />
            ))}
        </div>
        <div
          className="cc-sorter"
          onClick={() => {
            setSorting({
              direction: sorting.param !== 'updatedAt' ? 'asc' : sorting.direction === 'asc' ? 'desc' : 'asc',
              param: 'updatedAt',
            });
          }}
        >
          Отсортировать по дате изменения
          <SortRounded className="cc-icon" />
          {sorting.param === 'updatedAt' &&
            (sorting.direction === 'asc' ? (
              <ArrowUpwardRounded className="cc-icon" />
            ) : (
              <ArrowDownwardRounded className="cc-icon" />
            ))}
        </div>
        <div
          className="cc-sorter"
          onClick={() => {
            setSorting({
              direction: sorting.param !== 'character.name' ? 'asc' : sorting.direction === 'asc' ? 'desc' : 'asc',
              param: 'character.name',
            });
          }}
        >
          Отсортировать по имени персонажа
          <SortRounded className="cc-icon" />
          {sorting.param === 'character.name' &&
            (sorting.direction === 'asc' ? (
              <ArrowUpwardRounded className="cc-icon" />
            ) : (
              <ArrowDownwardRounded className="cc-icon" />
            ))}
        </div>
        <div
          className="cc-sorter"
          onClick={() => {
            if (sorting) {
              setSorting({} as CharactersSortType);
              getQuery(`${Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.CHARACTERS}`).then((response) => {
                setCharacters(response);
              });
            }
          }}
        >
          Сбросить сортировку
          <FilterAltOffRounded className="cc-icon" />
        </div>
      </div>
      {characters.map((character) => (
        <div className="ap-char">
          <div className="ap-char-img-cover">
            <img className="ap-char-img" src={character.imageLink} alt="char-img" />
          </div>
          <div className="ap-char-info">
            <hr className="card-hr" />
            <div className="card-actions">
              <div
                className="card-action ca-edit"
                onClick={() => {
                  navigate(`/admin/edit/characters/${character.id}`);
                }}
              >
                <EditRounded className="card-action-icon" />
                Изменить
              </div>
              <div
                className="card-action ca-delete"
                onClick={() => {
                  setIdToIneract(character.id);
                  setIsDeleteModal(true);
                }}
              >
                <DeleteRounded className="card-action-icon" />
                Удалить
              </div>
            </div>
            <hr className="card-hr" />
            <p className="card-p">
              <span className="card-span">
                <b>ID:</b>
              </span>{' '}
              {character.id}
            </p>
            <p className="card-p">
              <span className="card-span">
                <b>Имя:</b>
              </span>{' '}
              {character.name}
            </p>
            <p className="card-p">
              <span className="card-span">
                <b>Должность:</b>
              </span>{' '}
              {character.position}
            </p>
          </div>
        </div>
      ))}
      <Modal
        isShown={isDeleteModal}
        setIsShown={setIsDeleteModal}
        altButtonText="Удалить"
        altAction={() => {
          handleDelete();
        }}
      >
        Вы действительно хотите удалить этого персонажа (ID: {idToInteract})?
      </Modal>
    </div>
  );
}
