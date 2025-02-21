import { useState, useEffect, useRef } from 'react';
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Footer from './components/Footer/Footer';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'; // Import ErrorBoundary
import HeaderComponent from './components/HeaderComponent/HeaderComponent';
import useWebSocketService from './webSocketServices/useWebSocketService';
import LogoAndSiteName from './components/HeaderComponent/LargeAndMdScreen/LogoAndSiteName';
import Peer from 'peerjs'; // Import PeerJS

function App() {
    const userData = useSelector((state) => state.user.userData);
    const [notificationSocketUrl, setNotificationSocketUrl] = useState(null);
    const [peer, setPeer] = useState(null);
    const peerRef = useRef(null); // Use useRef to store the Peer instance
    
    useEffect(() => {
        const initializePeer = async () => {
            if (!peerRef.current) { // Check if the Peer instance has already been initialized
                const newPeer = new Peer();
                newPeer.on('open', (id) => {
                    console.log('Peer connected with ID: ', id);
                    setPeer(newPeer);
                });

                peerRef.current = newPeer; // Store the Peer instance in the ref
            }
        };

        initializePeer();
        
        return () => {
            if (peerRef.current) {
                peerRef.current.destroy();
                peerRef.current = null; // Reset the ref
            }
        };
    }, []);

    useEffect(() => {
        if (userData?.userId && peer?.id) {
            setNotificationSocketUrl(`wss://l8eegkbrkd.execute-api.ap-south-1.amazonaws.com/production/?userId=${userData.userId}&peerId=${peer.id}`);
        }
    }, [userData, peer]);

    const { sendJsonMessage, lastJsonMessage, readyState } =  useWebSocketService(notificationSocketUrl);
    //console.log("socket call received! inisde apppp", sendJsonMessage, lastJsonMessage, readyState);

    return (
        <ErrorBoundary> {/* Wrap with ErrorBoundary */}
            <div className='min-h-screen flex flex-col bg-inherit bg-center' style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTk1fHxiYWNrZ3JvdW5kfGVufDB8fDB8fHwwhttps://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTk1fHxiYWNrZ3JvdW5kfGVufDB8fDB8fHwwhttps://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTk1fHxiYWNrZ3JvdW5kfGVufDB8fDB8fHww)' }}>
                <div className='fixed top-0 left-0 right-0 bg-black bg-opacity-40 backdrop-blur-md flex justify-center items-center' style={{ height: '100px', zIndex: 10 }}>
                    <LogoAndSiteName />
                </div>
                <div className='flex-grow overflow-y-auto' style={{ marginTop: '100px' }}> {/* Scrollable container */}
                    <main className='transition-transform duration-300'>
                        <Outlet />
                    </main>
                </div>
                <HeaderComponent className='fixed bottom-0 left-0 right-0' sendJsonMessage={sendJsonMessage} lastJsonMessage={lastJsonMessage} readyState={readyState} peer={peer}/>
                <Footer className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-50" />
            </div>
        </ErrorBoundary>
    )
}

export default App;