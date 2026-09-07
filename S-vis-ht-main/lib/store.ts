import { create } from 'zustand';
import { auth, db, storage } from './firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  doc,
  setDoc,
  getDoc,
  updateDoc,
  query, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export interface User {
  id: string;
  name: string;
  phone: string;
  role: 'customer' | 'provider';
  profession?: string;
  location?: string;
  priceRate?: string;
  avatar?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt: any;
}

export interface ServiceRequest {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  providerId: string;
  serviceTitle: string;
  description: string;
  status: 'pending' | 'accepted' | 'completed';
  createdAt: any;
}

interface AppState {
  user: User | null;
  providers: User[];
  requests: ServiceRequest[];
  currentScreen: 'home' | 'search' | 'requests' | 'messages' | 'profile';
  toastMessage: string | null;
  messages: Message[];
  login: (phone: string, pass: string) => Promise<void>;
  register: (data: { name: string; phone: string; password: string; role: 'customer' | 'provider'; profession?: string; location?: string; priceRate?: string }) => Promise<void>;
  logout: () => Promise<void>;
  uploadProfilePicture: (file: File) => Promise<string>;
  sendMessage: (receiverId: string, text: string) => Promise<void>;
  listenToMessages: (chatPartnerId: string) => () => void;
  listenToProviders: () => () => void;
  createRequest: (providerId: string, serviceTitle: string, description: string) => Promise<void>;
  listenToRequests: () => () => void;
  navigate: (screen: 'home' | 'search' | 'requests' | 'messages' | 'profile') => void;
  showToast: (msg: string) => void;
}

export const useApp = create<AppState>((set, get) => {
  onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        set({
          user: {
            id: firebaseUser.uid,
            name: userData.name || 'Itilizatè',
            phone: userData.phone || '',
            role: userData.role || 'customer',
            profession: userData.profession,
            location: userData.location,
            priceRate: userData.priceRate,
            avatar: userData.avatar
          }
        });
      }
    } else {
      set({ user: null });
    }
  });

  return {
    user: null,
    providers: [],
    requests: [],
    currentScreen: 'home',
    toastMessage: null,
    messages: [],

    login: async (phone, pass) => {
      const email = `${phone.replace(/\s+/g, '')}@sevis.ht`;
      await signInWithEmailAndPassword(auth, email, pass);
    },

    register: async ({ name, phone, password, role, profession, location, priceRate }) => {
      const email = `${phone.replace(/\s+/g, '')}@sevis.ht`;
      const res = await createUserWithEmailAndPassword(auth, email, password);
      
      const defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200';
      const userData: User = {
        id: res.user.uid,
        name,
        phone,
        role,
        profession: role === 'provider' ? profession : undefined,
        location: role === 'provider' ? location : undefined,
        priceRate: role === 'provider' ? priceRate : undefined,
        avatar: defaultAvatar
      };

      await setDoc(doc(db, 'users', res.user.uid), userData);
      if (role === 'provider') {
        await setDoc(doc(db, 'providers', res.user.uid), userData);
      }

      set({ user: userData });
    },

    uploadProfilePicture: async (file: File) => {
      const currentUser = get().user;
      if (!currentUser) throw new Error("Pas de utilisateur connecté");

      const storageRef = ref(storage, `avatars/${currentUser.id}_${Date.now()}`);
      await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(storageRef);

      await updateDoc(doc(db, 'users', currentUser.id), { avatar: photoURL });
      if (currentUser.role === 'provider') {
        await updateDoc(doc(db, 'providers', currentUser.id), { avatar: photoURL });
      }

      set({ user: { ...currentUser, avatar: photoURL } });
      return photoURL;
    },

    logout: async () => {
      await signOut(auth);
      set({ user: null, currentScreen: 'home' });
    },

    sendMessage: async (receiverId, text) => {
      const currentUser = get().user;
      if (!currentUser) return;

      await addDoc(collection(db, 'messages'), {
        senderId: currentUser.id,
        receiverId,
        text,
        createdAt: serverTimestamp()
      });
    },

    listenToMessages: (chatPartnerId) => {
      const currentUser = get().user;
      if (!currentUser) return () => {};

      const q = query(collection(db, 'messages'));
      return onSnapshot(q, (snapshot) => {
        const msgs: Message[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (
            (data.senderId === currentUser.id && data.receiverId === chatPartnerId) ||
            (data.senderId === chatPartnerId && data.receiverId === currentUser.id)
          ) {
            msgs.push({ id: doc.id, ...data } as Message);
          }
        });
        msgs.sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0));
        set({ messages: msgs });
      });
    },

    listenToProviders: () => {
      const q = query(collection(db, 'providers'));
      return onSnapshot(q, (snapshot) => {
        const list: User[] = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as User);
        });
        set({ providers: list });
      });
    },

    createRequest: async (providerId, serviceTitle, description) => {
      const currentUser = get().user;
      if (!currentUser) return;

      await addDoc(collection(db, 'requests'), {
        customerId: currentUser.id,
        customerName: currentUser.name,
        customerPhone: currentUser.phone,
        providerId,
        serviceTitle,
        description,
        status: 'pending',
        createdAt: serverTimestamp()
      });
    },

    listenToRequests: () => {
      const currentUser = get().user;
      if (!currentUser) return () => {};

      const q = query(collection(db, 'requests'));
      return onSnapshot(q, (snapshot) => {
        const reqs: ServiceRequest[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data.customerId === currentUser.id || data.providerId === currentUser.id) {
            reqs.push({ id: doc.id, ...data } as ServiceRequest);
          }
        });
        set({ requests: reqs });
      });
    },

    navigate: (screen) => set({ currentScreen: screen }),
    showToast: (msg) => {
      set({ toastMessage: msg });
      setTimeout(() => set({ toastMessage: null }), 3000);
    }
  };
});
