<template>

  <!-- Title -->
  <header class="text-center py-4 text-white custom-header">
    <h2><b>PROVING & RELIABILITY LABORATORY</b></h2>
  </header>

  <!-- Main Background Image -->
  <div class="card border-0">
    <img src="/images/mainbg.png" class="card-img-mid" alt="Lab Background" />
  </div>

  <!-- Department Cards -->
  <div class="container my-5">
    <div class="row row-cols-1 row-cols-md-4 g-4">

      <!-- Environment Testing -->
      <div class="col">
        <div class="card h-100 shadow">
          <img src="/images/environmenttestingmain.png" class="card-img-top" />
          <div class="card-body">
            <h5 class="card-title">ENVIRONMENT TESTING</h5>
            <p class="card-text">
              Validates component performance under extreme temperature, humidity, dust, corrosion,
              and vibration conditions.<br />
              Ensures reliability in real-world environments.
            </p>
          </div>
        </div>
      </div>

      <!-- Alternator Testing -->
      <div class="col">
        <div class="card h-100 shadow">
          <img src="/images/alternatortestingmain.png" class="card-img-top" />
          <div class="card-body">
            <h5 class="card-title">ALTERNATOR TESTING</h5>
            <p class="card-text">
              Evaluates electrical output, efficiency, and durability under varying load and speed conditions.<br />
              Ensures consistent power generation and long service life.
            </p>
          </div>
        </div>
      </div>

      <!-- Wiper Testing -->
      <div class="col">
        <div class="card h-100 shadow">
          <img src="/images/wipertestingmain.png" class="card-img-top" />
          <div class="card-body">
            <h5 class="card-title">WIPER TESTING</h5>
            <p class="card-text">
              Tests wiping performance, endurance, and operation under rain, dust, and temperature variations.<br />
              Ensures clear visibility in all conditions.
            </p>
          </div>
        </div>
      </div>

      <!-- Starter Testing -->
      <div class="col">
        <div class="card h-100 shadow">
          <img src="/images/Startertestingmain.png" class="card-img-top" />
          <div class="card-body">
            <h5 class="card-title">STARTER TESTING</h5>
            <p class="card-text">
              Assesses cranking torque, electrical performance, and life cycle under repeated start conditions.<br />
              Ensures dependable engine start.
            </p>
          </div>
        </div>
      </div>

    </div>
  </div>

  <!-- Customers -->
  <div class="text-center my-5">
    <h2><b>CUSTOMERS</b></h2>
    <img src="/images/customerbg.png" class="img-fluid mt-3" />
  </div>

  <!-- Footer -->
  <footer class="bg-dark text-light py-3">
    <div class="container text-center">
      <p class="mb-1">Lucas TVS Proving & Reliability Lab</p>
      <small>Ensuring Quality & Reliability</small>
    </div>
  </footer>

</template>


<style>

/* HEADER COLOR CHANGED */
.custom-header{
  background: linear-gradient(135deg, #1e3a8a, #0ea5e9);
}

/* Optional small improvements */
.card-img-mid{
  height: 350px;
  object-fit: cover;
}

.card img{
  height: 200px;
  object-fit: cover;
}

</style>