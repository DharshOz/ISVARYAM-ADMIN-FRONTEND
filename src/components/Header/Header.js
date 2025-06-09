import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import LoginModal from '../LoginModal/LoginModal';
import RegisterModal from '../RegisterModal/RegisterModal';
import classes from './header.module.css';

export default function Header() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const navRef = useRef(null);

  const toggleMenu = () => setMenuOpen(prev => !prev);

  // Auto-close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSwitchToRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  return (
    <header className={classes.header}>
      <div className={classes.container}>
        <Link to="/" className={classes.logo}>
          Isvaryam
        </Link>

        <button className={classes.hamburger} onClick={toggleMenu}>
          ☰
        </button>

        <nav
          ref={navRef}
          className={`${classes.nav} ${menuOpen ? classes.open : ''}`}
        >
          <ul className={classes.nav_links}>
            {user && (
              <>
                <li>
                  <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
                </li>
                <li>
                  <Link to="/orders" onClick={() => setMenuOpen(false)}>Orders</Link>
                </li>
                <li>
                  <Link to="/profile" onClick={() => setMenuOpen(false)}>{user.name}</Link>
                </li>
                 <li>
                  <Link to="/cart" onClick={() => setMenuOpen(false)}>Cart</Link>
                </li>

                {user.isAdmin && (
                  <>
                    <li>
                      <Link to="/admin/users" onClick={() => setMenuOpen(false)}>Users</Link>
                    </li>
                    <li>
                      <Link to="/admin/foods" onClick={() => setMenuOpen(false)}>Foods</Link>
                    </li>
                  </>
                )}

               
              </>
            )}

            {!user && (
              <>
                <li>
                  <button 
                    className={classes.authButton}
                    onClick={() => {
                      setShowLoginModal(true);
                      setMenuOpen(false);
                    }}
                  >
                    Login
                  </button>
                </li>
                
              </>
            )}

          </ul>
        </nav>

        {/* Login Modal */}
        {showLoginModal && (
          <LoginModal 
            onClose={() => setShowLoginModal(false)} 
            onSwitchToRegister={handleSwitchToRegister}
          />
        )}

        {/* Register Modal */}
        {showRegisterModal && (
          <RegisterModal 
            onClose={() => setShowRegisterModal(false)} 
            onSwitchToLogin={handleSwitchToLogin}
          />
        )}
      </div>
    </header>
  );
}