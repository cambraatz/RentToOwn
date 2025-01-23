import { React,useState } from 'react';
import { useNavigate } from 'react-router-dom';

import MenuLogo from '../assets/menu_logo.svg';

const Header = () => {
    const navigate = useNavigate();

    const handleHomeClick = (e) => {
        console.log("functionality in progress");
    }

    const handleClick = (e) => {
        console.log("functionality in progress");
    }

    return (
        <header>
            {/* 
            <div id="menu_popup" className={styles.popup} onClick={handleMenuClick}>
                <div id="comp_sci" className={styles.menuItem}>
                    <p>temp</p>
                </div>
            </div> 
            */}
            <div className="header">
                <div id="click_header" className="container">
                    <h3 onClick={handleHomeClick}>rent to own calculator</h3>
                    <img 
                        src={MenuLogo}
                        alt=""
                        id="menu_icon"
                        className="icon"           
                        loading="lazy"
                        onClick={handleClick}
                    />
                </div>
            </div>
        </header>
    );
};

export default Header;