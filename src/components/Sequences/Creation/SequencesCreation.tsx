import { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router';
import { postQuery } from '../../../api/queries/post.query';
import { SequencesType } from '../../../types/sequences.type';
import { Utils } from '../../../utils';
import Modal from '../../Modal/Modal';
import './SequencesCreation.sass';
import { ArrowBackRounded } from '@mui/icons-material';

export function SequencesCreation() {
  const [form, setForm] = useState<SequencesType>({} as SequencesType);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalText, setModalText] = useState<string>('');

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

  function send() {
    if (!validateForm()) {
      setModalText('Заполните все поля!');
      setShowModal(true);
    } else {
      setShowModal(true);
      postQuery(Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.SEQUENCES, form).then((result) => {
        if (result.status !== 201) {
          setModalText('Ошибка при создании!');
        }

        if (result.status === 201) {
          setModalText('Последовательность создана!');
          setTimeout(() => {
            navigate(
              `/admin/${Utils.Constants.AVAILABLE_AP_ACTIONS_ENUM.LIST}/${Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.SEQUENCES}/`,
            );
          }, 1500);
        }
      });
    }
  }

  function validateForm() {
    if (!form.description || !form.name) {
      return false;
    }

    return true;
  }

  return (
    <div className="sq-create-container">
      <ArrowBackRounded
        className="lar-icon"
        onClick={() => {
          navigate('/admin/list/sequences');
        }}
      />
      <h1>Создание последовательности:</h1>
      <label className="card-creation-label">Имя последовательности*</label>
      <input
        className="ch-create-input"
        name="name"
        onChange={(event) => {
          limitLength(event);
          handleChange(event);
        }}
      />
      <label className="card-creation-label">Описание последовательности*</label>
      <input
        className="ch-create-input"
        name="description"
        onChange={(event) => {
          limitLength(event);
          handleChange(event);
        }}
      />
      <button className="card-creation-submit" onClick={send}>
        Создать
      </button>
      <Modal isShown={showModal} setIsShown={setShowModal}>
        {modalText}
      </Modal>
    </div>
  );
}
