<template>
  <div class="d-flex justify-content-center align-items-center vh-100 bg-light">

    <!-- LOGIN PAGE -->
    <div v-if="page === 'login'" class="card shadow" style="width: 400px;">
      <img src="D:\full-stack-developer\proving-reliability-lab-report-software\images\bg 2.png" class="card-img-top" alt="Login Image" />

      <div class="card-body">
        <form @submit.prevent="login">
          
          <div class="mb-3">
            <label class="form-label">User Id</label>
            <input 
              type="email" 
              class="form-control" 
              v-model="email"
              placeholder="Enter email" 
              required
            />
          </div>

          <div class="mb-3">
            <label class="form-label">Password</label>
            <input 
              type="password" 
              class="form-control" 
              v-model="password"
              placeholder="Enter password"
              required
            />
          </div>

          <button type="submit" class="btn btn-primary w-100">
            Sign in
          </button>

          <p v-if="error" class="text-danger text-center mt-2">
            {{ error }}
          </p>

        </form>
      </div>
    </div>

    <!-- ROLE SELECTION -->
    <div v-else class="card shadow p-4 text-center" style="width: 400px;">
      <h4 class="mb-4">Select Your Privilege</h4>

      <button 
        class="btn btn-primary w-100 mb-3"
        @click="selectRole('user')"
      >
        Proving Lab User
      </button>

      <button 
        class="btn btn-dark w-100"
        @click="selectRole('admin')"
      >
        Proving Lab Administrator
      </button>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      error: "",
      page: "login" // control view
    };
  },
  methods: {
    login() {
      const validEmail = "admin@gmail.com";
      const validPassword = "123456";

      if (this.email === validEmail && this.password === validPassword) {
        this.page = "role"; // switch to role selection
      } else {
        this.error = "Invalid Email or Password ❌";
      }
    },

    selectRole(role) {
      if (role === "user") {
        this.$router.push("/user-dashboard");
      } else {
        this.$router.push("/admin-dashboard");
      }
    }
  }
};
</script>