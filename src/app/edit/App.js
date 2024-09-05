'use client';

import React, { useState, useEffect } from 'react';
import { selectAll, selectOne, updateOne, insertOne } from '../accessDb';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../maelie.css';


function App() {
    // Definition of state variables
    const [ state, setState ]               = useState( 'load' ); // 'load' => 'loading' => 'editing' => 'load'
    const [ id, setId ]                     = useState( '' );
    const [ name, setName ]                 = useState( '' );
    const [ room, setRoom ]                 = useState( '' );
    const [ date, setDate ]                 = useState( '' );
    const [ description, setDescription ]   = useState( '' );
    const [ errorMes, setErrorMes ]         = useState( '' );

    // Register service worker for off-line operation
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            console.log( 'serviceWorker found' );
            navigator.serviceWorker.register('/sw.js').then(
                (registration) => {
                    console.log('Service Worker registered with scope: ', registration.scope);
                },
                (error) => {
                    console.error('Service Worker registration failed: ', error);
                }
            );
        }
    }, []);

    // Restore status variables at the first rendering
    useEffect(() => {
        loadStatus( 'id',           setId );
        loadStatus( 'state',        setState );
        loadStatus( 'name',         setName );
        loadStatus( 'room',         setRoom );
        loadStatus( 'date',         setDate );
        loadStatus( 'description',  setDescription );
    }, [] );
    
    // Save and load status variables to and from LocalStrage
    const saveStatus = ( key, value ) => {
        localStorage.setItem( key, JSON.stringify(value));
    };

    const loadStatus = ( key, setFn ) => {
        const valueJSON = localStorage.getItem( key );
        try {
            if( valueJSON ) {
                const value = JSON.parse( valueJSON );
                setFn( value );
            }
        } catch( err ) {
            console.log( err.message );
        }
    }

    // Handler functions for input forms
    const handleIdChange            = e => { setId( e.target.value );           saveStatus( 'id', e.target.value ); }
    const handleNameChange          = e => { setName( e.target.value );         saveStatus( 'name', e.target.value ); }
    const handleRoomChange          = e => { setRoom( e.target.value );         saveStatus( 'room', e.target.value ); }
    const handleDateChange          = e => { setDate( e.target.value );         saveStatus( 'date', e.target.value ); }
    const handleDescriptionChange   = e => { setDescription( e.target.value );  saveStatus( 'description', e.target.value ); }
    
    // Handle error messag
    const showErrorMes = ( message ) => {
        setErrorMes( message );
        setTimeout( () => setErrorMes(''), 3000 ); // message will be deleted after 3 seconds.
    }

    // Handle Load button clicked
    const load = async () => {
        setState( 'loading' ); saveStatus( 'state', 'loading' );
        const { record, error } = await selectOne( id );
        if( error ) {
            console.log( error.message );
            showErrorMes( error.message );
            setState( 'load' );                     saveStatus( 'state', 'load' );
        } else {
            setName( record.name );                 saveStatus( 'name',         record.name );
            setRoom( record.room );                 saveStatus( 'room',         record.room );
            setDate( record.date );                 saveStatus( 'date',         record.date );
            setDescription( record.description );   saveStatus( 'description',  record.description );
            setState( 'editing' );                  saveStatus( 'state',        'editing' );
        }
    }

    // Handle Save button clicked
    const save = async () => {
        const data = { id, name, room, date, description };
        console.log( data );
        const { record, error } = await updateOne( id, data );
        if( error ) {
            console.log( error.message );
            showErrorMes( error.message );
        }
    }

    // Handle DOne button clicked
    const done = () => {
        setState( 'load' );  saveStatus( 'state', 'load' ); // return to initial state
    }

    // Render
    if( state === 'load' ) {
        return (
            <div className="container">
                <div className="form-group">
                    <label htmlFor="id">Id:</label>
                    <input type="text" className="form-control" id="id" onChange={handleIdChange} value={id}/>
                </div>
                <div>
                    <button className="btn btn-primary" onClick={load}> Load </button>
                </div>
                <div className="text-warning">{errorMes}</div>
            </div>
        );
    } else if (state === 'loading' ) {
        return (
            <div className="container">
                <div className="text-primary"> Loading from server... </div>
            </div>
        );
    } else {    
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
                    { navigator.onLine ?
                        <button className="btn btn-success" onClick={save}> Save </button>
                        :
                        <button className="btn btn-success" disabled> Save </button>
                    }
                    <button className="btn btn-primary" onClick={done}> Done </button>
                </div>
                <div className="text-warning">{errorMes}</div>
            </div>
        );
    }
}

export default App;
