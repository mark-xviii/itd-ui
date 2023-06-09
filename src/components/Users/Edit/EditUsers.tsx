import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { AuthContext } from '../../../stores/auth.store';
import { UsersType } from '../../../types/user.type';
import Modal from '../../Modal/Modal';
import { updateQuery } from '../../../api/queries/update.query';
import { Utils } from '../../../utils';
import { getQuery } from '../../../api/queries/get.query';

import './EditUsers.sass';
import { ArrowBackRounded } from '@mui/icons-material';

export function EditUsers() {
  const { id: currentUserId } = useParams() as { id: string; entity: string; action: string };

  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalText, setModalText] = useState<string>('');

  const [currentUser, setCurrentUser] = useState<UsersType>();

  const navigate = useNavigate();

  const AuthSingleton = useContext(AuthContext);

  const maxLength = 64;

  function limitLength(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.value.length >= maxLength) {
      event.target.value = event.target.value.slice(0, maxLength - 1);
    }
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [`${event.target.name}`]: event.target.value });
  }

  function handleUpdate() {
    if (AuthSingleton.accessToken && currentUser?.id) {
      setShowModal(true);

      setModalText('Обновление пользователя...');

      updateQuery(
        `${Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.USERS}/${currentUser.id}`,
        form,
        AuthSingleton.accessToken,
      ).then(async (response) => {
        console.log(response);
        if (response.status !== 200) {
          setModalText(`Что-то пошло не так :( ${(await response.json()).message}`);
        }
        if (response.status === 200) {
          setModalText('Пользователь успешно изменён!');
          setTimeout(() => {
            navigate(
              `/admin/${Utils.Constants.AVAILABLE_AP_ACTIONS_ENUM.LIST}/${Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.USERS}`,
            );
          }, 1000);
        }
      });
    }
  }

  const [form, setForm] = useState<UsersType>({} as UsersType);

  useEffect(() => {
    if (AuthSingleton.accessToken) {
      getQuery(
        `${Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.USERS}/one/${currentUserId}`,
        AuthSingleton.accessToken,
      ).then((response) => {
        setCurrentUser(response);
      });
    }
  }, [AuthSingleton.accessToken]);

  return (
    <div className="ed-u-container">
      {currentUser && (
        <>
          <ArrowBackRounded
            className="lar-icon"
            onClick={() => {
              navigate('/admin/list/users');
            }}
          />
          <h1>Изменение пользователя (login - {currentUser.login}):</h1>
          <label className="card-creation-label">Логин</label>
          <input
            className="ch-create-input"
            name="login"
            onChange={(event) => {
              limitLength(event);
              handleChange(event);
            }}
            defaultValue={currentUser.login}
          ></input>
          <label className="card-creation-label">Название организации</label>
          <input
            className="ch-create-input"
            name="organizationTitle"
            onChange={(event) => {
              limitLength(event);
              handleChange(event);
            }}
            defaultValue={currentUser.organizationTitle}
          ></input>
          <button
            className="card-creation-submit"
            onClick={() => {
              handleUpdate();
            }}
          >
            Обновить пользователя
          </button>
        </>
      )}
      <Modal isShown={showModal} setIsShown={setShowModal}>
        {modalText}
      </Modal>
    </div>
  );
}
