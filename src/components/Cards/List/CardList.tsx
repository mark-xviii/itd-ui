import {
  ArrowDownwardRounded,
  ArrowUpwardRounded,
  DeleteRounded,
  EditRounded,
  FilterAltOffRounded,
  FilterAltRounded,
  SortRounded,
} from '@mui/icons-material';
import { useContext, useEffect, useState } from 'react';
import { getQuery } from '../../../api/queries/get.query';
import { CardTypesEnum } from '../../../enums/card-types.enum';
import { CardsType } from '../../../types/cards.type';
import { Utils } from '../../../utils';
import { Card } from '../../CardComponent/Card';
import './CardList.sass';
import Modal from '../../Modal/Modal';
import { deleteQuery } from '../../../api/queries/delete.query';
import { observer } from 'mobx-react';
import { AuthContext } from '../../../stores/auth.store';
import { useNavigate } from 'react-router';
import { SequencesType } from '../../../types/sequences.type';

export function transCardType(cardType: CardTypesEnum) {
  if (cardType === CardTypesEnum.COMMON) {
    return 'Простая';
  }

  if (cardType === CardTypesEnum.SEQUENCED) {
    return 'Задействована в последовательности';
  }

  if (cardType === CardTypesEnum.SEQUENCE_BEGINNING) {
    return 'Начало последовательности';
  }

  if (cardType === CardTypesEnum.SEQUENCE_ENDING) {
    return 'Конец последовательности';
  }
}

export function dateStringToUnix(dataString: any) {
  return new Date(dataString).getTime();
}

export type CardsSortType = {
  param: 'createdAt' | 'updatedAt' | 'character.name';
  direction: 'asc' | 'desc' | null;
};

export type CardsFilterType = {
  sequenceId: string | null;
};

export const CardList = observer(() => {
  const [cards, setCards] = useState<CardsType[]>([]);

  const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);

  const [idToInteract, setIdToIneract] = useState<string | null>(null);

  const [sorting, setSorting] = useState<CardsSortType>({} as CardsSortType);

  const [filtering, setFiltering] = useState<CardsFilterType>({ sequenceId: null } as CardsFilterType);

  const [sequences, setSequences] = useState<SequencesType[]>([]);

  const AuthSingleton = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    getQuery(`${Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.CARDS}`).then((response: CardsType[]) => {
      setCards(response);
    });

    getQuery(Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.SEQUENCES).then((response: SequencesType[]) => {
      setSequences(response);
    });
  }, []);

  function sortAsInUseEffect() {
    console.log(sorting);

    if (cards.length > 1) {
      const _cards = [
        ...cards.sort((card1, card2) => {
          if (sorting.param === 'createdAt' || sorting.param === 'updatedAt') {
            if (dateStringToUnix(card1[`${sorting.param}`]) === dateStringToUnix(card2[`${sorting.param}`])) {
              return 0;
            }

            if (dateStringToUnix(card1[`${sorting.param}`]) > dateStringToUnix(card2[`${sorting.param}`])) {
              return sorting.direction === 'asc' ? 1 : -1;
            }

            if (dateStringToUnix(card1[`${sorting.param}`]) < dateStringToUnix(card2[`${sorting.param}`])) {
              return sorting.direction === 'asc' ? -1 : 1;
            }
          }

          if (sorting.param === 'character.name') {
            if (card1.character.name === card2.character.name) {
              return 0;
            }

            if (card1.character.name > card2.character.name) {
              return sorting.direction === 'asc' ? 1 : -1;
            }

            if (card1.character.name < card2.character.name) {
              return sorting.direction === 'asc' ? -1 : 1;
            }
          }
          return 0;
        }),
      ];
      setCards(_cards);
    }
  }

  useEffect(() => {
    sortAsInUseEffect();
  }, [sorting]);

  function filterAsInUseEffect() {
    console.log(filtering);

    if (filtering.sequenceId) {
      getQuery(`${Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.CARDS}`).then((response: CardsType[]) => {
        const _cards = [
          ...response.filter((card) => {
            return card.sequence && filtering.sequenceId
              ? card.sequence.id.toString() === filtering.sequenceId.toString()
              : false;
          }),
        ];
        console.log(_cards);
        setCards(_cards);
      });
    } else {
      getQuery(`${Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.CARDS}`).then((response: CardsType[]) => {
        const _cards = [...response.filter((card) => card.type === CardTypesEnum.COMMON)];
        setCards(_cards);
      });
    }
  }

  useEffect(() => {
    filterAsInUseEffect();
  }, [filtering]);

  function handleDelete() {
    if (AuthSingleton.accessToken) {
      deleteQuery(
        `${Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.CARDS}/${idToInteract}`,
        AuthSingleton.accessToken,
      ).then(async (response) => {
        if (response.status !== 200) {
          alert(`Ошибка удаления сущности. ${await response.json()}`);
          setIdToIneract(null);
        } else {
          setIsDeleteModal(false);
          setIdToIneract(null);
          getQuery(`${Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.CARDS}`).then((response: CardsType[]) => {
            setCards(response);
            sortAsInUseEffect();
            filterAsInUseEffect();
          });
        }
      });
    }
  }

  return (
    <>
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
        <div className="cc-sorter cc-sorter-select">
          Фильтрация по типу карточек
          <select
            value={filtering.sequenceId ? filtering.sequenceId : ''}
            onChange={(event) => {
              console.log(event.target.value);
              if (event.target.value) {
                setFiltering({ sequenceId: event.target.value } as CardsFilterType);
              } else {
                setFiltering({ sequenceId: null } as CardsFilterType);
              }
            }}
          >
            <option selected value={''}>
              Простые
            </option>
            {sequences.length > 0 ? (
              sequences.map((sq) => {
                return <option value={sq.id}>Задействованные в последовательности "{sq.name}"</option>;
              })
            ) : (
              <option disabled>-- Нет последовательностей! --</option>
            )}
          </select>
          <FilterAltRounded className="cc-icon" />
        </div>
        <div
          className="cc-sorter"
          onClick={() => {
            if (sorting) {
              setSorting({} as CardsSortType);
              setFiltering({} as CardsFilterType);
              getQuery(`${Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.CARDS}/non/sequenced`).then((response) => {
                setCards(response);
              });
            }
          }}
        >
          Сбросить сортировку <FilterAltOffRounded className="cc-icon" />
        </div>
      </div>
      <div className="cards-list-container">
        {cards.length > 0 ? (
          cards.map((card) => (
            <div className="card-intel">
              <div className="card-info">
                <div className="card-card">
                  <Card characterName={card.character.name} imageURL={card.character.imageLink} />{' '}
                </div>
                <hr className="card-hr" />
                <div className="card-actions">
                  <div
                    className="card-action ca-edit"
                    onClick={() => {
                      navigate(`/admin/edit/cards/${card.id}`);
                    }}
                  >
                    <EditRounded className="card-action-icon" />
                    Изменить
                  </div>
                  <div
                    className="card-action ca-delete"
                    onClick={() => {
                      setIdToIneract(card.id);
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
                  {card.id}
                </p>
                <p className="card-p">
                  <span className="card-span">
                    <b>Персонаж:</b>
                  </span>
                  {card.character.name}
                </p>
                <p className="card-p">
                  <span className="card-span">
                    <b>Тип карточки:</b>
                  </span>
                  {transCardType(card.type)}
                </p>
                <p className="card-p">
                  <span className="card-span">
                    <b>Последовательность:</b>
                  </span>
                  {card.sequence ? card.sequence.name : '----'}
                </p>
                <p className="card-p">
                  <span className="card-span">
                    <b>Реплика:</b>
                  </span>
                  {card.text}
                </p>
                <p className="card-p">
                  <span className="card-span">
                    <b>Текст при 'нет':</b>
                  </span>
                  {card.noText}
                </p>
                <p className="card-p">
                  <span className="card-span">
                    <b>Текст при 'да':</b>
                  </span>
                  {card.yesText}
                </p>
                <hr className="card-hr" />
                <label className="card-p">
                  <span className="card-span">
                    <b>Исход при 'нет':</b>
                  </span>
                </label>
                <p className="card-p">
                  <span className="card-span">
                    <b>Кофе:</b>
                  </span>
                  {card.noOutcome.coffee}
                </p>
                <p className="card-p">
                  <span className="card-span">
                    <b>Деньги:</b>
                  </span>
                  {card.noOutcome.money}
                </p>
                <p className="card-p">
                  <span className="card-span">
                    <b>Персонал:</b>
                  </span>
                  {card.noOutcome.personnel}
                </p>
                <p className="card-p">
                  <span className="card-span">
                    <b>Заказчики:</b>
                  </span>
                  {card.noOutcome.customers}
                </p>
                <hr className="card-hr" />
                <label className="card-p">
                  <span className="card-span">
                    <b>Исход при 'да':</b>
                  </span>
                </label>
                <p className="card-p">
                  <span className="card-span">
                    <b>Кофе:</b>
                  </span>
                  {card.yesOutcome.coffee}
                </p>
                <p className="card-p">
                  <span className="card-span">
                    <b>Деньги:</b>
                  </span>
                  {card.yesOutcome.money}
                </p>
                <p className="card-p">
                  <span className="card-span">
                    <b>Персонал:</b>
                  </span>
                  {card.yesOutcome.personnel}
                </p>
                <p className="card-p">
                  <span className="card-span">
                    <b>Заказчики:</b>
                  </span>
                  {card.yesOutcome.customers}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="cc-sorters">Нет активных игровых карточек. Создайте хотя бы одну!</p>
        )}
      </div>
      <Modal
        isShown={isDeleteModal}
        setIsShown={setIsDeleteModal}
        altButtonText="Удалить"
        altAction={() => {
          handleDelete();
        }}
      >
        Вы действительно хотите удалить эту карточку (ID: {idToInteract})?
      </Modal>
    </>
  );
});
