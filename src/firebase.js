import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import { getDataConnect, connectDataConnectEmulator } from 'firebase/data-connect';
import { connectorConfig } from './dataconnect';

// We use dummy values since we are securely connecting to the local Firebase Emulators
const firebaseConfig = {
    apiKey: "dummy-api-key-for-local-emulator",
    projectId: "platepartner-f34a0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// Connect Auth to the local emulator for testing
connectAuthEmulator(auth, "http://localhost:9099");
const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider('apple.com');

// Initialize Firebase Data Connect with the generated GraphQL SDK config
const dataConnect = getDataConnect(app, connectorConfig);

// Route traffic to the local Firebase Data Connect Emulator backend
connectDataConnectEmulator(dataConnect, "localhost", 9399);

export { app, auth, dataConnect, googleProvider, appleProvider };
