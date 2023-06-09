import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { postMultipartQuery } from '../../../api/queries/post.multipart';
import { Utils } from '../../../utils';
import Modal from '../../Modal/Modal';
import { CharacterPostQueryType } from './character-post.query.type';
import './CharacterCreation.sass';
import { ArrowBackRounded } from '@mui/icons-material';

export function CharacterCreation() {
  const [form, setForm] = useState<CharacterPostQueryType>({} as CharacterPostQueryType);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalText, setModalText] = useState<string>('');
  const [imageFile, setImageFile] = useState<File>({} as File);
  const [imageURLObject, setImageURLObject] = useState<string>();

  const navigate = useNavigate();

  let multipart = new FormData();

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.name === 'imageFile') {
      if (event.target.files) {
        const file = event.target.files[0];
        setImageFile(file);
        setImageURLObject(URL.createObjectURL(file));
      }
    }
    setForm({ ...form, [`${event.target.name}`]: event.target.value });
  }

  const maxLength = 64;

  function limitLength(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.value.length >= maxLength) {
      event.target.value = event.target.value.slice(0, maxLength - 1);
    }
  }

  function validateForm() {
    if (!imageFile || !form.name || !form.position) {
      console.log(imageFile, form.name, form.position);
      return false;
    }

    return true;
  }

  useEffect(() => {
    if (imageFile) {
      console.log(imageFile);
    }
  }, [imageFile]);

  function sendForm() {
    if (validateForm()) {
      setModalText('Персонаж создаётся...');
      setShowModal(true);

      for (const key of Object.keys(form)) {
        if (key !== 'imageFile') {
          multipart.append(key, form[key as keyof typeof form]);
        }
      }

      multipart.append('imageFile', imageFile);

      postMultipartQuery(`${Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.CHARACTERS}`, multipart).then((response) => {
        if (response.status !== 201) {
          setModalText('Произошла ошибка при создании!');
        }
        if (response.status === 201) {
          setModalText('Персонаж создан!');
          setTimeout(() => {
            navigate(
              `/admin/${Utils.Constants.AVAILABLE_AP_ACTIONS_ENUM.LIST}/${Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.CHARACTERS}`,
            );
          }, 1500);
        }
      });

      multipart = {} as FormData;
    } else {
      setModalText('Не все данные были заполнены!');
      setShowModal(true);
    }
  }

  return (
    <div className="ch-create-container">
      <ArrowBackRounded
        className="lar-icon"
        onClick={() => {
          navigate('/admin/list/characters');
        }}
      />
      <h1>Создание персонажа:</h1>
      <label className="card-creation-label">Картинка персонажа*</label>
      <input className="ch-create-input" type={'file'} name="imageFile" accept="image/*" onChange={handleChange} />
      {imageFile && imageURLObject && <img className="ch-uploaded-img" alt="yeehaw" src={imageURLObject} />}
      <label className="card-creation-label">Имя персонажа*</label>
      <input
        className="ch-create-input"
        name="name"
        onChange={(event) => {
          limitLength(event);
          handleChange(event);
        }}
      />
      <label className="card-creation-label">Должность персонажа*</label>
      <input
        className="ch-create-input"
        name="position"
        onChange={(event) => {
          limitLength(event);
          handleChange(event);
        }}
      />
      <button className="card-creation-submit" onClick={sendForm}>
        Создать
      </button>
      <Modal isShown={showModal} setIsShown={setShowModal}>
        {modalText}
      </Modal>
    </div>
  );
}
