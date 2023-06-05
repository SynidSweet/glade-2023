import { PerspectiveCamera } from "@react-three/drei";
import { useSpring } from '@react-spring/three';
import { useFrame } from '@react-three/fiber';
import { useRef } from "react";
import { on } from "../utils/events";

const CameraAnimation = (props) => {

    const cameraRef = useRef()

    const vars = props.vars;

    const [{offsetZ}, animationApi]  = useSpring(() => (
      { 
        offsetZ: 35
      }))

    function introZoom() {
      animationApi.start(
        {
          to: {
            offsetZ: 0,
          },
          config: {
            mass:1,
            tension: 280,
            friction: 520,
            precision: 0.001
          }
        });
    }

    on('progression:begin', () => {introZoom()})

    useFrame(() => {

        let x = Math.sin(vars.time.getElapsedTime() * 0.7 - 0.2) / 4 + Math.sin(vars.time.getElapsedTime() * 0.6 - 0.2) / 4;
        let y = Math.sin(vars.time.getElapsedTime() * 0.25) / 20;
        let z = 0 + offsetZ.get() + Math.sin(vars.time.getElapsedTime() * 0.7 - 0.2) / 3;
    
        cameraRef.current.position.set(x * vars.floatFactor / 2, y * vars.floatFactor / 2, 10 + z * vars.floatFactor / 2);
        cameraRef.current.lookAt(0, 0, 0);
     
    })
  
  return (
        <PerspectiveCamera ref={cameraRef} makeDefault fov={50} position={[0, 0, 10]} rotation={[0, 0, 0]}/> 
    )
  }

export default CameraAnimation;