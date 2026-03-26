import { createContext, useContext, useState, useEffect } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

const PLAN_CREDITS = {
    free: 5,
    plus: 100,
    premium: 200,
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch user data from Firestore
    const fetchUserData = async (uid) => {
        try {
            const userDoc = await getDoc(doc(db, "users", uid));
            if (userDoc.exists()) {
                setUserData(userDoc.data());
                return userDoc.data();
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
        return null;
    };

    // Sign up with email and password
    const signup = async (email, password) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const { uid } = userCredential.user;

        // Create user document in Firestore
        const newUserData = {
            uid,
            email,
            plan: "free",
            credits: PLAN_CREDITS.free,
            createdAt: new Date().toISOString(),
        };

        await setDoc(doc(db, "users", uid), newUserData);
        setUserData(newUserData);

        return userCredential;
    };

    // Login with email and password
    const login = async (email, password) => {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await fetchUserData(userCredential.user.uid);
        return userCredential;
    };

    // Logout
    const logout = async () => {
        setUserData(null);
        await signOut(auth);
    };

    // Upgrade plan (mock payment)
    const upgradePlan = async (plan) => {
        if (!user) return;

        const credits = PLAN_CREDITS[plan];
        if (!credits) return;

        const userRef = doc(db, "users", user.uid);
        const currentData = userData || (await fetchUserData(user.uid));
        const newCredits = (currentData?.credits || 0) + credits;

        await updateDoc(userRef, {
            plan,
            credits: newCredits,
        });

        setUserData((prev) => ({
            ...prev,
            plan,
            credits: newCredits,
        }));
    };

    // Refresh user data
    const refreshUserData = async () => {
        if (user) {
            await fetchUserData(user.uid);
        }
    };

    // Get Firebase ID token
    const getToken = async () => {
        if (user) {
            return await user.getIdToken();
        }
        return null;
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);
            if (firebaseUser) {
                await fetchUserData(firebaseUser.uid);
            } else {
                setUserData(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const value = {
        user,
        userData,
        loading,
        signup,
        login,
        logout,
        upgradePlan,
        refreshUserData,
        getToken,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
