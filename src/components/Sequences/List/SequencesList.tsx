import { useContext, useEffect, useState } from 'react';
import { getQuery } from '../../../api/queries/get.query';
import { SequencesType } from '../../../types/sequences.type';
import { Utils } from '../../../utils';
import './SequencesList.sass';
import {
  ArrowDownwardRounded,
  ArrowUpwardRounded,
  DeleteRounded,
  EditRounded,
  FilterAltOffRounded,
  SortRounded,
} from '@mui/icons-material';
import { useNavigate } from 'react-router';
import Modal from '../../Modal/Modal';
import { deleteQuery } from '../../../api/queries/delete.query';
import { AuthContext } from '../../../stores/auth.store';
import { dateStringToUnix } from '../../Cards/List/CardList';

export type SequencesSortType = {
  param: 'createdAt' | 'updatedAt' | 'name' | 'length';
  direction: 'asc' | 'desc' | null;
};

export function SequencesList() {
  const [sorting, setSorting] = useState<SequencesSortType>({} as SequencesSortType);
  const [seqs, setSeqs] = useState<SequencesType[]>([]);
  const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);
  const [idToInteract, setIdToInteract] = useState<string | null>(null);

  const navigate = useNavigate();

  const AuthSingleton = useContext(AuthContext);

  function sortAsInUseEffect() {
    console.log(sorting);

    if (seqs.length > 1) {
      const _seqs = [
        ...seqs.sort((c1, c2) => {
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

          if (sorting.param === 'name') {
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

          if (sorting.param === 'length') {
            if (c1.length === c2.length) {
              return 0;
            }

            if (c1.length > c2.length) {
              return sorting.direction === 'asc' ? 1 : -1;
            }

            if (c1.length < c2.length) {
              return sorting.direction === 'asc' ? -1 : 1;
            }
          }

          return 0;
        }),
      ];
      setSeqs(_seqs);
    }
  }

  function handleDelete() {
    if (AuthSingleton.accessToken) {
      deleteQuery(
        `${Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.SEQUENCES}/${idToInteract}`,
        AuthSingleton.accessToken,
      ).then(async (response) => {
        if (response.status !== 200) {
          alert(`Ошибка удаления сущности. ${await response.json()}`);
          setIdToInteract(null);
        } else {
          setIsDeleteModal(false);
          setIdToInteract(null);
          getQuery(`${Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.SEQUENCES}`).then((response) => {
            setSeqs(response);
          });
        }
      });
    }
  }

  useEffect(() => {
    sortAsInUseEffect();
  }, [sorting]);

  useEffect(() => {
    getQuery(Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.SEQUENCES).then((response) => {
      setSeqs(response);
    });
  }, []);

  return (
    <div className="seq-list">
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
              direction: sorting.param !== 'name' ? 'asc' : sorting.direction === 'asc' ? 'desc' : 'asc',
              param: 'name',
            });
          }}
        >
          Отсортировать по имени последовательности
          <SortRounded className="cc-icon" />
          {sorting.param === 'name' &&
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
              direction: sorting.param !== 'length' ? 'asc' : sorting.direction === 'asc' ? 'desc' : 'asc',
              param: 'length',
            });
          }}
        >
          Отсортировать по длине последовательности
          <SortRounded className="cc-icon" />
          {sorting.param === 'length' &&
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
              setSorting({} as SequencesSortType);
              getQuery(`${Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.SEQUENCES}`).then((response) => {
                setSeqs(response);
              });
            }
          }}
        >
          Сбросить сортировку
          <FilterAltOffRounded className="cc-icon" />
        </div>
      </div>
      {seqs.map((seq) => (
        <div className="seq-block">
          <h1 className="seq-name">{seq.name}</h1>
          <hr className="card-hr" />
          <div className="card-actions">
            <div
              className="card-action ca-edit"
              onClick={() => {
                navigate(`/admin/edit/sequences/${seq.id}`);
              }}
            >
              <EditRounded className="card-action-icon" />
              Изменить
            </div>
            <div
              className="card-action ca-delete"
              onClick={() => {
                setIdToInteract(seq.id);
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
              <b>Id:</b>
            </span>
            {seq.id}
          </p>
          <p className="card-p">
            <span className="card-span">
              <b>Количество карточек:</b>
            </span>
            {seq.length}
          </p>
          <p className="seq-desc">{seq.description}</p>
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
        Вы действительно хотите удалить эту последовательность (ID: {idToInteract})?
      </Modal>
    </div>
  );
}
