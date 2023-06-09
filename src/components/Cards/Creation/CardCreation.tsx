import { ChangeEvent, useEffect, useState } from 'react';
import { getQuery } from '../../../api/queries/get.query';
import { CharactersType } from '../../../types/characters.type';
import { Utils } from '../../../utils';
import './CardCreation.sass';
import { SequencesType } from '../../../types/sequences.type';
import { CardTypesEnum } from '../../../enums/card-types.enum';
import { postQuery } from '../../../api/queries/post.query';
import Modal from '../../Modal/Modal';
import { CardsPostQueryType } from './cards-post-query.type';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router';
import { ArrowBackRounded } from '@mui/icons-material';
// import { AdminContext } from '../../Routing/Routing';

export const CardCreation = observer(() => {
  const [characters, setCharacters] = useState<CharactersType[]>([]);
  const [sequences, setSequences] = useState<SequencesType[]>([]);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalText, setModalText] = useState<string>('');

  const navigate = useNavigate();

  const [form, setForm] = useState<CardsPostQueryType>({
    noOutcome: { coffee: 0, personnel: 0, money: 0, customers: 0 },
    yesOutcome: { coffee: 0, personnel: 0, money: 0, customers: 0 },
  } as CardsPostQueryType);

  useEffect(() => {
    getQuery(Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.CHARACTERS).then((response: CharactersType[]) => {
      setCharacters(response);
    });

    getQuery(Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.SEQUENCES).then((response: SequencesType[]) => {
      setSequences(response);
    });
  }, []);

  useEffect(() => {
    console.log(form);
  }, [form, setForm]);

  function sendCard() {
    if (!validateForm()) {
      setShowModal(true);
      return;
    }

    setShowModal(true);

    setModalText('Создание карточки...');

    let pre = { ...form };
    pre.noOutcome.coffee = Number(pre.noOutcome.coffee);
    pre.noOutcome.personnel = Number(pre.noOutcome.personnel);
    pre.noOutcome.customers = Number(pre.noOutcome.customers);
    pre.noOutcome.money = Number(pre.noOutcome.money);

    pre.yesOutcome.coffee = Number(pre.yesOutcome.coffee);
    pre.yesOutcome.personnel = Number(pre.yesOutcome.personnel);
    pre.yesOutcome.customers = Number(pre.yesOutcome.customers);
    pre.yesOutcome.money = Number(pre.yesOutcome.money);

    postQuery(Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.CARDS, pre).then(async (response) => {
      console.log(response);
      if (response.status !== 201) {
        setModalText(`Что-то пошло не так :( ${(await response.json()).message}`);
      }
      if (response.status === 201) {
        setModalText('Карточка успешно создана!');
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

  function handleChange(
    event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>,
    yn?: 'yes' | 'no' | undefined,
  ) {
    console.log(event.target.value, event.target.name);
    if (event.target.name === 'type' && event.target.value === CardTypesEnum.COMMON) {
      const t = form;
      delete t.sequenceId;
      setForm(t);
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
    if (!form.characterId || !form.text || !form.type) {
      setModalText('Вы не заполнили основные данные!');
      return false;
    }

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

  return (
    <div className="card-creation-container">
      <div className="card-creation-inner">
        <ArrowBackRounded
          className="lar-icon"
          onClick={() => {
            navigate('/admin/list/cards');
          }}
        />
        <h1>Создание карточки:</h1>
        {characters.length === 0 ? (
          <label className="card-creation-label">Создайте как минимум одного персонажа.</label>
        ) : (
          <>
            <label className="card-creation-label">Персонаж*</label>
            <select className="card-creation-selector" name="characterId" onChange={handleChange}>
              <option disabled selected>
                -- Выберите персонажа --
              </option>
              {characters.map((character) => {
                return (
                  <option value={character.id}>
                    {character.name}, {character.position}
                  </option>
                );
              })}
            </select>
            <label className="card-creation-label">Тип карточки*</label>
            <select className="card-creation-selector" name="type" onChange={handleChange}>
              <option disabled selected>
                -- Выберите тип карточки --
              </option>
              <option value={CardTypesEnum.COMMON}>Простая</option>
              {sequences.length === 0 ? (
                <option disabled>-- Создайте последовательность в отдельной вкладке, чтобы выбрать её здесь --</option>
              ) : (
                [
                  <option value={CardTypesEnum.SEQUENCE_BEGINNING}>Начало последовательности</option>,
                  <option value={CardTypesEnum.SEQUENCED}>Внутри последовательности</option>,
                  <option value={CardTypesEnum.SEQUENCE_ENDING}>Конец последовательности</option>,
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
            />
            <label className="card-creation-label">Ответ при 'нет'*</label>
            <textarea
              className="card-creation-textarea"
              name="noText"
              onChange={(event) => {
                limitLength(event);
                handleChange(event);
              }}
            />
            <label className="card-creation-label">Ответ при 'да'*</label>
            <textarea
              className="card-creation-textarea"
              name="yesText"
              onChange={(event) => {
                limitLength(event);
                handleChange(event);
              }}
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
              ></input>
            </div>
            <button className="card-creation-submit" onClick={sendCard}>
              Создать карточку
            </button>
          </>
        )}
      </div>
      <Modal isShown={showModal} setIsShown={setShowModal}>
        {modalText}
      </Modal>
    </div>
  );
});
