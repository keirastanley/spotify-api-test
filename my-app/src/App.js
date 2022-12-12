import { useEffect, useState } from "react";
import { loginUrl } from "./spotify";
import { getTokenFromUrl } from "./spotify";
import SpotifyWebApi from "spotify-web-api-js"
import './App.css';

const spotify = new SpotifyWebApi();

function App() {
  const [spotifyToken, setSpotifyToken] = useState("");
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState()

  useEffect(() => {
    console.log("This is what we derived from the URL: ", getTokenFromUrl())
    const _spotifyToken = getTokenFromUrl().access_token;
    window.location.hash = "";
    console.log("THIS IS OUR SPOTIFY TOKEN", _spotifyToken)

    if (_spotifyToken){
      setSpotifyToken(_spotifyToken)
      spotify.setAccessToken(_spotifyToken)
      spotify.getMe().then((_user) => {
        console.log("This is you: ", _user)
        setUser(_user)
        setIsAuth(true)
      })
    }
  }, [])

  async function makePlaylist(){
    spotify.setAccessToken(spotifyToken)
    const userId = user.id;
    const data = {
      name: "Playlist made from React App",
      description: "Test",
      public: "false"
    }
    const playlist = await spotify.createPlaylist(userId, data);
    const playlistId = playlist.id;
    const uris = ["spotify:track:0aMqNFBj9KtPTD3c3tByRT", "spotify:track:0Pie5DFAHHxpkONFUsAI6s",                  "spotify:track:0aMqNFBj9KtPTD3c3tByRT"]
    const options = {"position": 0}
    const result = await spotify.addTracksToPlaylist(playlistId, uris, options);
    const tracks = await spotify.getPlaylistTracks(playlistId)
    console.log("tracks", tracks)
  }

  useEffect(() => {
    console.log("User", user)
  }, [user])

  return (<div>
        {isAuth ? <button onClick={makePlaylist}>Make playlist</button> : <button><a href={loginUrl}>Login to Spotify!</a></button>}
        {user ? <p>Logged in as {user.display_name}</p> : <p></p>}
  </div>
  );
}

export default App;
