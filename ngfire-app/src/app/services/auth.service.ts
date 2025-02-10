import { Injectable } from '@angular/core';
import {
  Firestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import {
  Auth,
  browserSessionPersistence,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
  UserCredential,
} from '@angular/fire/auth';
import { BehaviorSubject, catchError, from, map, Observable, of } from 'rxjs';

export interface UserData {
  uid: string;
  email: string | null;
  nome?: string;
  criadoEm?: Date;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  private usuarioLogado: boolean = false;

  constructor(private auth: Auth, private firestore: Firestore) {
  }

  inicializarSessao(): Promise<void> {
    return new Promise((resolve) => {
      this.auth.onAuthStateChanged((user) => {
        this.usuarioLogado = !!user;
        resolve();
      });
    });
  }

  async register(nome: string, email: string, senha: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        senha
      );
      const user = userCredential.user;

      await updateProfile(user, { displayName: nome });
      await user.reload();

      await setDoc(doc(this.firestore, 'users', user.uid), {
        nome: nome,
        email: email,
        criadoEm: new Date(),
      });

      console.log('Usuário cadastrado e salvo no Firestore:', user);
    } catch (error) {
      console.error('Erro no cadastro:', error);
    }
  }

  async login(email: string, senha: string, sessionPersist: boolean) {
    try {
      if (sessionPersist) {
        setPersistence(this.auth, browserSessionPersistence);
        console.log('Persistência definida para SESSAO.');
      }

      const userCredential: UserCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        senha
      );
      const user = userCredential.user;

      const userDoc = await getDoc(doc(this.firestore, 'users', user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('Usuário logado:', userData);
        return userData;
      } else {
        console.error('Usuário não encontrado no Firestore');
        return null;
      }
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  }

  async logout() {
    try {
      await signOut(this.auth);
      console.log('Usuário deslogado com sucesso');
    } catch (error) {
      console.error('Erro ao deslogar:', error);
    }
  }

  getUser(): Observable<UserData | null> {
    return new Observable((subscriber) => {
      const unsubscribe = onAuthStateChanged(this.auth, async (user) => {
        if (!user) {
          subscriber.next(null);
        } else {
          try {
            const userDoc = await getDoc(
              doc(this.firestore, 'users', user.uid)
            );
            let userData: UserData = { uid: user.uid, email: user.email };
            if (userDoc.exists()) {
              userData = { ...userData, ...userDoc.data() } as UserData;
            }
            subscriber.next(userData);
          } catch (error) {
            console.error('Erro ao buscar dados do usuário:', error);
            subscriber.next(null);
          }
        }
      });
      return { unsubscribe };
    });
  }

  async updateUser(uid: string, data: any) {
    try {
      await updateDoc(doc(this.firestore, 'users', uid), data);
      console.log('Usuário atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
    }
  }

  estaLogado(): boolean {
    return this.usuarioLogado;
  }
}
