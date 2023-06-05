import { useFrame } from '@react-three/fiber';
import React, { useRef } from 'react'
import { useSpring } from '@react-spring/three';
import { on } from "../utils/events";

const Lights = ({vars}) => {

    const [{lightFactor}, animationApi]  = useSpring(() => (
        { 
            lightFactor: 0
        }))
  
      function introFade() {
        animationApi.start(
          {
            to: {
                lightFactor: 1,
            },
            config: {
                duration: 1000,
            }
          });
      }
  
      on('progression:begin', () => {introFade()})
  
    
    const fireLight1 = useRef()
    const fireLight2 = useRef()
    const fireLight3 = useRef()
    const fireLight4 = useRef()
    const fireLight5 = useRef()
  
    useFrame(() => {
  
      let fire1Power = vars.fireLightBaseIntensity + (Math.sin(vars.time.getElapsedTime() * 2.9 * vars.flickerSpeed) / 6) / 12 + Math.sin(vars.time.getElapsedTime() * 2.9 * vars.flickerSpeed * 0.6 - 0.2) / 12;
      let fire2Power = vars.fireLightBaseIntensity + (Math.sin(vars.time.getElapsedTime() * 3.4 * vars.flickerSpeed) / 3.3) / 12 + Math.sin(vars.time.getElapsedTime() * 3.9 * vars.flickerSpeed * 0.35 - 0.1) / 12;
      let fire3Power = vars.fireLightBaseIntensity + (Math.sin(vars.time.getElapsedTime() * 2.1 * vars.flickerSpeed) / 3.1) / 12 + Math.sin(vars.time.getElapsedTime() * 2.2 * vars.flickerSpeed * 0.5 - 0.1) / 12;
      let fire4Power = vars.fireLightBaseIntensity + (Math.sin(vars.time.getElapsedTime() * 2.6 * vars.flickerSpeed) / 3.56) / 12 + Math.sin(vars.time.getElapsedTime() * 1.5 * vars.flickerSpeed * 0.4 - 0.1) / 12;
      let fire5Power = vars.fireLightBaseIntensity + (Math.sin(vars.time.getElapsedTime() * 1.3 * vars.flickerSpeed) / 18.1) / 12 + Math.sin(vars.time.getElapsedTime() * 2.3 * vars.flickerSpeed * 0.35 - 0.1) / 12;
  
      fireLight1.current.intensity = fire1Power * lightFactor.get();
      fireLight2.current.intensity = fire2Power * lightFactor.get();
      fireLight3.current.intensity = fire3Power * lightFactor.get();
      fireLight4.current.intensity = fire4Power * lightFactor.get();
      fireLight5.current.intensity = fire5Power * lightFactor.get();
  
    })

    return (
        <group>
            <ambientLight intensity={0.01} />
            <pointLight ref={fireLight1} position={[-1, -1, 4]} distance={18} angle={1} />
            <pointLight ref={fireLight2} position={[1, -0.8, 3]} distance={18} angle={1} />
            <pointLight ref={fireLight3} position={[0.7, -0.5, 6]} distance={12} angle={1} />
            <pointLight ref={fireLight4} position={[4, -0.3, 7]} distance={15} angle={1} />
            <pointLight ref={fireLight5} position={[-4, -0.3, 7]} distance={15} angle={1} />
        </group>
    )
}
    
export default Lights
