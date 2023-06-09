import { observer } from 'mobx-react';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getMySession } from '../../api/queries/get.session';
import { makeChoiceQuery } from '../../api/queries/make-choice';
import { startSession } from '../../api/queries/start-session';
import { AnimatedBackground } from '../../components/AnimatedBackground/AnimatedBackground';
import { DraggableCard } from '../../components/DraggableCard/DraggableCard';
import { ResourcePanel } from '../../components/ResourceIndicator/ResourcePanel';
import { Sidebar } from '../../components/Sidebar/Sidebar';
import { AuthContext } from '../../stores/auth.store';
import { CardsType } from '../../types/cards.type';
import { ChoiceResponseType, ChoiceSummaryEnum } from '../../types/choice-response.type';
import { SessionsType } from '../../types/sessions.type';
import './Game.sass';

export type CursorPositionType = {
  x: number | null;
  y: number | null;
};

export const GameScreen = observer(() => {
  const [session, setSession] = useState<SessionsType>({} as SessionsType);
  const [cursorPositionDifference, setCursorPositionDifference] = useState<CursorPositionType>(
    {} as CursorPositionType,
  );
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const [isTouchDown, setIsTouchDown] = useState<boolean>(false);
  const [transition, setTransition] = useState<string>('0s');
  const [currentText, setCurrentText] = useState<string | null>(null);
  const [selectOption, setSelectOption] = useState<'Yes' | 'No' | null>(null);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [isVictory, setVictory] = useState<boolean>(false);
  const [summary, setSummary] = useState<ChoiceResponseType>({} as ChoiceResponseType);

  const [toggleSidebar, setToggleSidebar] = useState<boolean>(false);

  const navigate = useNavigate();

  const AuthSingleton = useContext(AuthContext);

  useEffect(() => {
    if (AuthSingleton.accessToken) {
      getMySession(AuthSingleton.accessToken).then(async (response) => {
        if (response.status !== 200) {
        } else {
          const result = (await response.json()) as SessionsType;

          setSession(result);
        }
      });
    } else {
    }
  }, [AuthSingleton.accessToken]);

  function startNewSession() {
    setSession({ ...session, currentCard: {} as CardsType });
    if (AuthSingleton.accessToken) {
      startSession(AuthSingleton.accessToken).then(async (response) => {
        const result = (await response.json()) as SessionsType;

        setSession(result);
      });
    }
  }

  function makeChoiceAndUpdateSession(choice: 'Yes' | 'No') {
    if (AuthSingleton.accessToken) {
      makeChoiceQuery(choice, AuthSingleton.accessToken).then((_response) => {
        if (AuthSingleton.accessToken) {
          getMySession(AuthSingleton.accessToken).then(async (__response) => {
            if (_response.status === 201) {
              const result_summary = (await _response.json()) as ChoiceResponseType;
              const result_sesh = (await __response.json()) as SessionsType;

              console.log(result_summary);

              if (result_summary.type === ChoiceSummaryEnum.FAILURE) {
                console.log('koodah');
                setGameOver(true);
                setSummary({ ...summary, summary: result_summary.summary });
                setSession({ ...session, ...result_summary.resourceObject, currentCard: {} as CardsType });
              } else {
                console.log(result_summary.type);
                if (result_summary.type === ChoiceSummaryEnum.VICTORY) {
                  const __session = { ...session, turn: session.turn + 1 };
                  setVictory(true);
                  setSession({
                    ...{
                      ...__session,
                      ...result_sesh,
                      ...result_summary.resourceObject,
                      verdict: result_summary.summary,
                    },
                    ...{ ...result_summary.resourceObject },
                  });
                }
                if (
                  result_summary.type === ChoiceSummaryEnum.CONTINUE ||
                  result_summary.type === ChoiceSummaryEnum.SEQUENCE_BEGINNING ||
                  result_summary.type === ChoiceSummaryEnum.SEQUENCE_END
                ) {
                  setSession({
                    ...{ ...session, ...result_sesh, ...result_summary.resourceObject },
                    ...{ ...result_summary.resourceObject },
                  });
                }
              }
            } else {
              // TODO
            }
          });
        }
      });
    }
  }

  useEffect(() => {
    // eslint-disable-next-line no-restricted-globals
    addEventListener('mouseup', (event) => {
      if (selectOption && session.currentCard) {
        console.log(`decision - ${selectOption}`);
        makeChoiceAndUpdateSession(selectOption === 'No' ? 'No' : 'Yes');
      }
      setCurrentText(null);
      setIsMouseDown(false);
      setTransition('0.333s');
      setCursorPositionDifference({ x: 0, y: 0 });
      setSelectOption(null);
    });
    // eslint-disable-next-line no-restricted-globals
    addEventListener('touchend', () => {
      if (selectOption && session.currentCard) {
        console.log(`decision - ${selectOption}`);
        makeChoiceAndUpdateSession(selectOption === 'No' ? 'No' : 'Yes');
      }
      setCurrentText(null);
      setIsTouchDown(false);
      setTransition('0.333s');
      setCursorPositionDifference({ x: 0, y: 0 });
      setSelectOption(null);
    });
  }, []);

  function onMouseDown(event: MouseEvent) {
    setTransition('0s');
    setIsMouseDown(true);
    setCursorPositionDifference({ x: 0, y: 0 });
  }

  function onMouseUp(event: MouseEvent) {
    if (selectOption && session.currentCard) {
      console.log(`decision - ${selectOption}`);
      makeChoiceAndUpdateSession(selectOption === 'No' ? 'No' : 'Yes');
    }
    setCurrentText(null);
    setTransition('0.333s');
    setIsMouseDown(false);
    setSelectOption(null);
  }

  function onMouseMove(event: MouseEvent) {
    if (isMouseDown) {
      setCursorPositionDifference({
        x: event.clientX - window.innerWidth / 2,
        y: event.clientY,
      });
    }
  }

  function onTouchDown(event: TouchEvent) {
    setTransition('0s');
    setIsTouchDown(true);
    setCursorPositionDifference({ x: 0, y: 0 });
  }

  function onTouchUp(event: TouchEvent) {
    if (selectOption && session.currentCard) {
      console.log(`decision - ${selectOption}`);
      makeChoiceAndUpdateSession(selectOption === 'No' ? 'No' : 'Yes');
    }
    setCurrentText(null);
    setTransition('0.333s');
    setIsTouchDown(false);
    setSelectOption(null);
  }

  function onTouchMove(event: TouchEvent) {
    if (isTouchDown) {
      setCursorPositionDifference({
        x: event.touches[0].clientX - window.innerWidth / 2,
        y: event.touches[0].clientY,
      });
    }
  }

  useEffect(() => {
    if (session.id) {
      if (cursorPositionDifference.x) {
        if (cursorPositionDifference.x < -window.innerWidth / 10) {
          setCurrentText(`${session.currentCard.noText} (нет)`);
          if (cursorPositionDifference.x <= -window.innerWidth / 3.168) {
            setSelectOption('No');
          } else {
            setSelectOption(null);
          }
        } else if (cursorPositionDifference.x > window.innerWidth / 10) {
          setCurrentText(`${session.currentCard.yesText} (да)`);
          if (cursorPositionDifference.x >= window.innerWidth / 3.168) {
            setSelectOption('Yes');
          } else {
            setSelectOption(null);
          }
        } else {
          setSelectOption(null);
          setCurrentText(null);
        }
      }
    }
  }, [cursorPositionDifference]);

  useEffect(() => {
    console.log(currentText);
  }, [currentText]);

  return (
    <div className="gs">
      <AnimatedBackground className="gs-abg" />
      <div
        className="gs-inner"
        onMouseDown={onMouseDown as any}
        onMouseUp={onMouseUp as any}
        onMouseMove={onMouseMove as any}
        onTouchStart={onTouchDown as any}
        onTouchEnd={onTouchUp as any}
        onTouchMove={onTouchMove as any}
      >
        {AuthSingleton.accessToken ? (
          session && session.currentCard && !gameOver && !isVictory ? (
            <div className="gs-insides">
              <DraggableCard
                character={session.currentCard.character}
                card={session.currentCard}
                style={{
                  left: `${cursorPositionDifference.x && cursorPositionDifference.x}px`,
                  transitionDuration: transition,
                }}
              />
              {session.currentCard.character && session.currentCard && (
                <p className="g-replica">— {session.currentCard.text}</p>
              )}
              {currentText && (
                <p
                  className="g-replica"
                  style={{
                    backgroundColor: `${selectOption === 'Yes' ? 'green' : selectOption === 'No' ? 'red' : '#080808'}`,
                  }}
                >
                  — {currentText}
                </p>
              )}
            </div>
          ) : (
            <p className="g-replica">
              {gameOver
                ? `Игра окончена! Причина провала: ${summary.summary} Вы выстояли ${session.turn} ходов. `
                : 'Сейчас нет активной сессии. '}
              {isVictory && `Победа! Вы выстояли ${session.turn} ходов.`}
              <button
                className="g-button"
                onClick={() => {
                  if (gameOver || isVictory) {
                    setGameOver(false);
                    setVictory(false);
                    setSummary({} as ChoiceResponseType);
                  }
                  startNewSession();
                }}
              >
                Начать{(gameOver || isVictory) && ' заново'}?
              </button>
            </p>
          )
        ) : (
          <p className="g-replica">
            Сперва войдите в систему!
            <button
              onClick={() => {
                navigate('/login');
              }}
            >
              Войти
            </button>
          </p>
        )}
      </div>
      <Sidebar isToggle={toggleSidebar} setToggle={setToggleSidebar} />
      <ResourcePanel
        coffee={session.coffee ? (gameOver ? 100 : session.coffee) : 50}
        money={session.money ? (gameOver ? 100 : session.money) : 50}
        personnel={session.personnel ? (gameOver ? 100 : session.personnel) : 50}
        customers={session.customers ? (gameOver ? 100 : session.customers) : 50}
        className="rip-game"
      />
    </div>
  );
});
