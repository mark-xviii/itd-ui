import { observer } from 'mobx-react';
import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../stores/auth.store';
import './LoginAndRegister.sass';
import { LoginAndRegisterInterface } from './LoginAndRegister.interface';
import { useNavigate } from 'react-router';
import { ArrowBack, ArrowBackRounded } from '@mui/icons-material';
import { LoginType, RegisterType } from './LoginAndRegister.types';
import { postQuery } from '../../api/queries/post.query';
import { Utils } from '../../utils';

export const LoginAndRegister = observer(({ mode }: LoginAndRegisterInterface) => {
  const AuthSingleton = useContext(AuthContext);

  const [loginForm, setLoginForm] = useState<LoginType>({} as RegisterType);

  const [registerForm, setRegisterForm] = useState<RegisterType>({} as RegisterType);

  const [message, setMessage] = useState<string[]>([]);

  const [isValid, setIsValid] = useState<boolean>(false);

  const navigate = useNavigate();

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (mode === 'login') {
      setLoginForm({ ...loginForm, [event.target.name]: event.target.value });
    }

    if (mode === 'register') {
      setRegisterForm({ ...registerForm, [event.target.name]: event.target.value });
    }
  }

  function validate() {
    if (mode === 'login') {
      if (!loginForm.login || loginForm.login.length < 3) {
        setMessage([...message, 'error.']);
        return false;
      }

      if (!loginForm.password || loginForm.password.length < 3) {
        setMessage([...message, 'error.']);
        return false;
      }

      return true;
    }

    if (mode === 'register') {
      if (!registerForm.login || registerForm.login.length < 3) {
        return false;
      }

      if (!registerForm.organizationTitle || registerForm.organizationTitle.length < 3) {
        return false;
      }

      if (!registerForm.password || registerForm.password.length < 3) {
        return false;
      }

      return true;
    }

    return true;
  }

  function submit() {
    if (mode === 'login') {
      AuthSingleton.signIn(loginForm.login, loginForm.password).then((result) => {
        if (result) {
          navigate('/game');
        } else {
          alert('ошибка входа');
          navigate('/');
        }
      });
    }

    if (mode === 'register') {
      postQuery(Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.REGISTER, registerForm).then(async (response) => {
        if (response.status !== 201) {
          alert(((await response.json()) as unknown as any).message);
        }

        if (response.status === 201) {
          AuthSingleton.signIn(registerForm.login, registerForm.password).then((result) => {
            if (result) {
              navigate('/game');
            } else {
              navigate('/');
            }
          });
        }
      });
    }
  }

  useEffect(() => {
    setIsValid(validate());
  }, [loginForm, registerForm, setRegisterForm, setLoginForm]);

  return (
    <div className="lar-container">
      <div className="lar-top">
        <h1 className="lar-heading">
          {mode === 'login' && 'Вход'}
          {mode === 'register' && 'Регистрация'}
        </h1>
        <ArrowBackRounded
          className="lar-icon"
          onClick={() => {
            navigate('/');
          }}
        />
      </div>
      {mode === 'login' && (
        <>
          <label className="lar-label">Логин *</label>
          <input className="lar-input" name="login" onChange={handleChange} />
          <label className="lar-label">Пароль *</label>
          <input className="lar-input" name="password" type={'password'} onChange={handleChange} />
        </>
      )}
      {mode === 'register' && (
        <>
          <label className="lar-label">Логин *</label>
          <input className="lar-input" name="login" onChange={handleChange} />
          <label className="lar-label">Имя организации *</label>
          <input className="lar-input" name="organizationTitle" onChange={handleChange} />
          <label className="lar-label">Пароль *</label>
          <input className="lar-input" type={'password'} name="password" onChange={handleChange} />
        </>
      )}
      <p></p>
      <button disabled={!isValid} onClick={submit} className="lar-button">
        {mode === 'login' && 'Войти'}
        {mode === 'register' && 'Зарегистрироваться'}
      </button>
      <div
        className="lar-switch-auth-link"
        onClick={() => {
          setLoginForm({} as LoginType);
          setRegisterForm({} as RegisterType);

          if (mode === 'register') {
            navigate('/login');
          }

          if (mode === 'login') {
            navigate('/register');
          }
        }}
      >
        {mode === 'register' ? 'Уже есть учётная запись? Войти?' : 'Ещё нет учётной записи? Зарегистрироваться?'}
      </div>
    </div>
  );
});
