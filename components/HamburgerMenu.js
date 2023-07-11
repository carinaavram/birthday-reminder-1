'use client';
import { useEffect, useState } from 'react';
import { useRef } from 'react';

import classes from './HamburgerMenu.module.css';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import {usePathname } from 'next/navigation';

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef();
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', checkIfClickedOutside);

    return () => {
      document.removeEventListener('click', checkIfClickedOutside);
    };
  }, []);

  const handleMenuClick = () => {
    setIsOpen(false);
  };

  return (
    <div
      className={`${classes.menuContainer} ${isOpen ? classes.open : ''}`}
      ref={menuRef}
    >
      <div
        className={`${classes.hamburgerIcon} ${isOpen ? classes.active : ''}`}
        onClick={toggleMenu}
      >
        <span className={classes.bar}></span>
        <span className={classes.bar}></span>
        <span className={classes.bar}></span>
      </div>
      <ul className={classes.menuItems} onClick={handleMenuClick}>
        {isOpen? <><li className={`${classes.item} ${pathname === '/' ? classes.active : ''}`}>
          <Link href="/" className={classes.linkItem}>
            Home
          </Link>
        </li>
        <li className={`${classes.item} ${pathname === '/birthdays' ? classes.active : ''}`}>
          <Link href="/birthdays" className={classes.linkItem}>
            View Birthdays
          </Link>
        </li>
        <li className={`${classes.item} ${pathname === '/birthdays/add-birthday' ? classes.active : ''}`}>
          <Link href="/birthdays/add-birthday" className={classes.linkItem}>
            Add Birthdays
          </Link>
        </li>
        <li className={`${classes.item} ${pathname === '/birthdays/set-notifications' ? classes.active : ''}`}>
          <Link href="/birthdays/set-notifications" className={classes.linkItem}>
            Set Notifications
          </Link>
        </li>
        <li className={classes.item}>
          <button onClick={() => signOut()} className={classes.buttonItem}>
            Sign Out
          </button>
        </li></> : ''}
        
      </ul>
    </div>
  );
};

export default HamburgerMenu;
