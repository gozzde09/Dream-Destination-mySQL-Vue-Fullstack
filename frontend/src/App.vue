<script setup>
import { RouterView } from 'vue-router'
import NavBar from "./components/NavBar.vue"
// FONT
import "@fontsource/poppins";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/400-italic.css";
</script>

<template>
  <h1 class="mx-auto mt-4 title"> DREAM DESTINATION</h1>
  <header>
    <NavBar />
  </header>

  <main>
    <RouterView />
  </main>

  <footer>
    <nav class="navbar navbar-dark bg-dark mx-auto">
      <div class="collapse navbar-collapse d-flex mx-auto">
        <p class="navbar-text mx-auto">© 2024 Copyright</p>
      </div>
    </nav>
  </footer>
</template>
<style>
main {
  padding: 0 20px;
}
.title {
  font-family: 'Lucida Handwriting', cursive;
}
[v-cloak] {
  display: none;
}
</style>
