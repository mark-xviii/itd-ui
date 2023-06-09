import './Main.sass';
import { Card } from '../../components/CardComponent/Card';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css/core';
import { useState, useEffect, useContext } from 'react';
import { getQuery } from '../../api/queries/get.query';
import { CharactersType } from '../../types/characters.type';
import { Utils } from '../../utils';
import { Sidebar } from '../../components/Sidebar/Sidebar';
import { useNavigate } from 'react-router';
import { observer } from 'mobx-react';
import { AuthContext } from '../../stores/auth.store';
import { MovingTilesAnimation } from '../../components/MovingTilesAnimation/MovingTilesAnimation';
import { UsersType } from '../../types/user.type';

const LogoBanner = require('../../assets/branding/itd_logo_banner.png');
const SquareLogo = require('../../assets/branding/itd_logo_square.png');

export const Main = observer(() => {
  const AuthSingleton = useContext(AuthContext);

  const [characters, setCharacters] = useState<CharactersType[]>([]);

  const [sidebarToggle, setSidebarToggle] = useState<boolean>(false);

  const [records, setRecords] = useState<UsersType[]>([]);

  useEffect(() => {
    getQuery(`${Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.USERS}/stats/records`).then((response) => {
      setRecords([...response.slice(0, 20)]);
    });
  }, []);

  useEffect(() => {
    getQuery(Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.CHARACTERS).then((response: CharactersType[]) => {
      setCharacters(response);
    });
  }, []);

  const navigate = useNavigate();

  return (
    <div className="main-container">
      <div className="main-play">
        <div className="main-play-bg">
          <MovingTilesAnimation />
        </div>
        <img className="main-logo" src={LogoBanner} alt="itd-logo-banner" />
        {characters.length > 0 ? (
          <p className="main-paragraph">Последние персонажи игровой кампании:</p>
        ) : (
          <p className="main-paragraph">Пока что нет персонажей для игровой кампании!</p>
        )}
        <Splide
          className="main-belt"
          aria-label="characters"
          options={{
            type: 'loop',
            perPage: 3,
            focus: 'center',
            arrows: false,
            pagination: false,
            gap: 20,
            rewind: true,
            autoplay: true,
            interval: 1999,
            direction: 'rtl',
          }}
        >
          {characters.length > 0 &&
            characters.map((character: CharactersType) => {
              return (
                <SplideSlide className="main-belt-element">
                  <Card characterName={character.name} imageURL={character.imageLink}></Card>
                </SplideSlide>
              );
            })}
        </Splide>
        {AuthSingleton.accessToken ? (
          <p
            className="main-paragraph main-interactive-paragraph"
            onClick={() => {
              navigate('/game');
            }}
          >
            Начать игру?
          </p>
        ) : (
          <>
            <p className="main-paragraph">
              <span
                className="main-interactive-paragraph"
                onClick={() => {
                  navigate('/register');
                }}
              >
                Зарегистрируйтесь
              </span>
              , чтобы играть!
            </p>
            <p className="main-paragraph">
              Или{' '}
              <span
                className="main-interactive-paragraph"
                onClick={() => {
                  navigate('/login');
                }}
              >
                войдите
              </span>
              .
            </p>
          </>
        )}
      </div>
      <div className="main-presentation">
        {records.length > 0 ? (
          <h1 className="mp-title">Самые успешные организации:</h1>
        ) : (
          <h1 className="mp-title">Пока что никто не играл в игру:</h1>
        )}
        <div className="record-rows">
          {records.map((record) => {
            return (
              <div className="mp-record">
                <p className="mpr-org-title">{record.organizationTitle}</p>
                <p className="mpr-org-highscore">{record.maxScoreRecord}</p>
              </div>
            );
          })}
        </div>
      </div>
      <div className="main-footer">
        <p className="mf-text-info">
          <img className="mf-logo" src={SquareLogo} alt="itd-logo-square" />
          <p>Проект "IT-Disaster" разработан Миткевичем Марком, учащимся учебной группы 44ТП УО "МГКЦТ".</p>
          <p>
            Исходный код клиентского и серверного приложения доступен на репозитории GitHub с одноимённым названием и
            распространяется по лицензии GPLv3.
          </p>
          <p>
            В случае возникновения проблем, вопросов и предложений свяжитесь с разработчиком по почте
            mark.xviii.yhwh@gmail.com.
          </p>
        </p>
      </div>
      <Sidebar isToggle={sidebarToggle} setToggle={setSidebarToggle} />
    </div>
  );
});
