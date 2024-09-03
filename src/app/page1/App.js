'use client';

import React, { useState } from 'react';

function App() {
    const [ name, setName ]                 = useState( '' );
    const [ room, setRoom ]                 = useState( '' );
    const [ date, setDate ]                 = useState( '' );
    const [ description, setDescription ]   = useState( '' );

    const handleNameChange = ( e ) => {
        setName( e.target.value );
    }

    const handleRoomChange = ( e ) => {
        setRoom( e.target.value );
    }

    const handleDateChange = ( e ) => {
        setDate( e.target.value );
    }

    const handleDescriptionChange = ( e ) => {
        setDescription( e.target.value );
    }
      
    return (
        <>
            <div>
                Name: <input type="text" name="name" onChange={handleNameChange} value={name}/>
            </div>
            <div>
                Room: <select name="room" onChange={handleRoomChange} value={room}>
                        <option value="RoomA">RoomA</option>
                        <option value="RoomB">RoomB</option>
                        <option value="RoomC">RoomC</option>
                    </select>                
            </div>
            <div>
                Date: <input type="date" name="date" onChange={handleDateChange} value={date}/>
            </div>
            <div>
                Description: <br/>
                <textarea rows="8" cols="40" onChange={handleDescriptionChange} value={description}/>
            </div>
            <div>
                <button> Submit </button>
            </div>
        </>
    );
}

export default App;