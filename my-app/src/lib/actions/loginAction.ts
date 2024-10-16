// src/app/actions/loginAction.js
"use server";
import { generateToken } from "@/lib/jwt";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export async function login(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Crée un JWT en utilisant l'ID utilisateur
        const token = generateToken({ uid: user.uid, email: user.email });

        // Retourne le token pour l'utiliser côté client
        return { token };
    } catch (error) {
        console.error("Login error:", error);
        throw new Error("Login failed");
    }
}