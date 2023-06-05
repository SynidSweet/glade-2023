import React, { useEffect } from 'react';
import * as Tone from 'tone';
import { on, trigger } from '../utils/events';

let introStems;
let loopStemsA;
let loopStemsB;

const oneShots = [
    {path: "05 turn card B.mp3", volume: -10},
    {path: "06 interact card C.mp3", volume: -10},
];

let oneShotsPlayers = [];

const DynamicMusic = ({stemPlayer}) => {

    useEffect(() => {

        // Initialize the intro stems
        const introStemsList = ['stems/01 main track A.mp3', 'stems/02 kulning A.mp3', 'stems/03 animals A.mp3', 'stems/04 bass A.mp3'];
        introStems = (introStemsList.map((path) => new Tone.Player(path).toDestination()));

        // Initialize the loop stems
        const loopStemsList = ['stems/01 main track B.mp3', 'stems/02 kulning B.mp3', 'stems/03 animals B.mp3', 'stems/04 bass B.mp3'];
        loopStemsA = loopStemsList.map((path) => new Tone.Player(path).toDestination());
        loopStemsB = loopStemsList.map((path) => new Tone.Player(path).toDestination());

        oneShotsPlayers = oneShots.map((sound) => new Tone.Player(`stems/${sound.path}`).toDestination());

        const allAudio = [...introStems, ...loopStemsA, ...loopStemsB, ...oneShotsPlayers];
        Promise.all(allAudio.map(stem => stem.loaded)).then(() => {

            setTimeout(function(){
            }, 2000);
            trigger('loaded:audio')
            //setStemVolume(3, -Infinity);
        });


        function playOneShot(name) {
            const index = oneShots.findIndex((sound) => sound.path === name);
            const player = oneShotsPlayers[index];
            player.volume.value = oneShots[index].volume;
            player.start();
        }

        on('audio:cardburn', () => playOneShot("05 turn card B.mp3"));
        on('audio:cardflip', () => playOneShot("06 interact card C.mp3"));

        on('progression:begin', async () => 
        {
            await Tone.start();
            startPlayback()
        })

        stemPlayer.setStemVolume = setStemVolume;

    }, []);

    const startPlayback = async () => {
        
        setStemVolume(1, -50);
        setStemVolume(2, -50);
        setStemVolume(3, -50);

        introStems.forEach((stem) => stem.start(Tone.Time(0)));
      
        const maxIntroDuration = Math.max(...introStems.map((stem) => stem.buffer.duration));
        const maxLoopDuration = Math.max(...loopStemsA.map((stem) => stem.buffer.duration));

        const maxLoopDurTime = Tone.Time(maxLoopDuration - 0.10);

        let nextGroup = loopStemsA;

        Tone.Transport.schedule(() => {

            let firstPlaying = false;
            Tone.Transport.scheduleRepeat((time) => {
                nextGroup.forEach((stem) => 
                    {
                        stem.seek(0); 
                        stem.start(Tone.now());
                    });
                firstPlaying = !firstPlaying;
                nextGroup = firstPlaying ? loopStemsB : loopStemsA;
            }, maxLoopDurTime); 
            
        }, Tone.Time(maxIntroDuration - 0.25));

        Tone.Transport.start();
    };
    
    const setStemVolume = (stemIndex, volume) => {
        introStems[stemIndex].volume.value = volume;
        loopStemsA[stemIndex].volume.value = volume;
        loopStemsB[stemIndex].volume.value = volume;
    }

    // const fadeInStem = (stemIndex, fadeDuration = 2) => {
    //     const stem = loopStemsA[stemIndex];
    //     stem.volume.cancelScheduledValues();
    //     stem.volume.linearRampToValueAtTime(-Infinity, Tone.now());
    //     stem.volume.linearRampToValueAtTime(0, Tone.now() + fadeDuration);
    // };

    // const fadeOutStem = (stemIndex, fadeDuration = 2) => {
    //     const stem = loopStemsA[stemIndex];
    //     stem.volume.cancelScheduledValues();
    //     stem.volume.linearRampToValueAtTime(0, Tone.now());
    //     stem.volume.linearRampToValueAtTime(-Infinity, Tone.now() + fadeDuration);
    // };

    return (
        <React.Fragment/>
    )
};
  
export default DynamicMusic;