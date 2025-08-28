declare module 'redux-persist/lib/storage' {
    import { Storage } from 'redux-persist';
    const localStorage: Storage;
    export default localStorage;
}