import { useState, useEffect, ChangeEvent, useContext } from 'react';
import { useNavigate } from 'react-router';
import { getQuery } from '../../../api/queries/get.query';
import { CardTypesEnum } from '../../../enums/card-types.enum';
import { CharactersType } from '../../../types/characters.type';
import { SequencesType } from '../../../types/sequences.type';
import { Utils } from '../../../utils';
import { CardsPostQueryType } from '../Creation/cards-post-query.type';
import Modal from '../../Modal/Modal';
import { observer } from 'mobx-react';
import { CardsType } from '../../../types/cards.type';
import { AuthContext } from '../../../stores/auth.store';
import { updateQuery } from '../../../api/queries/update.query';
import { ArrowBackRounded } from '@mui/icons-material';

export interface CardEditInterface {
  cardToEditId: string;
}

export const CardEdit = observer(({ cardToEditId }: CardEditInterface) => {
  const [characters, setCharacters] = useState<CharactersType[]>([]);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalText, setModalText] = useState<string>('');
  const [currentCard, setCurrentCard] = useState<CardsType>({} as CardsType);
  const [sequences, setSequences] = useState<SequencesType[]>([]);

  const navigate = useNavigate();

  const AuthSingleton = useContext(AuthContext);

  useEffect(() => {
    getQuery(Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.CHARACTERS).then((response: CharactersType[]) => {
      setCharacters(response);
    });

    getQuery(`${Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.CARDS}/${cardToEditId}`).then((response: CardsType) => {
      setCurrentCard(response);
    });

    setForm({ ...form, type: currentCard.type });

    getQuery(Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.SEQUENCES).then((response: SequencesType[]) => {
      setSequences(response);
    });
  }, []);

  const [form, setForm] = useState<CardsPostQueryType>({} as CardsPostQueryType);

  useEffect(() => {
    console.log(form);
  }, [form, setForm]);

  function handleChange(
    event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>,
    yn?: 'yes' | 'no' | undefined,
  ) {
    if (event.target.name === 'type' && event.target.value === CardTypesEnum.COMMON) {
      const temp = form;
      temp.type = CardTypesEnum.COMMON;
      delete temp.sequenceId;
      setForm(temp);
    }

    if (!yn) {
      setForm({ ...form, [`${event.target.name}`]: event.target.value });
    }
    if (yn === 'no') {
      setForm({ ...form, noOutcome: { ...form.noOutcome, [`${event.target.name}`]: event.target.value } });
    }
    if (yn === 'yes') {
      setForm({ ...form, yesOutcome: { ...form.yesOutcome, [`${event.target.name}`]: event.target.value } });
    }
    if (event.target.name === 'type' && event.target.value === CardTypesEnum.COMMON) {
      setForm({ ...form, sequenceId: null, noOutcome: { nextCardId: null }, yesOutcome: { nextCardId: null } });
    }
  }

  const [min, max] = [-100, 100];

  function limitResourceValue(event: ChangeEvent<HTMLInputElement>) {
    if (!/^-?\d+\.?\d*$/.test(event.target.value)) {
      event.target.value = '';
    }

    const value = Number(event.target.value);

    if (value > max) {
      event.target.value = min.toString();
    }

    if (value < min) {
      event.target.value = max.toString();
    }
  }

  const maxLength = 256;

  function limitLength(event: ChangeEvent<HTMLTextAreaElement>) {
    if (event.target.value.length >= maxLength) {
      event.target.value = event.target.value.slice(0, maxLength - 1);
    }
  }

  function validateForm() {
    if (
      (form.type === CardTypesEnum.SEQUENCED ||
        form.type === CardTypesEnum.SEQUENCE_BEGINNING ||
        form.type === CardTypesEnum.SEQUENCE_ENDING) &&
      !form.sequenceId
    ) {
      setModalText('Выберите последовательность!');
      return false;
    }

    return true;
  }

  function handleUpdate() {
    if (AuthSingleton.accessToken) {
      setShowModal(true);

      if (!validateForm()) {
        return false;
      }

      setModalText('Создание карточки...');

      let pre = { ...form };
      if (pre.noOutcome) {
        pre.noOutcome.coffee = Number(pre.noOutcome.coffee);
        pre.noOutcome.personnel = Number(pre.noOutcome.personnel);
        pre.noOutcome.customers = Number(pre.noOutcome.customers);
        pre.noOutcome.money = Number(pre.noOutcome.money);
      }

      if (pre.yesOutcome) {
        pre.yesOutcome.coffee = Number(pre.yesOutcome.coffee);
        pre.yesOutcome.personnel = Number(pre.yesOutcome.personnel);
        pre.yesOutcome.customers = Number(pre.yesOutcome.customers);
        pre.yesOutcome.money = Number(pre.yesOutcome.money);
      }

      updateQuery(
        `${Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.CARDS}/${currentCard.id}`,
        pre,
        AuthSingleton.accessToken,
      ).then(async (response) => {
        console.log(response);
        if (response.status !== 200) {
          setModalText(`Что-то пошло не так :( ${(await response.json()).message}`);
        }
        if (response.status === 200) {
          setModalText('Карточка успешно изменена!');
          setForm({
            noOutcome: { coffee: 0, personnel: 0, money: 0, customers: 0 },
            yesOutcome: { coffee: 0, personnel: 0, money: 0, customers: 0 },
          } as CardsPostQueryType);
          setTimeout(() => {
            navigate(
              `/admin/${Utils.Constants.AVAILABLE_AP_ACTIONS_ENUM.LIST}/${Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.CARDS}`,
            );
          }, 1000);
        }
      });
    }
  }

  return (
    <div className="card-creation-container">
      {currentCard.id && currentCard.noOutcome && currentCard.yesOutcome && (
        <div className="card-creation-inner">
          <ArrowBackRounded
            className="lar-icon"
            onClick={() => {
              navigate('/admin/list/cards');
            }}
          />
          <h1>Изменение карточки (ID {cardToEditId}):</h1>
          {characters.length === 0 ? (
            <label className="card-creation-label">
              Создайте как минимум одного персонажа, чтобы создавать/изменять карточки!
            </label>
          ) : (
            <>
              <label className="card-creation-label">Персонаж*</label>
              <select
                className="card-creation-selector"
                name="characterId"
                onChange={handleChange}
                defaultValue={currentCard.character.id}
              >
                <option disabled>-- Выберите персонажа --</option>
                <option selected>
                  {currentCard.character.name}, {currentCard.character.position}
                </option>
                {characters
                  .filter((ch) => ch.id !== currentCard.character.id)
                  .map((character) => {
                    return (
                      <option value={character.id}>
                        {character.name}, {character.position}
                      </option>
                    );
                  })}
              </select>
              <label className="card-creation-label">Тип карточки*</label>
              <select className="card-creation-selector" name="type" onChange={handleChange}>
                <option disabled>-- Выберите тип карточки --</option>
                <option selected={currentCard.type === CardTypesEnum.COMMON} value={CardTypesEnum.COMMON}>
                  Простая
                </option>
                {sequences.length === 0 ? (
                  <option disabled>
                    -- Создайте последовательность в отдельной вкладке, чтобы выбрать её здесь --
                  </option>
                ) : (
                  [
                    <option
                      selected={currentCard.type === CardTypesEnum.SEQUENCE_BEGINNING}
                      value={CardTypesEnum.SEQUENCE_BEGINNING}
                    >
                      Начало последовательности
                    </option>,
                    <option selected={currentCard.type === CardTypesEnum.SEQUENCED} value={CardTypesEnum.SEQUENCED}>
                      Внутри последовательности
                    </option>,
                    <option
                      selected={currentCard.type === CardTypesEnum.SEQUENCE_ENDING}
                      value={CardTypesEnum.SEQUENCE_ENDING}
                    >
                      Конец последовательности
                    </option>,
                  ]
                )}
              </select>
              {form.type !== CardTypesEnum.COMMON && form.type && (
                <>
                  {sequences.length > 0 ? (
                    <>
                      <label className="card-creation-label">Последовательность*</label>
                      <select className="card-creation-selector" name="sequenceId" onChange={handleChange}>
                        <option disabled selected>
                          -- Выберите последовательность --
                        </option>
                        {sequences.map((sequence: SequencesType) => {
                          return (
                            <option value={sequence.id}>
                              {sequence.name}, {sequence.description.slice(0, 64)}
                            </option>
                          );
                        })}
                      </select>
                    </>
                  ) : (
                    <label className="card-creation-label">
                      ('Создайте последовательность в отдельной вкладке, чтобы начать её заполнить)
                    </label>
                  )}
                </>
              )}
              <label className="card-creation-label">Реплика персонажа*</label>
              <textarea
                className="card-creation-textarea"
                name="text"
                onChange={(event) => {
                  limitLength(event);
                  handleChange(event);
                }}
                defaultValue={currentCard.text}
              />
              <label className="card-creation-label">Ответ при 'нет'*</label>
              <textarea
                className="card-creation-textarea"
                name="noText"
                onChange={(event) => {
                  limitLength(event);
                  handleChange(event);
                }}
                defaultValue={currentCard.noText}
              />
              <label className="card-creation-label">Ответ при 'да'*</label>
              <textarea
                className="card-creation-textarea"
                name="yesText"
                onChange={(event) => {
                  limitLength(event);
                  handleChange(event);
                }}
                defaultValue={currentCard.yesText}
              />
              <div className="card-creation-outcome">
                <label className="card-creation-outcome-label">Исход 'нет'</label>
                <label className="card-creation-label">Кофе</label>
                <input
                  type={'number'}
                  step={1}
                  max={100}
                  min={-100}
                  className="card-creation-input"
                  name="coffee"
                  onChange={(event) => {
                    limitResourceValue(event);
                    handleChange(event, 'no');
                  }}
                  defaultValue={currentCard.noOutcome.coffee?.toString()}
                ></input>
                <label className="card-creation-label">Деньги</label>
                <input
                  type={'number'}
                  step={1}
                  max={100}
                  min={-100}
                  className="card-creation-input"
                  name="money"
                  onChange={(event) => {
                    limitResourceValue(event);
                    handleChange(event, 'no');
                  }}
                  defaultValue={currentCard.noOutcome.money?.toString()}
                ></input>
                <label className="card-creation-label">Персонал</label>
                <input
                  type={'number'}
                  step={1}
                  max={100}
                  min={-100}
                  className="card-creation-input"
                  name="personnel"
                  onChange={(event) => {
                    limitResourceValue(event);
                    handleChange(event, 'no');
                  }}
                  defaultValue={currentCard.noOutcome.personnel?.toString()}
                ></input>
                <label className="card-creation-label">Заказчики</label>
                <input
                  type={'number'}
                  step={1}
                  max={100}
                  min={-100}
                  className="card-creation-input"
                  name="customers"
                  onChange={(event) => {
                    limitResourceValue(event);
                    handleChange(event, 'no');
                  }}
                  defaultValue={currentCard.noOutcome.customers?.toString()}
                ></input>
              </div>
              <div className="card-creation-outcome">
                <label className="card-creation-outcome-label">Исход 'да'</label>
                <label className="card-creation-label">Кофе</label>
                <input
                  type={'number'}
                  step={1}
                  max={100}
                  min={-100}
                  className="card-creation-input"
                  name="coffee"
                  onChange={(event) => {
                    limitResourceValue(event);
                    handleChange(event, 'yes');
                  }}
                  defaultValue={currentCard.yesOutcome.coffee?.toString()}
                ></input>
                <label className="card-creation-label">Деньги</label>
                <input
                  type={'number'}
                  step={1}
                  max={100}
                  min={-100}
                  className="card-creation-input"
                  name="money"
                  onChange={(event) => {
                    limitResourceValue(event);
                    handleChange(event, 'yes');
                  }}
                  defaultValue={currentCard.yesOutcome.money?.toString()}
                ></input>
                <label className="card-creation-label">Персонал</label>
                <input
                  type={'number'}
                  step={1}
                  max={100}
                  min={-100}
                  className="card-creation-input"
                  name="personnel"
                  onChange={(event) => {
                    limitResourceValue(event);
                    handleChange(event, 'yes');
                  }}
                  defaultValue={currentCard.yesOutcome.personnel?.toString()}
                ></input>
                <label className="card-creation-label">Заказчики</label>
                <input
                  type={'number'}
                  step={1}
                  max={100}
                  min={-100}
                  className="card-creation-input"
                  name="customers"
                  onChange={(event) => {
                    limitResourceValue(event);
                    handleChange(event, 'yes');
                  }}
                  defaultValue={currentCard.yesOutcome.customers?.toString()}
                ></input>
              </div>
              <button
                className="card-creation-submit"
                onClick={() => {
                  handleUpdate();
                }}
              >
                Обновить карточку
              </button>
            </>
          )}
        </div>
      )}

      <Modal isShown={showModal} setIsShown={setShowModal}>
        {modalText}
      </Modal>
    </div>
  );
});
