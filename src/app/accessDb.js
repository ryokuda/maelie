
import supabase from './supabaseClient';

async function selectAll() {
    const { data, error } = await supabase
            .from( 'record_book' )
            .select( '*' );
    if( error ) {
        return {
            record: null,
            error:  error,
        };
    } else if( data.length < 1 ) {
        const err = new Error( 'Record does not exist' );
        return {
            record: null,
            error: err,
        };
    } else {
        return {
            record: data,
            error: null,
        };
    }
}

async function selectOne( id ) {
    const { data, error } = await supabase
            .from( 'record_book' )
            .select( '*' )
            .eq( 'id', id );
    if( error ) {
        return {
            record: null,
            error:  error,
        };
    } else if( data.length < 1 ) {
        const err = new Error( 'Record does not exist' );
        return {
            record: null,
            error: err,
        };
    } else {
        return {
            record: data[0],
            error: null,
        };
    }
}

async function updateOne( id, record ) {
    const { data, error } = await supabase
            .from( 'record_book' )
            .update( record )
            .eq( 'id', id );
    if( error ) {
        return {
            error: error
        };
    } else {
        return {
            error: null
        };
    }
}

async function insertOne( record ) {
    const { data, error } = await supabase
            .from( 'record_book' )
            .insert( [record] );
    if( error ) {
        return {
            record: null,
            error: error
        };
    } else {
        return {
            record: data,
            error: null
        };
    }
}

export {
    selectAll,
    selectOne,
    updateOne,
    insertOne,
}