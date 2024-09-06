'use client';

import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../maelie.css';


function App() {
    // Definition of state variables
    const [ id, setId ]                     = useState( '' );
    const [ name, setName ]                 = useState( '' );
    const [ room, setRoom ]                 = useState( '' );
    const [ date, setDate ]                 = useState( '' );
    const [ description, setDescription ]   = useState( '' );

    // Handler functions for input forms
    const handleIdChange            = e => { setId( e.target.value ); }
    const handleNameChange          = e => { setName( e.target.value ); }
    const handleRoomChange          = e => { setRoom( e.target.value ); }
    const handleDateChange          = e => { setDate( e.target.value ); }
    const handleDescriptionChange   = e => { setDescription( e.target.value ); }
    
    // Render
    return (
        <div className="container">
            <div className="form-group">
                <label htmlFor="id">Id:</label>
                <input type="text" className="form-control" id="id" disabled value={id}/>
            </div>
            <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input type="text" className="form-control" id="name" onChange={handleNameChange} value={name}/>
            </div>
            <div className="form-group">
                <label htmlFor="room">Room:</label>
                <select className="form-control" id="room" onChange={handleRoomChange} value={room}>
                    <option value="RoomA">RoomA</option>
                    <option value="RoomB">RoomB</option>
                    <option value="RoomC">RoomC</option>
                </select>                
            </div>
            <div className="form-group">
                <label htmlFor="date">Date:</label>
                <input type="date" className="form-control" id="date" onChange={handleDateChange} value={date}/>
            </div>
            <div className="form-group">
                <label htmlFor="description">Description:</label>
                <textarea id="description" rows="8" cols="40" onChange={handleDescriptionChange} value={description}/>
            </div>
            <div className="btn-group">
                <button className="btn btn-success"> Save </button>
            </div>
        </div>
    );
}

export default App;
