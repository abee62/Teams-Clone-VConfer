import React from "react";
import { v1 as uuid } from "uuid";
import './CreateRoom.css';
import Button from "@material-ui/core/Button"

const CreateRoom = (props) => {
    function create() {
        const id = uuid();
        props.history.push(`/room/${id}`);
    }

    return (
        <div>
            <h1>VConfer : TO CALL AND CHAT</h1>
        <Button variant="contained" color="secondary" onClick={create}>Create Room</Button>
        </div>
    );
}

export default CreateRoom;