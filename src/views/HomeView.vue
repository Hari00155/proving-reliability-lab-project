<template>
  <div class="d-flex justify-content-center align-items-center vh-100 bg-light">

    <div class="card shadow" style="width: 400px;">
      <img src="D:\full-stack-developer\proving-reliability-lab-report-software\images\bg 2.png" class="card-img-top" alt="Login Image" />

      <div class="card-body">
        <form @submit.prevent="login">
          
          <div class="mb-3">
            <label class="form-label">User Id</label>
            <input 
              type="text" 
              class="form-control" 
              v-model="email"
              placeholder="Enter user ID" 
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

  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      error: ""
    };
  },

  methods: {
    login() {
      const adminEmail = "admin";
      const adminPassword = "123";

      const userEmail = "user";
      const userPassword = "12";

      if (this.email === adminEmail && this.password === adminPassword) {
        this.$router.push({ name: "admin" });
      } 
      else if (this.email === userEmail && this.password === userPassword) {
        this.$router.push({ name: "user" });
      } 
      else {
        this.error = "Invalid User ID or Password ❌";
      }
    }
  }
};
</script>