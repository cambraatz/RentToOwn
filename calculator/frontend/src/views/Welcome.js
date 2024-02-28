import React from 'react';
import NavBar from '../components/NavBar';
import Introduction from '../components/Introduction';

function Welcome() {
    return (
        <div id='welcome_view'>
            <NavBar />
            <Introduction />
        </div>
    )
}

export default Welcome;