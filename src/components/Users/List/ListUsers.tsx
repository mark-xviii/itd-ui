import {
  SortRounded,
  ArrowUpwardRounded,
  ArrowDownwardRounded,
  FilterAltOffRounded,
  EditRounded,
  DeleteRounded,
} from '@mui/icons-material';
import Modal from '../../Modal/Modal';
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getQuery } from '../../../api/queries/get.query';
import { AuthContext } from '../../../stores/auth.store';
import { Utils } from '../../../utils';
import './ListUsers.sass';
import { UsersType } from '../../../types/user.type';
import { deleteQuery } from '../../../api/queries/delete.query';
import { dateStringToUnix } from '../../Cards/List/CardList';

export type UsersSortType = {
  param: 'createdAt' | 'updatedAt' | 'login' | 'organizationTitle';
  direction: 'asc' | 'desc' | null;
};

export function ListUsers() {
  const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);
  const [idToInteract, setIdToIneract] = useState<string | null>(null);
  const navigate = useNavigate();
  const [users, setUsers] = useState<UsersType[]>([]);

  const AuthSingleton = useContext(AuthContext);

  const [sorting, setSorting] = useState<UsersSortType>({} as UsersSortType);

  useEffect(() => {
    if (AuthSingleton.accessToken) {
      getQuery(`${Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.USERS}`, AuthSingleton.accessToken).then((result) => {
        setUsers(result);
      });
    }
  }, [AuthSingleton.accessToken]);

  function handleDelete() {
    if (AuthSingleton.accessToken) {
      deleteQuery(
        `${Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.USERS}/${idToInteract}`,
        AuthSingleton.accessToken,
      ).then(async (response) => {
        if (response.status !== 200) {
          alert(`Ошибка удаления сущности. ${await response.json()}`);
          setIdToIneract(null);
        } else {
          setIsDeleteModal(false);
          setIdToIneract(null);
          if (AuthSingleton.accessToken) {
            console.log(AuthSingleton.accessToken);
            getQuery(`${Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.USERS}`, AuthSingleton.accessToken).then(
              (response) => {
                setUsers(response);
              },
            );
          }
        }
      });
    }
  }

  function sortAsInUseEffect() {
    console.log(sorting);

    if (users.length > 1) {
      const _users = [
        ...users.sort((c1, c2) => {
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

          if (sorting.param === 'organizationTitle') {
            if (c1.organizationTitle === c2.organizationTitle) {
              return 0;
            }

            if (c1.organizationTitle > c2.organizationTitle) {
              return sorting.direction === 'asc' ? 1 : -1;
            }

            if (c1.organizationTitle < c2.organizationTitle) {
              return sorting.direction === 'asc' ? -1 : 1;
            }
          }

          if (sorting.param === 'login') {
            if (c1.login === c2.login) {
              return 0;
            }

            if (c1.login > c2.login) {
              return sorting.direction === 'asc' ? 1 : -1;
            }

            if (c1.login < c2.login) {
              return sorting.direction === 'asc' ? -1 : 1;
            }
          }

          return 0;
        }),
      ];
      setUsers(_users);
    }
  }

  useEffect(() => {
    sortAsInUseEffect();
  }, [sorting]);

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
              direction: sorting.param !== 'login' ? 'asc' : sorting.direction === 'asc' ? 'desc' : 'asc',
              param: 'login',
            });
          }}
        >
          Отсортировать по логину пользователя
          <SortRounded className="cc-icon" />
          {sorting.param === 'login' &&
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
              direction: sorting.param !== 'organizationTitle' ? 'asc' : sorting.direction === 'asc' ? 'desc' : 'asc',
              param: 'organizationTitle',
            });
          }}
        >
          Отсортировать по названию организации
          <SortRounded className="cc-icon" />
          {sorting.param === 'organizationTitle' &&
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
              setSorting({} as UsersSortType);
              if (AuthSingleton.accessToken) {
                getQuery(`${Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.USERS}`, AuthSingleton.accessToken).then(
                  (response) => {
                    setUsers(response);
                  },
                );
              }
            }
          }}
        >
          Сбросить сортировку
          <FilterAltOffRounded className="cc-icon" />
        </div>
      </div>
      {users.map((user) => (
        <div className="ap-char">
          <div className="ap-char-info">
            <h1>{user.login}</h1>
            <hr className="card-hr" />
            <div className="card-actions">
              <div
                className="card-action ca-edit"
                onClick={() => {
                  navigate(`/admin/edit/users/${user.id}`);
                }}
              >
                <EditRounded className="card-action-icon" />
                Изменить
              </div>
              <div
                className="card-action ca-delete"
                onClick={() => {
                  setIdToIneract(user.id);
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
              </span>
              {user.id}
            </p>
            <p className="card-p">
              <span className="card-span">
                <b>Логин:</b>
              </span>
              {user.login}
            </p>
            <p className="card-p">
              <span className="card-span">
                <b>Название организации:</b>
              </span>
              {user.organizationTitle}
            </p>
            <p className="card-p">
              <span className="card-span">
                <b>Рекорд:</b>
              </span>
              {user.maxScoreRecord}
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
        Вы действительно хотите удалить этого пользователя (ID: {idToInteract})?
      </Modal>
    </div>
  );
}
