import React from "react";
//import Particles from "react-particles-js";
import ParticleConfig from "./particle-config";
import Particles from "react-particles-js"
export default function ParticleBackground(){
    return(
        <Particles>params={ParticleConfig}</Particles>
    );
}