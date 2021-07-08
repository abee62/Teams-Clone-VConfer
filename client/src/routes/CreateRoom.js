import React from "react";
import { v1 as uuid } from "uuid";
import './CreateRoom.css';
import Button from "@material-ui/core/Button"
import ParticleBackground from "./ParticleBackground";
const CreateRoom = (props) => {
    function create() {
        const id = uuid();
        props.history.push(`/room/${id}`);
    }

    return (
    <div>
        
      <div className="home">
        <ParticleBackground />
            <div className ="heading">
                <h1 >VCONFER : To Call and Chat</h1>
            <div className="button">    
                <Button variant="contained" 
                    color="secondary" 
                    onClick={create}>
                    Create Room
                </Button>
            </div>
            </div>
        <h2>Create a room and share the link to connect!</h2>
        <h6>-by Abhirami R</h6>
      </div>
    </div>
            
    );
}

export default CreateRoom;