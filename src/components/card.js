import React, { useEffect, useRef } from 'react'
import { PresentationControls, useGLTF } from '@react-three/drei'
import { Clock, MeshStandardMaterial, TextureLoader, RepeatWrapping, SRGBColorSpace, Color } from 'three'
import { useFrame } from '@react-three/fiber';
import { useSpring } from '@react-spring/three';
import BurnMaterial from '../materials/BurnMaterial2';
import { on, trigger } from "../utils/events";

const time = new Clock();
const floatFactor = 0.5;

const frontTextureHorned = new TextureLoader().load( "./card/cardfrontHorned.jpg" );
frontTextureHorned.flipY = false;
frontTextureHorned.colorSpace = SRGBColorSpace;

const frontTextureAsh = new TextureLoader().load( "./card/cardfrontAsh.jpg" );
frontTextureAsh.flipY = false;
frontTextureAsh.colorSpace = SRGBColorSpace;

const frontTextureJourney = new TextureLoader().load( "./card/cardfrontJourney.jpg" );
frontTextureJourney.flipY = false;
frontTextureJourney.colorSpace = SRGBColorSpace;

const frontTextureCult = new TextureLoader().load( "./card/cardfrontCult.jpg" );
frontTextureCult.flipY = false;
frontTextureCult.colorSpace = SRGBColorSpace;

const frontTextureMother = new TextureLoader().load( "./card/cardfrontMother.jpg" );
frontTextureMother.flipY = false;
frontTextureMother.colorSpace = SRGBColorSpace;

const frontTextureInstigator = new TextureLoader().load( "./card/cardfrontInstigator.jpg" );
frontTextureInstigator.flipY = false;
frontTextureInstigator.colorSpace = SRGBColorSpace;

const frontTextureSacrifice = new TextureLoader().load( "./card/cardfrontSacrifice.jpg" );
frontTextureSacrifice.flipY = false;
frontTextureSacrifice.colorSpace = SRGBColorSpace;

const frontTextures = [frontTextureHorned, frontTextureAsh, frontTextureJourney, frontTextureCult, frontTextureMother, frontTextureInstigator, frontTextureSacrifice];


const backTexture1 = new TextureLoader().load( "./card/cardback1.jpg" );
backTexture1.flipY = false;
backTexture1.colorSpace = SRGBColorSpace;

const backTexture2 = new TextureLoader().load( "./card/cardback2.jpg" );
backTexture2.flipY = false;
backTexture2.colorSpace = SRGBColorSpace;

const backTextureBlank = new TextureLoader().load( "./card/gladecardframe.png" );
backTextureBlank.flipY = false;
backTextureBlank.colorSpace = SRGBColorSpace;

const backTextureJourney = new TextureLoader().load( "./card/card_back_journey.jpg" );
backTextureJourney.flipY = false;
backTextureJourney.colorSpace = SRGBColorSpace;


const backTexture1cryptic = new TextureLoader().load( "./card/cardback1cryptic.jpg" );
backTexture1cryptic.flipY = false;
backTexture1cryptic.colorSpace = SRGBColorSpace;

const noiseTexture = new TextureLoader().load( "./card/noise.jpg" );
noiseTexture.wrapS = noiseTexture.wrapT = RepeatWrapping;
noiseTexture.colorSpace = SRGBColorSpace;

const frontShader = { reference: null }
const burnMaterial = BurnMaterial(frontShader, noiseTexture);
burnMaterial.map = frontTextureJourney;

const backShader = { reference: null }
const burnBackMaterial = BurnMaterial(backShader, noiseTexture);
burnBackMaterial.map = backTexture1cryptic;

const readyTexture = new TextureLoader().load( "./card/ready-button.jpg" );
readyTexture.colorSpace = SRGBColorSpace;

const readyMaterial = new MeshStandardMaterial({
    map: readyTexture,
    transparent: true,
    opacity: 0,
    depthTest: false,   
    depthWrite: false,
    renderOrder: 1,
});


let started = false;

function ChangeFrontTexture(texture) {
    burnMaterial.map = texture;
}

function ChangeBackTexture(texture) {
    burnBackMaterial.map = texture;
}


const cardAlignment = {
    presentationGroup: null,
    alignment: "front"
}

let progressionIndex = 0;
let frontIndex = 2; // Start with Journey

let stemsToSpin = false;
let readyClickable = false;
let animatingSegments = false;

export default function Model({ stemPlayer, vars }) {

    const group = useRef()
    const readyButton = useRef()
    const { nodes } = useGLTF('./card/card.gltf')

    const [{burnAnimation}, animationApi]  = useSpring(() => ({ burnAnimation: 0 }))
    const [{stemsVolumeFactor}, stemsVolumeApi]  = useSpring(() => ({ stemsVolumeFactor: 0 }))
    const [{segmentsOffset}, segmentsOffsetApi]  = useSpring(() => (
        { segmentsOffset: 0,
            config: { mass: 7,
                friction: 40,
                tension: 40, 
                precision: 0.0001,
                velocity: 0.001,
            },
         }
    ))

    function toggleBurn(hide) {
        if (hide) {
            animationApi.start(
                {
                    to: { burnAnimation: 0, },
                    config: { duration: 1000 },
                });            
        }
        else {
            animationApi.start(
                {
                    to: { burnAnimation: 1, },
                    config: { duration: 1000 },
                });
        }
    } 

    function gotoSegment(segment) {
        if (!animatingSegments) return;

        segmentsOffsetApi.start(
            {
                to: { segmentsOffset: segment / 7 },
            });  
        }

    useEffect(() => {

        const progression = [
            {
                name: "Reveal Card",
                trigger: "progression:begin",
                action: () => {
                    setTimeout(()=>{
                        toggleBurn(false);
                    }, 2500);
                    setTimeout(()=>{
                        trigger("audio:cardburn")
                    }, 2700);
                    started = true;
                }
            },
            {
                name: "Found cryptic backside",
                trigger: "card:back",
                action: () => {
                    // Frontside is already randomly changed
                }
            },
            {
                name: "Found new frontside",
                trigger: "card:front",
                action: () => {
                    trigger("audio:cardflip")
                    ChangeBackTexture(backTexture1);
                }
            },
            {
                name: "Found regular backside 1",
                trigger: "card:back",
                action: () => {
                    // Frontside is already randomly changed
                    stemsVolumeApi.start(
                        {
                            to: { stemsVolumeFactor: 1 },
                            config: { duration: 2000 },
                        });  
                    stemsToSpin = true;
                }
            },
            {
                name: "Found second new frontside",
                trigger: "card:front",
                action: () => {
                    ChangeBackTexture(backTexture2);
                }
            },
            {
                name: "Found third new frontside",
                trigger: "card:front",
                action: () => {
                    readyClickable = true;
                    ChangeBackTexture(backTextureJourney);
                    readyMaterial.opacity = 1;
                    backShader.reference.uniforms.u_segments.value = 7;
                    backShader.reference.uniforms.t_second.value = backTextureBlank;
                }
            },
            {
                name: "Open final menu panel",
                trigger: "star:click",
                action: () => {
                    readyClickable = false;
                    animatingSegments = true;
                    gotoSegment(1); 
                    const nav = document.querySelector('#navigation');
                    nav.style.display = "flex";
                    nav.style.opacity = "1";
                }
            },
            { name: "Done", trigger: "done", action: () => { } },

        ]

        function progress(trigger)
        {
            if (progression[progressionIndex].trigger === trigger) {
                progression[progressionIndex].action();
                progressionIndex++;
            }
        }

        on("progression:begin", () => { progress("progression:begin") });
        on("card:front", () => { progress("card:front") });
        on("star:click", () => { progress("star:click") });
        on("card:back", () => {

            let randomFrontIndex;
            do {
                randomFrontIndex = Math.floor(Math.random() * frontTextures.length);
            } while (randomFrontIndex === frontIndex);
            frontIndex = randomFrontIndex;

            ChangeFrontTexture(frontTextures[randomFrontIndex]);
            progress("card:back") 

        });

        on("navigation:1", () => { gotoSegment(1) });
        on("navigation:2", () => { gotoSegment(2) });
        on("navigation:3", () => { gotoSegment(3) });
        on("navigation:4", () => { gotoSegment(4) });
        on("navigation:5", () => { gotoSegment(5) });
        on("navigation:6", () => { gotoSegment(6) });
    
        cardAlignment.presentationGroup = group.current.children[0];

    }, [])

    useFrame(() => {

        if (frontShader.reference === null) return;
        if (!started) return;

        if (cardAlignment.presentationGroup !== null) 
        {
            let fullRev = Math.PI * 2;
            let rotX = Math.abs(cardAlignment.presentationGroup.rotation.x % fullRev);
            let rotY = Math.abs(cardAlignment.presentationGroup.rotation.y % fullRev);

            if (cardAlignment.alignment === "front") {
                if ((rotY > fullRev / 4 && rotY < fullRev * 3/4 && (rotX < fullRev / 4 || rotX > fullRev * 3/4))
                    || (rotX > fullRev / 4 && rotX < fullRev * 3/4 && (rotY < fullRev / 4 || rotY > fullRev * 3/4))
                )
                {
                    cardAlignment.alignment = "back";
                    trigger("card:back");
                }
            }
            else {
                if ((rotY < fullRev / 4 || rotY > fullRev * 3/4) && (rotX < fullRev / 4 || rotX > fullRev * 3/4)
                    || (rotY > fullRev / 4 && rotY < fullRev * 3/4 && rotX > fullRev / 4 && rotX < fullRev * 3/4)
                )
                {
                    cardAlignment.alignment = "front";
                    trigger("card:front");
                }
            }

            if (stemsToSpin) {
                let stemVolume = -20 + 20 * stemsVolumeFactor.get() * Math.abs(rotY - fullRev/2) / (fullRev/2);
                stemPlayer.setStemVolume(1, stemVolume);
                stemPlayer.setStemVolume(2, stemVolume);
            }

            if (animatingSegments) {
                backShader.reference.uniforms.u_segmentsOffset.value = segmentsOffset.get();
                readyMaterial.opacity = Math.max(1 - segmentsOffset.get() * 20, 0);

                stemPlayer.setStemVolume(3, -20 + 23 * segmentsOffset.get());
            }

        }

        // Movement animations:

        const elapsed = time.getElapsedTime();
        const burnPosition = [burnAnimation.get() * 10, burnAnimation.get() * 10, 0];

        frontShader.reference.uniforms.u_time.value = elapsed;
        frontShader.reference.uniforms.u_PivotPosition.value = burnPosition;
        backShader.reference.uniforms.u_time.value = elapsed;
        backShader.reference.uniforms.u_PivotPosition.value = burnPosition;
        
        let x = Math.sin(elapsed * 0.7 - 0.2) / 4 + Math.sin(elapsed * 0.6 - 0.2) / 4;
        let y = Math.sin(elapsed * 0.25) / 20;
        let z = Math.sin(elapsed * 0.7 - 0.2) / 3;

        group.current.position.set(x * floatFactor / 2, y * floatFactor / 2, 1 + z * floatFactor / 2);

        let xRot = 0 + Math.sin(elapsed * 0.3) / 10;
        let yRot = 0 + Math.sin(elapsed * 0.5) / 10;
        group.current.rotation.set(xRot * floatFactor, yRot * floatFactor, 0);

    })

    function starClick()
    {
        if (readyClickable) {
            trigger("star:click");
            readyClickable = false;
        }
    }


  return (
      <group ref={group} dispose={null} scale={[1, 5/6, 1]}>
            <PresentationControls
                global={true} // Spin globally or by dragging the model
                cursor={false} // Whether to toggle cursor style on drag
                snap={false} // Snap-back to center (can also be a spring config)
                speed={2.5} // Speed factor
                zoom={1} // Zoom factor when half the polar-max is reached
                rotation={[0.1, 0.1, 0]} // Default rotation
                polar={[-Infinity, Infinity]} // Vertical limits
                azimuth={[-Infinity, Infinity]} // Horizontal limits
                config={{ mass: 1, tension: 170, friction: 26 }} // Spring config
                
            >
                <mesh geometry={nodes.Object_2.geometry} material={burnMaterial} rotation={[Math.PI / 2, 0, 0]} scale={0.6} />
                <mesh geometry={nodes.Object_3.geometry} material={burnBackMaterial} position={[-0.1, 0, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[-0.6, 0.6, 0.6]} />

                <mesh ref={readyButton} renderOrder={1} material={readyMaterial} position={[-0.06, -1.6, -0.03]} rotation={[0, Math.PI, 0]} scale={[2.6 * 0.75, 1 * 0.75, 0.01]} onClick={() => {starClick();} }>
                    <planeGeometry attach="geometry" args={[1, 1]}/>
                </mesh>

            </PresentationControls>
      </group>
  )
}

useGLTF.preload('./card/card.gltf')
