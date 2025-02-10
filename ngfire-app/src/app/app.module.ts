import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import {
  getAnalytics,
  provideAnalytics,
  ScreenTrackingService,
  UserTrackingService,
} from '@angular/fire/analytics';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { AngularFireModule } from '@angular/fire/compat';

import { env } from '../env/environments';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthService } from './services/auth.service';
import { ModalUsersComponent } from "./components/modal-users/modal-users.component";
import { CommonModule } from '@angular/common';
import { MessageInputComponent } from './components/message-input/message-input.component';
import { HeaderChatComponent } from './components/header-chat/header-chat.component';
import { MainChatComponent } from './components/main-chat/main-chat.component';


export function inicializarSessaoFactory(
  sessaoService: AuthService
): () => Promise<void> {
  return () => sessaoService.inicializarSessao();
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    MessageInputComponent,
    HeaderChatComponent,
    MainChatComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(env.firebaseConfig),
    FormsModule,
    HttpClientModule,
    ModalUsersComponent,
    CommonModule
],
  providers: [
    provideFirebaseApp(() => initializeApp(env.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideAnalytics(() => getAnalytics()),
    ScreenTrackingService,
    UserTrackingService,
    provideFirestore(() => getFirestore()),
    provideMessaging(() => getMessaging()),
    provideStorage(() => getStorage()),
    AuthService,
    {
      provide: APP_INITIALIZER,
      useFactory: inicializarSessaoFactory,
      deps: [AuthService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
