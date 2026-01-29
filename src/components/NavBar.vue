<template>
  <nav class="navbar navbar-dark bg-dark navbar-expand-lg">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">MyApp</router-link>
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
            <router-link class="nav-link" to="/staff-form">Staff Form</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/student-form">Student Form</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/Department-form">Department Form</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/List-form">List View</router-link>
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
