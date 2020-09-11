import io from 'socket.io-client';
import { API_BASE_URL } from '../data/params';
const socket = io(API_BASE_URL);

export default socket;