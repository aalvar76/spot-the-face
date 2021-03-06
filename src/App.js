import React, { Component } from 'react';

/*Importing all components needed*/
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Particles from 'react-particles-js';
import ParticlesOptions from './particlesjs-config';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Clarifai from 'clarifai';

/*Importing all css  needed*/
import './App.css';

//clarifai api
const app = new Clarifai.App({
 apiKey: 'a36e2194884e452aacb7f7bab4e37b79'
});

const initialState = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user:{
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }

class App extends Component {
  constructor(){
    super();
    this.state = initialState;
  }

  loadUser = (data) =>{
    this.setState({user:
      {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    })
  }

  onInputChange = (event) => {
    console.log(event.target.value);
    this.setState({input: event.target.value});
  }

  calculateFaceLocation = (data) =>{
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    //
    return{
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) =>{
    console.log(box);
    this.setState({box: box});
  }

  onButtonSubmit = () => {
      this.setState({imageUrl: this.state.input});
      app.models.predict(
        "a403429f2ddf4b49b307e318f00e528b", 
        this.state.input)
      .then( response => {
          if(response){
            fetch('https://cryptic-brook-79325.herokuapp.com/image', {
              method:'put',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                  id : this.state.user.id
              })
            })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user,{entries:count}));
            });
          }
          this.displayFaceBox(this.calculateFaceLocation(response));
      })
      .catch(error => console.log(error));
  }

  onRouteChange = (route) =>{
    if(route === 'signout'){
      this.setState(initialState)
    }
    else if(route === 'home'){
      this.setState({isSignedIn:true})
    }
    this.setState({route: route});
  }

  render(){
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
    <div className="App">
      <Particles className = 'particles' params={ParticlesOptions}/>
      <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn} />
      { 
        route === 'home'
        ? <div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries}/> 
            <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
            <FaceRecognition imageUrl={imageUrl} box={box}/>
          </div>
        : (route === 'signin' 
          ?<SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          : <Register onRouteChange = {this.onRouteChange} loadUser = {this.loadUser}/>)
      }
    </div>
  );
  }
}

export default App;
