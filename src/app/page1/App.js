'use client';

import React, { useState } from 'react';
import '../maelie.css';

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
        <div className="container">
            <div className="form-group">
                <label htmlFor="name">Name:</label><br/>
                <input type="text" name="name" onChange={handleNameChange} value={name}/>
            </div>
            <div className="form-group">
                <label htmlFor="room_name">Room:</label>
                <select name="room" onChange={handleRoomChange} value={room}>
                    <option value="RoomA">RoomA</option>
                    <option value="RoomB">RoomB</option>
                    <option value="RoomC">RoomC</option>
                </select>                
            </div>
            <div className="form-group">
                <label htmlFor="date">Date:</label>
                <input type="date" name="date" onChange={handleDateChange} value={date}/>
            </div>
            <div className="form-group">
                <label htmlFor="description">Description:</label>
                <textarea rows="8" cols="40" onChange={handleDescriptionChange} value={description}/>
            </div>
            <div className="form-group">
                <button> Submit </button>
            </div>
        </div>
    );
}

export default App;