'use client';

import React, { useState } from 'react';

function App() {
    // Definition of state variables
    const [ name, setName ]                 = useState( '' );

    // Handler functions for input forms
    const handleNameChange          = e => { setName( e.target.value ); }
    
    // Render
    return (
        <div>
            <div>
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" onChange={handleNameChange} value={name}/>
            </div>
        </div>
    );
}

export default App;
