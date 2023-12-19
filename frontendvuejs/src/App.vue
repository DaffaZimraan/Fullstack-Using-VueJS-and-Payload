<template>
  <div></div>

  <div>
    <h1>Aplikasi Chat</h1>
    <div v-if="islogin">
      <button @click="Logout()">Logout</button>
    </div>
  </div>

  <br /><br />

  <div v-if="!islogin">
    <h3>LOGIN</h3>
    <label for="email">Email :</label>
    <input type="email" v-model="email" />
    <label for="password"> Password :</label>
    <input type="password" v-model="password" />
    <button @click="handleLogin()">login</button>
    <p>{{ loginMessage }}</p>

    <button @click="isSignIn()">Buat Akun</button>
  </div>
  <br />

  <div v-if="singed">
    <h3>SIGN IN</h3>
    <label for="email_sign">Email </label>
    <input type="email_sign" v-model="email_sign" /><br />
    <label for="password_sign">Password</label>
    <input type="password" v-model="password_sign" /><br />
    <label for="username">Username</label>
    <input type="username" v-model="username" />

    <button @click="signIN()">Sign in</button>
    <p>{{ signMessage }}</p>
  </div>
  <br />

  <div v-if="islogin">
    <div>
      <h3>CREATE CHANNELS</h3>
      <input type="name_channel" v-model="name_channel" />
      <button @click="createChannel()">Channels</button>
      <p>{{ createMessage }}</p>
    </div>
    <br />

    <div v-if="!joined">
      <h3>JOIN CHANNEL</h3>
      <button @click="getChannels()">Get Channels</button>
      <div v-for="channel in channels" :key="channel.id">
        <p>Nama : {{ channel.channel }}</p>
        <button @click="joinChannel(channel.id)">join</button>
      </div>
    </div>

    <br />

    <div v-if="joined">
      <h3>SEND MESSAGE</h3>
      <label for="message">Message </label>
      <input type="message" v-model="message" />
      <button @click="sendMessage()">Send</button>
    </div>

    <div>
      <h3>History Chat</h3>
      <div v-for="chat in chatLog" :key="chat.id">
        <p>{{ chat.id }} : {{ chat.message }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const email = ref("");
const password = ref("");
const loginMessage = ref("");
const islogin = ref(false);
const channels = ref("");
const name_channel = ref("");
const createMessage = ref("");
const join_channel = ref("");
const user = ref("");
const message = ref("");
const idChannel = ref("");
const chatLog = ref("");
const username = ref("");
const singed = ref(false);
const email_sign = ref("");
const password_sign = ref("");
const signMessage = ref("");
const joined = ref(false);
const idChanenel_find = ref("");

import { ref } from "vue";

async function handleLogin() {
  try {
    const req = await fetch("http://localhost:3000/api/accounts/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    });
    const data = await req.json();
    console.log(data);

    loginMessage.value = data.message;
    console.log(email.value);
    console.log(chatLog);

    user.value = data.user;
    islogin.value = true;
    singed.value = false;
    joined.value = false;
  } catch (err) {
    console.log(err);
  }
}

async function getChannels() {
  try {
    const req = await fetch("http://localhost:3000/api/channels/");
    const data = await req.json();
    console.log(data);

    channels.value = data.docs;
    console.log(channels.value);
  } catch (err) {
    console.log(err);
  }
}

async function createChannel() {
  try {
    const req = await fetch("http://localhost:3000/api/channels/", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channel: name_channel.value,
      }),
    });
    const data = await req.json();
    console.log(data);
    createMessage.value = data.message;
  } catch (err) {
    console.log(err);
  }
}

async function sendMessage() {
  try {
    const newChat = {
      sender: user.value.username,
      message: message.value,
    };

    const newdata = {
      chathistory: [...chatLog.value, newChat],
    };

    const req = await fetch(
      `http://localhost:3000/api/channels/${idChannel.value}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newdata),
      }
    );
    const data = await req.json();
    // console.log(newChat)
    // console.log(...chatLog.value)
    console.log(newdata);
    // console.log(data)
  } catch (err) {
    console.log(err);
  }
}

async function joinChannel(channelID) {
  try {
    idChannel.value = channelID;
    const req = await fetch(`http://localhost:3000/api/channels/${channelID}`);
    const data = await req.json();
    console.log(data);

    chatLog.value = data.chathistory;
    console.log(chatLog.value);
    console.log(idChannel.value);
    joined.value = true;

    await fetchChatHistory(channelID);
  } catch (err) {
    console.log(err);
  }
}

async function signIN() {
  try {
    const req = await fetch("http://localhost:3000/api/accounts", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email_sign.value,
        password: password_sign.value,
        username: username.value,
      }),
    });
    const data = await req.json();
    console.log(data);
    signMessage.value = data.message;
  } catch (err) {
    console.log(err);
  }
}

function isSignIn() {
  singed.value = true;
  islogin.value = false;
}

async function Logout() {
  try {
    const req = await fetch("http://localhost:3000/api/accounts/logout", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await req.json();
    console.log(data);
    islogin.value = false;
  } catch (err) {
    console.log(err);
  }
}

async function fetchChatHistory(channelID) {
  try {
    const req = await fetch(
      `http://localhost:3000/api/channels/${channelID}/history`
    );
    const data = await req.json();
    console.log(data);

    chathistory.value = data.chathistory;
  } catch (err) {
    console.log(err);
  }
}
</script>

<style></style>
