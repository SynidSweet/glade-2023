import './App.scss';
import { Canvas } from '@react-three/fiber';
import React, { useEffect, useState } from 'react'
import Scene from './components/scene';
import { on, trigger } from './utils/events';
import Signup from './components/signup';
import ModalVideo from 'react-modal-video'

let started = false;


function App() {
    
    const [activeNav, setActiveNav] = useState(1);
    const [showSignup, setShowSignup] = useState(false);
    const [isOpen, setOpen] = useState(false)

    const ShowButton = () => {
      started = true;
      document.querySelector('#start-button').style.opacity = "1";
      document.querySelector('#spinner').style.opacity = "0";
    }

    const HideOpener = () => {
        document.querySelector('#opener').style.display = "none";
    }

    useEffect(() => {
      // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
      let vh = window.innerHeight * 0.01;
      // Then we set the value in the --vh custom property to the root of the document
      document.documentElement.style.setProperty('--vh', `${vh}px`);

      window.addEventListener('resize', () => {
        // We execute the same script as before
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      });

      on ('loaded:audio', () => {ShowButton()})

    }, [])

    function ToggleSignup() {      
      setShowSignup(!showSignup);
      document.querySelector('#signup-wrapper').style.display = showSignup ? "none" : "block";        
    }

  return (
    <div className="App">
      <Canvas style={{height: "100%", width: "100%"}}>
        <Scene/>
      </Canvas>,

      <ModalVideo channel='vimeo' autoplay isOpen={isOpen} videoId="832909222" onClose={() => setOpen(false)} />

      <div id="opener">

        <div className="opener-box">
          <img id="video-preview" src="/video-preview.jpg"></img>
          <button id="video-button" className="button-arounder" onClick={() => 
            {
              setOpen(true);
            }}>Watch!
          </button>          
        </div>
        <div className="opener-box">
          <div id="spinner-container">
            <img id="headphones" src="/headphones.png"></img>
            <img id="spinner" src="/spinner.gif"></img>
          </div>
          <button id="start-button" className="button-arounder" onClick={() => 
            {
              if (!started) return;

              trigger('progression:begin'); 
              HideOpener();
            }}>Listen / Read!
          </button>
        </div>

      </div>

      <div id="navigation">
        <div id="nav1" className={activeNav === 1 ? "nav-button active" : "nav-button"} onClick={() => {trigger('navigation:1'); setActiveNav(1);}}><img src="./navigation/nav1.png"/></div>
        <div id="nav2" className={activeNav === 2 ? "nav-button active" : "nav-button"} onClick={() => {trigger('navigation:2'); setActiveNav(2);}}><img src="./navigation/nav2.png"/></div>
        <div id="nav3" className={activeNav === 3 ? "nav-button active" : "nav-button"} onClick={() => {trigger('navigation:3'); setActiveNav(3);}}><img src="./navigation/nav3.png"/></div>
        <div id="nav4" className={activeNav === 4 ? "nav-button active" : "nav-button"} onClick={() => {trigger('navigation:4'); setActiveNav(4);}}><img src="./navigation/nav4.png"/></div>
        <div id="nav5" className={activeNav === 5 ? "nav-button active" : "nav-button"} onClick={() => {trigger('navigation:5'); setActiveNav(5);}}><img src="./navigation/nav5.png"/></div>
        <div id="nav6" className={activeNav === 6 ? "nav-button active" : "nav-button"} onClick={() => {
          trigger('navigation:6'); 
          setActiveNav(6);
          document.querySelector('#signup-button').style.display = "block";
          document.querySelector('#signup-button').style.opacity = "1";
        }}><img src="./navigation/nav6.png"/></div>
      </div>

      <button id="signup-button" className="button-arounder" onClick={() => 
      {
        ToggleSignup();
        trigger('progression:signup');
      }}>Sign up!
      </button>

      <button id="skip-button" className="button-arounder" onClick={() => 
      {
        ToggleSignup();
      }
      }>{showSignup ? "Hide" : "Skip"}
      </button>

      <Signup/>

    </div>
  );
}

export default App;
