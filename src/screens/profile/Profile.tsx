import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getMeQuery } from '../../api/queries/get.me.query';
import { getQuery } from '../../api/queries/get.query';
import { Sidebar } from '../../components/Sidebar/Sidebar';
import { AuthContext } from '../../stores/auth.store';
import { SessionsType } from '../../types/sessions.type';
import { UsersType } from '../../types/user.type';
import { Utils } from '../../utils';
import './Profile.sass';
import { CancelRounded, EditRounded, SaveRounded } from '@mui/icons-material';
import { updateQuery } from '../../api/queries/update.query';

export function Profile() {
  const navigate = useNavigate();

  const AuthSingleton = useContext(AuthContext);
  const [sidebarToggle, setSidebarToggle] = useState<boolean>(false);

  const [me, setMe] = useState<UsersType>();
  const [history, setHistory] = useState<SessionsType[]>([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  useEffect(() => {
    if (!AuthSingleton.accessToken) {
      navigate('/');
    }
  }, [AuthSingleton.role]);

  useEffect(() => {
    if (AuthSingleton.accessToken) {
      getMeQuery(AuthSingleton.accessToken).then(async (response) => {
        const result = (await response.json()) as UsersType;
        setMe(result);
        console.log(result);
      });
      getQuery(`${Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.SESSIONS}/history`, AuthSingleton.accessToken).then(
        (response) => {
          setHistory(response);
        },
      );
    }
  }, [AuthSingleton.accessToken]);

  type updateProfileType = { login: string; password: string; organizationTitle: string };

  const [form, setForm] = useState<updateProfileType>({} as updateProfileType);

  function handleChange(event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [`${event.target.name}`]: event.target.value });
  }

  function saveChanges() {
    if (AuthSingleton.accessToken && me?.id) {
      updateQuery(`${Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.USERS}/${me.id}`, form, AuthSingleton.accessToken).then(
        async (response) => {
          setMe({ ...me, ...(await response.json()) });
        },
      );
    }
  }

  return (
    <div className="profile-container">
      {me && (
        <div className="profile-insides">
          <div className="profile-stats">
            <div>
              {!isEdit && (
                <div
                  className="profile-edit-action"
                  onClick={() => {
                    setIsEdit(true);
                  }}
                >
                  <EditRounded className="edit-profile-icon" />
                  Изменить профиль
                </div>
              )}
              {isEdit && (
                <div
                  className="profile-edit-action"
                  onClick={() => {
                    saveChanges();
                    setIsEdit(false);
                  }}
                >
                  <SaveRounded className="edit-profile-icon" />
                  Сохранить изменения
                </div>
              )}
              {isEdit && (
                <div
                  className="profile-edit-action"
                  onClick={() => {
                    setIsEdit(false);
                  }}
                >
                  <CancelRounded className="edit-profile-icon" />
                  Отменить изменения
                </div>
              )}
            </div>
            <label className="profile-label">Идентификатор:</label>
            <p className="profile-stat">{me.id}</p>
            <label className="profile-label">Логин:</label>
            {isEdit ? (
              <input className="profile-stat-edit" defaultValue={me.login} name="login" onChange={handleChange} />
            ) : (
              <p className="profile-stat">{me.login}</p>
            )}

            <label className="profile-label">Название организации:</label>
            {isEdit ? (
              <input
                className="profile-stat-edit"
                defaultValue={me.organizationTitle}
                name="organizationTitle"
                onChange={handleChange}
              />
            ) : (
              <p className="profile-stat">{me.organizationTitle}</p>
            )}
            {isEdit && <label className="profile-label">Новый пароль:</label>}
            {isEdit && <input className="profile-stat-edit" name="password" onChange={handleChange} />}
            <label className="profile-label">Максимальный рекорд:</label>
            <p className="profile-stat">{me.maxScoreRecord}</p>
            <label className="profile-label">Отыгранно игр:</label>
            <p className="profile-stat">{me.sessions.length}</p>
            <label className="profile-label">История игр:</label>
            <table className="profile-history">
              <thead>
                <tr>
                  <td>Id Игры</td>
                  <td>Ходов</td>
                  <td>Исход</td>
                  <td>Активная сессия?</td>
                </tr>
              </thead>
              <tbody>
                {history.map((session) => {
                  return (
                    <tr>
                      <td>{session.id}</td>
                      <td>{session.turn}</td>
                      <td>
                        {session.verdict && session.isFinished && `Сессия проиграна`}
                        {!session.verdict && session.isFinished && `Победа`}
                        {!session.verdict && !session.isFinished && ''}
                      </td>
                      <td>{!session.isFinished && 'Да'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <Sidebar isToggle={sidebarToggle} setToggle={setSidebarToggle} />
    </div>
  );
}
