import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { EMAIL } from '../../constants/patterns';
import Button from '../Button/Button';
import classes from '../AuthModal/AuthModal.module.css';

export default function LoginModal({ onClose, onSwitchToRegister }) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const { user, login } = useAuth();

  useEffect(() => {
    if (user) {
      onClose();
    }
  }, [user, onClose]);

  const submit = async ({ email, password }) => {
    await login(email, password);
  };

  // Eye icon toggle for password field
  useEffect(() => {
    const setupToggle = (inputId, iconId) => {
      const input = document.getElementById(inputId);
      const icon = document.getElementById(iconId);
      if (!input || !icon) return;

      const toggle = () => {
        if (input.type === 'password') {
          input.type = 'text';
          icon.classList.remove('fa-eye');
          icon.classList.add('fa-eye-slash');
        } else {
          input.type = 'password';
          icon.classList.remove('fa-eye-slash');
          icon.classList.add('fa-eye');
        }
      };

      icon.addEventListener('click', toggle);
      return () => icon.removeEventListener('click', toggle);
    };

    const cleanup = setupToggle('password', 'eye-icon');
    return () => cleanup?.();
  }, []);

  return (
    <div className={classes.modalBackdrop} onClick={onClose}>
      <div className={classes.modalContent} onClick={e => e.stopPropagation()}>
        <div className={classes.modalHeader}>
          <h2>Login</h2>
          <button className={classes.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit(submit)} className={classes.form} noValidate>
          <div className={classes.field}>
            <label>Email</label>
            <input
              type="email"
              {...register('email', {
                required: true,
                pattern: EMAIL,
              })}
              className={classes.input}
            />
            {errors.email && <p className={classes.error}>Enter a valid email</p>}
          </div>

          <div className={classes.field}>
            <label>Password</label>
            <div className={classes.passwordContainer}>
              <input
                type="password"
                id="password"
                {...register('password', {
                  required: true,
                })}
                className={classes.input}
              />
              <i className="fa fa-eye" id="eye-icon"></i>
            </div>
            {errors.password && <p className={classes.error}>Password is required</p>}
          </div>

          <Button type="submit" text="Login" />

          <div className={classes.switch}>
            New user?&nbsp;
            <button 
              type="button" 
              className={classes.switchButton}
              onClick={onSwitchToRegister}
            >
              Register here
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}