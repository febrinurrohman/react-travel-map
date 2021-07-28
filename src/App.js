import { Room, Star } from '@material-ui/icons';
import axios from 'axios';
import { useEffect, useState } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { format } from 'timeago.js';

import Login from './components/login/Login';
import Register from './components/register/Register';

import './app.css';

function App() {
    const myStorage = window.localStorage;

    const [currentPlaceId, setCurrentPlaceId] = useState(null);
    const [currentUser, setCurrentUser] = useState(myStorage.getItem("user"));
    const [desc, setDesc] = useState(null);
    const [newPlace, setNewPlace] = useState(null);
    const [pins, setPins] = useState([]);
    const [rating, setRating] = useState(0);
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [title, setTitle] = useState(null);
    const [viewport, setViewport] = useState({
        width: "100vw",
        height: "90vh",
        latitude: 0,
        longitude: 0,
        zoom: 4,
    });

    useEffect(() => {
        const getPins = async () => {
            try {
                const res = await axios.get(process.env.REACT_APP_API_URL + "pins");
                setPins(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        getPins();
    }, []);

    const handleAddClick = (e) => {
        const [long, lat] = e.lngLat;
        setNewPlace({ lat, long });
    };

    const handleLogout = () => {
        myStorage.removeItem("user");
        setCurrentUser(null);
    };

    const handleMarkerClick = (id, lat, long) => {
        setCurrentPlaceId(id);
        setViewport({
            ...viewport,
            latitude: lat,
            longitude: long,
        })
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newPin = {
            username: currentUser,
            title,
            desc,
            rating,
            lat: newPlace.lat,
            long: newPlace.long,
        };

        try {
            const res = await axios.post(process.env.REACT_APP_API_URL + "pins", newPin);
            setPins([...pins, res.data]);
            setNewPlace(null);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="App">
            <ReactMapGL
                {...viewport}
                mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
                onViewportChange={nextViewport => setViewport(nextViewport)}
                mapStyle="mapbox://styles/vanderfarrel/ckql900vk1z5q18n9y8hmyrns"
                onDblClick={handleAddClick}
                transitionDuration="200"
            >
                {
                    pins.map(pin => (
                        <div key={pin._id}>
                            <Marker latitude={pin.lat} longitude={pin.long} offsetLeft={-16} offsetTop={-32}>
                                <Room
                                    style={{
                                        fontSize: 32,
                                        color: pin.username === currentUser ? 'tomato' : 'slateblue',
                                        cursor: "pointer"
                                    }}
                                    onClick={() => handleMarkerClick(pin._id, pin.lat, pin.long)}
                                />
                            </Marker>

                            {
                                pin._id === currentPlaceId && (
                                    <Popup
                                        latitude={pin.lat}
                                        longitude={pin.long}
                                        closeButton={true}
                                        closeOnClick={false}
                                        anchor="left"
                                        onClose={() => setCurrentPlaceId(null)}
                                    >
                                        <div className="card">
                                            <label>Place</label>
                                            <h4 className="place">{pin.title}</h4>

                                            <label>Review</label>
                                            <p className="desc">{pin.desc}</p>

                                            <label>Rating</label>
                                            <div className="stars">
                                                {Array(pin.rating).fill(<Star className="star" />)}
                                            </div>

                                            <label>Information</label>
                                            <span className="username">Created by <strong>{pin.username}</strong></span>
                                            <span className="date">{format(pin.createdAt)}</span>
                                        </div>
                                    </Popup>
                                )
                            }
                        </div>
                    ))
                }

                {
                    newPlace && (
                        <Popup
                            latitude={newPlace.lat}
                            longitude={newPlace.long}
                            closeButton={true}
                            closeOnClick={false}
                            anchor="left"
                            onClose={() => setNewPlace(null)}
                        >
                            <div>
                                <form onSubmit={handleSubmit}>
                                    <label>Title</label>
                                    <input placeholder="Enter a title" onChange={(e) => setTitle(e.target.value)} />

                                    <label>Review</label>
                                    <textarea
                                        placeholder="Say us something about this place"
                                        onChange={(e) => setDesc(e.target.value)}
                                    />

                                    <label>Rating</label>
                                    <select onChange={(e) => setRating(e.target.value)}>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                    </select>

                                    <button className="submitButton" type="submit">Add Pin</button>
                                </form>
                            </div>
                        </Popup>
                    )
                }

                {
                    currentUser ? (
                        <button className="button logout" onClick={handleLogout}>Log out</button>
                    ) : (
                        <div className="buttons">
                            <button className="button login" onClick={() => setShowLogin(true)}>
                                Log in
                            </button>
                            <button className="button register" onClick={() => setShowRegister(true)}>
                                Register
                            </button>
                        </div>
                    )
                }

                {
                    showLogin && (
                        <Login setShowLogin={setShowLogin} myStorage={myStorage} setCurrentUser={setCurrentUser} />
                    )
                }

                {showRegister && <Register setShowRegister={setShowRegister} />}
            </ReactMapGL>
        </div>
    );
}

export default App;
