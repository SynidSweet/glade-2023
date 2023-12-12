import Card from './card';
import React, { Suspense } from 'react'
import TreePlane from './tree';
import CameraAnimation from './camera';
import { Clock } from 'three';
import Lights from './lights';
import AudioPlayer from './audioplayer';
import { useThree } from '@react-three/fiber';

const vars = {
    floatFactor: 1.0,
    flickerSpeed: 5,
    fireLightBaseIntensity: 0.2,
    time: new Clock(),
}

const stemPlayer = {

}

const Scene = () => {

    const trees = [0, 1, 2, 3];
    const { gl } = useThree();

    gl.antialias = false;

  return (
    <group>
        <Lights vars={vars}/>
        <Card stemPlayer={stemPlayer} vars={vars}/>

        {trees.map((index) => {
            return <TreePlane key={index} index={index}/>
        })}

        <CameraAnimation vars={vars}/>
        <AudioPlayer stemPlayer={stemPlayer}/>

        {/* <Suspense>
            <EffectComposer>
                <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.02} height={300}/>
            </EffectComposer>
        </Suspense> */}
    </group>
  )
}

export default Scene