import Modal from '../../Modal/Modal';
import { postMultipartQuery } from '../../../api/queries/post.multipart';
import { Utils } from '../../../utils';
import { useNavigate, useParams } from 'react-router';
import { useState, ChangeEvent, useEffect } from 'react';
import { CharacterPostQueryType } from '../Creation/character-post.query.type';
import { CharactersType } from '../../../types/characters.type';
import { getQuery } from '../../../api/queries/get.query';
import { ArrowBackRounded } from '@mui/icons-material';

export function CharacterEdit() {
  const { id: currentCharacterId } = useParams() as { id: string; entity: string; action: string };

  const [form, setForm] = useState<CharacterPostQueryType>({} as CharacterPostQueryType);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalText, setModalText] = useState<string>('');
  const [imageFile, setImageFile] = useState<File>({} as File);
  const [imageURLObject, setImageURLObject] = useState<string>();
  const [currentCharacter, setCurrentChacater] = useState<CharactersType>();

  useEffect(() => {
    getQuery(`${Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.CHARACTERS}/${currentCharacterId}`).then((result) => {
      setCurrentChacater(result);
    });
  }, []);

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
    setModalText('Персонаж изменяется...');
    setShowModal(true);

    for (const key of Object.keys(form)) {
      if (key !== 'imageFile') {
        multipart.append(key, form[key as keyof typeof form]);
      }
    }

    multipart.append('imageFile', imageFile);

    postMultipartQuery(
      `${Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.CHARACTERS}/${currentCharacter?.id}`,
      multipart,
      true,
    ).then((response) => {
      if (response.status !== 200) {
        setModalText('Произошла ошибка при создании!');
      }
      if (response.status === 200) {
        setModalText('Персонаж изменён!');
        setTimeout(() => {
          navigate(
            `/admin/${Utils.Constants.AVAILABLE_AP_ACTIONS_ENUM.LIST}/${Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.CHARACTERS}`,
          );
        }, 1500);
      }
    });

    multipart = {} as FormData;
  }

  return (
    <div className="ch-create-container">
      <ArrowBackRounded
        className="lar-icon"
        onClick={() => {
          navigate('/admin/list/characters');
        }}
      />
      <h1>Изменение персонажа:</h1>
      <label className="card-creation-label">Cтарая картинка персонажа*</label>
      {currentCharacter?.imageLink && <img className="ch-uploaded-img" alt="yeehaw" src={currentCharacter.imageLink} />}
      <label className="card-creation-label">Новая картинка персонажа*</label>
      <input className="ch-create-input" type={'file'} name="imageFile" accept="image/*" onChange={handleChange} />
      {imageFile && imageURLObject && <img className="ch-uploaded-img" alt="yeehaw" src={imageURLObject} />}
      <label className="card-creation-label">Имя персонажа*</label>
      <input
        defaultValue={currentCharacter?.name}
        className="ch-create-input"
        name="name"
        onChange={(event) => {
          limitLength(event);
          handleChange(event);
        }}
      />
      <label className="card-creation-label">Должность персонажа*</label>
      <input
        defaultValue={currentCharacter?.position}
        className="ch-create-input"
        name="position"
        onChange={(event) => {
          limitLength(event);
          handleChange(event);
        }}
      />
      <button className="card-creation-submit" onClick={sendForm}>
        Изменить персонажа
      </button>
      <Modal isShown={showModal} setIsShown={setShowModal}>
        {modalText}
      </Modal>
    </div>
  );
}
