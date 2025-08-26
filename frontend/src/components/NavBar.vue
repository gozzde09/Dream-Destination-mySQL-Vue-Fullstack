<template>
  <nav class="navbar navbar-expand-lg navbar-light">
    <div class="container-xxl">
      <!-- toggle-knapp för mobile-view -->
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#main-nav"
        aria-controls="main-nav" aria-expanded="false" aria-label="Toggle Navigation">
        <span class="navbar-toggler-icon" />
      </button>

      <!-- navbarlänkar -->
      <div class="collapse navbar-collapse justify-content-lg-center align-center" id="main-nav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link to="/countries" class="nav-link"
              :class="{ active: $route.path === '/countries' }">COUNTRIES</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/" class="nav-link" :class="{ active: $route.path === '/' }">BUCKETLIST</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/reviews" class="nav-link" :class="{ active: $route.path === '/reviews' }">
              REVIEWS</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.nav-link {
  padding: 10px;
  margin: 5px;
  height: 40px;
}

.active {
  background-color: #f5eddf;
  color: black;
  border-radius: 2px;
  transition: background-color 0.3s ease;
}
</style>
