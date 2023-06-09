import { ChangeEvent, useContext, useEffect, useState } from 'react';
import './SequencesEdit.sass';
import { CardsType } from '../../../types/cards.type';
import { useNavigate, useParams } from 'react-router';
import Modal from '../../Modal/Modal';
import { transCardType } from '../../Cards/List/CardList';
import { Card } from '../../CardComponent/Card';
import { CardTypesEnum } from '../../../enums/card-types.enum';
import { getQuery } from '../../../api/queries/get.query';
import { Utils } from '../../../utils';
import { SequencesType } from '../../../types/sequences.type';
import { postQuery } from '../../../api/queries/post.query';
import { updateQuery } from '../../../api/queries/update.query';
import { AuthContext } from '../../../stores/auth.store';
import { ArrowBackRounded } from '@mui/icons-material';

export function SequencesEdit() {
  let { id: sequenceId } = useParams() as { id: string };

  const [beginningId, setBeginningId] = useState<string>();
  const [beginningPreview, setBeginningPreview] = useState<CardsType>();

  const [sequencedIds, setSequencedIds] = useState<{ id: string }[]>([]);
  const [sequencedPreview, setSequencedPreview] = useState<CardsType[]>([]);

  const [endingId, setEndingId] = useState<string>();
  const [endingPreview, setEndingPreview] = useState<CardsType>();

  const [currentSequence, setCurrentSequence] = useState<SequencesType>();

  useEffect(() => {
    console.log(sequencedIds);
  }, [sequencedIds]);

  useEffect(() => {
    if (sequenceId) {
      getQuery(`${Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.SEQUENCES}/${sequenceId}`).then(
        (result: SequencesType) => {
          const __result = JSON.parse(JSON.stringify(result)) as SequencesType;

          console.log(__result.cards.at(-1));

          setCurrentSequence(__result);

          if (__result.cards[0]) {
            setBeginningId(__result.cards[0].id);
            setBeginningPreview(__result.cards[0]);
          }

          if (__result.cards.at(-1)) {
            setEndingId(__result.cards.at(-1)?.id);
            setEndingPreview(__result.cards.at(-1));
          }

          if (
            __result.cards.at(-1)?.type === CardTypesEnum.SEQUENCE_ENDING &&
            __result.cards[0].type === CardTypesEnum.SEQUENCE_BEGINNING
          ) {
            setCanMakeSequence(true);
          }

          if (__result.cards.length > 2) {
            setSequencedIds(
              __result.cards.slice(1, -1).map((card) => {
                return {
                  id: card.id,
                };
              }),
            );
            const __deep = JSON.parse(JSON.stringify(__result.cards.slice(1, -1))) as unknown as CardsType[];

            setSequencedPreview(__deep);
          }
        },
      );
    }
  }, [sequenceId]);

  const AuthSingleton = useContext(AuthContext);

  const [positionToReplace, setPositionToReplace] = useState<number | null>();

  const [canMakeSequence, setCanMakeSequence] = useState<boolean>(false);

  function sendSequence() {
    if (AuthSingleton.accessToken && beginningId && endingId) {
      postQuery(`sequences/linear-creation`, {
        cardIds: [beginningId, ...sequencedIds.map((sq) => sq.id), endingId],
      }).then(async (response) => {
        if (response.status === 201) {
          alert('Последовательность применена!');
        } else {
          alert(`Произошла ошибка! ${(await response.json()).message}`);
        }
      });

      if (form.description || form.name) {
        updateQuery(`sequences/${sequenceId}`, form, AuthSingleton.accessToken);
      }
    }
  }

  const [cardsContext, setCardsContext] = useState<CardsType[]>([]);

  const [isShown, setIsShown] = useState<boolean>(false);

  function fetchCardsTyped(
    type: CardTypesEnum.SEQUENCE_BEGINNING | CardTypesEnum.SEQUENCE_ENDING | CardTypesEnum.SEQUENCED,
  ) {
    if (currentSequence) {
      getQuery(`${Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.CARDS}`).then((response: CardsType[]) => {
        let _cards = [...response.filter((card) => card.type === type && card.sequence.id === currentSequence.id)];

        if (type === CardTypesEnum.SEQUENCED) {
          _cards = [..._cards.filter((_card) => !sequencedIds.find((val) => val.id === _card.id))];
        }

        setCardsContext(_cards);
      });
    }
  }

  function deleteCard(position: number) {
    const _removed = [...sequencedIds.filter((id, index) => index !== position)];
    const _removedPreview = [...sequencedPreview.filter((id, index) => index !== position)];
    setSequencedIds(_removed);
    setSequencedPreview(_removedPreview);
  }

  const navigate = useNavigate();

  const maxLength = 64;

  function limitLength(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.value.length >= maxLength) {
      event.target.value = event.target.value.slice(0, maxLength - 1);
    }
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [`${event.target.name}`]: event.target.value });
  }

  const [form, setForm] = useState<SequencesType>({} as SequencesType);

  return (
    <div className="sq-create-container">
      <ArrowBackRounded
        className="lar-icon"
        onClick={() => {
          navigate('/admin/list/sequences');
        }}
      />
      <h1>Редактирование последовательности:</h1>
      <label className="card-creation-label">Имя последовательности*</label>
      <input
        className="ch-create-input"
        name="name"
        defaultValue={currentSequence?.name}
        onChange={(event) => {
          limitLength(event);
          handleChange(event);
        }}
      />
      <label className="card-creation-label">Описание последовательности*</label>
      <input
        className="ch-create-input"
        name="description"
        defaultValue={currentSequence?.description}
        onChange={(event) => {
          limitLength(event);
          handleChange(event);
        }}
      />
      <label className="card-creation-label">
        Последовательность может содержать минимум 2 карточки: начало и конец.
      </label>
      <label className="card-creation-label">Выберите карточки*</label>
      {canMakeSequence ? (
        <>
          <div className="sq-cards-wrapper">
            <div
              className="sq-edit-pos-container"
              onClick={() => {
                fetchCardsTyped(CardTypesEnum.SEQUENCE_BEGINNING);
                setIsShown(true);
              }}
            >
              {beginningPreview && (
                <div className="sq-edit-underlying">
                  <div className="card-card">
                    <img className="sq-edit-preview-img" src={beginningPreview.character.imageLink} alt="img" />
                  </div>
                  <p className="card-p">
                    <span className="card-span">
                      <b>Персонаж:</b>
                    </span>
                    {beginningPreview.character.name}
                  </p>
                  <p className="card-p">
                    <span className="card-span">
                      <b>Должность:</b>
                    </span>
                    {beginningPreview.character.position}
                  </p>
                  <p className="card-p">
                    <span className="card-span">
                      <b>Реплика:</b>
                    </span>
                    {beginningPreview.text}
                  </p>
                  <p className="card-p">
                    <span className="card-span">
                      <b>Текст при 'нет':</b>
                    </span>
                    {beginningPreview.noText}
                  </p>
                  <p className="card-p">
                    <span className="card-span">
                      <b>Текст при 'да':</b>
                    </span>
                    {beginningPreview.yesText}
                  </p>
                </div>
              )}
              <div className="sq-edit-counter">1*</div>
              <div className="sq-edit-picker">Выбрать Начало</div>
            </div>
            {sequencedIds.length === 0 && (
              <div className="sq-edit-pos-container">
                <div className="sq-edit-counter">+</div>
                <div
                  className="sq-edit-picker"
                  onClick={() => {
                    fetchCardsTyped(CardTypesEnum.SEQUENCED);
                    setIsShown(true);
                  }}
                >
                  Выбрать
                </div>
              </div>
            )}
            {sequenceId.length > 0 &&
              sequencedIds.map((sq, index) => {
                return (
                  <div className="sq-edit-pos-container">
                    {sequencedPreview[index] && (
                      <div className="sq-edit-underlying">
                        <div className="card-card">
                          <img
                            className="sq-edit-preview-img"
                            src={sequencedPreview[index].character.imageLink}
                            alt="img"
                          />
                        </div>
                        <p className="card-p">
                          <span className="card-span">
                            <b>Персонаж:</b>
                          </span>
                          {sequencedPreview[index].character.name}
                        </p>
                        <p className="card-p">
                          <span className="card-span">
                            <b>Должность:</b>
                          </span>
                          {sequencedPreview[index].character.position}
                        </p>
                        <p className="card-p">
                          <span className="card-span">
                            <b>Реплика:</b>
                          </span>
                          {sequencedPreview[index].text}
                        </p>
                        <p className="card-p">
                          <span className="card-span">
                            <b>Текст при 'нет':</b>
                          </span>
                          {sequencedPreview[index].noText}
                        </p>
                        <p className="card-p">
                          <span className="card-span">
                            <b>Текст при 'да':</b>
                          </span>
                          {sequencedPreview[index].yesText}
                        </p>
                      </div>
                    )}
                    <div className="sq-edit-counter">{index + 2}</div>
                    <div
                      className="sq-edit-picker"
                      onClick={() => {
                        setPositionToReplace(index);
                        fetchCardsTyped(CardTypesEnum.SEQUENCED);
                        setIsShown(true);
                      }}
                    >
                      Выбрать
                    </div>
                    <div
                      className="sq-edit-deleter"
                      onClick={() => {
                        console.log(index);
                        deleteCard(index);
                      }}
                    >
                      Удалить
                    </div>
                  </div>
                );
              })}
            {sequencedIds.length >= 1 && (
              <div className="sq-edit-pos-container">
                <div className="sq-edit-counter">+</div>
                <div
                  className="sq-edit-picker"
                  onClick={() => {
                    setPositionToReplace(null);
                    fetchCardsTyped(CardTypesEnum.SEQUENCED);
                    setIsShown(true);
                  }}
                >
                  Выбрать
                </div>
              </div>
            )}
            <div className="sq-edit-pos-container">
              {endingPreview && (
                <div className="sq-edit-underlying">
                  <div className="card-card">
                    <img className="sq-edit-preview-img" src={endingPreview.character.imageLink} alt="img" />
                  </div>
                  <p className="card-p">
                    <span className="card-span">
                      <b>Персонаж:</b>
                    </span>
                    {endingPreview.character.name}
                  </p>
                  <p className="card-p">
                    <span className="card-span">
                      <b>Должность:</b>
                    </span>
                    {endingPreview.character.position}
                  </p>
                  <p className="card-p">
                    <span className="card-span">
                      <b>Реплика:</b>
                    </span>
                    {endingPreview.text}
                  </p>
                  <p className="card-p">
                    <span className="card-span">
                      <b>Текст при 'нет':</b>
                    </span>
                    {endingPreview.noText}
                  </p>
                  <p className="card-p">
                    <span className="card-span">
                      <b>Текст при 'да':</b>
                    </span>
                    {endingPreview.yesText}
                  </p>
                </div>
              )}
              <div className="sq-edit-counter">{sequencedIds.length === 0 ? 2 : sequencedIds.length + 2}*</div>
              <div
                className="sq-edit-picker"
                onClick={() => {
                  fetchCardsTyped(CardTypesEnum.SEQUENCE_ENDING);
                  setIsShown(true);
                }}
              >
                Выбрать Конец
              </div>
            </div>
          </div>
          <Modal isShown={isShown} setIsShown={setIsShown}>
            <div className="sq-edit-modal">
              {cardsContext.map((card) => {
                return (
                  <div
                    className="card-intel sq-edit-ci"
                    onClick={() => {
                      if (card.type === CardTypesEnum.SEQUENCE_BEGINNING) {
                        setBeginningId(card.id);
                        getQuery(`${Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.CARDS}/${card.id}`).then((result) => {
                          setBeginningPreview(result);
                        });
                      }

                      // add
                      if (card.type === CardTypesEnum.SEQUENCED && !positionToReplace) {
                        setSequencedIds([...sequencedIds, { id: card.id }]);
                        getQuery(`${Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.CARDS}/${card.id}`).then((result) => {
                          setSequencedPreview([...sequencedPreview, result]);
                        });
                      }

                      // replace
                      if (
                        card.type === CardTypesEnum.SEQUENCED &&
                        positionToReplace !== null &&
                        positionToReplace !== undefined
                      ) {
                        const _replaced = sequencedIds;

                        const _previewReplaced = sequencedPreview;

                        _replaced[positionToReplace] = { id: card.id };

                        getQuery(`${Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.CARDS}/${card.id}`).then((result) => {
                          _previewReplaced[positionToReplace] = result;
                          setSequencedPreview(_previewReplaced);
                        });

                        setSequencedIds(_replaced);
                      }

                      if (card.type === CardTypesEnum.SEQUENCE_ENDING) {
                        setEndingId(card.id);
                        getQuery(`${Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.CARDS}/${card.id}`).then((result) => {
                          setEndingPreview(result);
                        });
                      }

                      setIsShown(false);
                      setCardsContext([]);
                    }}
                  >
                    <div className="card-info">
                      <div className="card-card">
                        <img src={card.character.imageLink} alt="img" />
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
                );
              })}
            </div>
          </Modal>
          <button className="card-creation-submit" onClick={sendSequence}>
            Сохранить последовательность
          </button>
        </>
      ) : (
        <label className="card-creation-label">Проверьте наличие типов карточек для конца и начала*</label>
      )}
    </div>
  );
}
