<template>
  <nav class="navbar navbar-dark bg-dark navbar-expand-lg">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/"></router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/about">About</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/environment">Environment Testing</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/alternator">Alternator Testing</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/wiper">Wiper Testing</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/Starter">Starter Testing</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/blog">Blog</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/contact">Contact</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/UserManual">User Manual</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav> 

</template>
<script setup>
// No script logic needed for this basic example.
// Ensure Bootstrap CSS and JS are imported in your main.js or index.html
</script>
