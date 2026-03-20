<template>
  <!-- ABOUT SECTION -->
  <div class="min-vh-100 d-flex align-items-center justify-content-center">
    <div class="container bg-white p-5 rounded shadow-lg" style="max-width: 1350px">

      <!-- Header -->
      <div class="text-center mb-4 title-bar">
        <h2 class="about-title">ABOUT US</h2>
      </div>

      <!-- Content -->
      <p class="lead text-dark">
        <b>The Proving & Reliability Laboratory</b> is a dedicated facility focused on validating
        the performance, durability, and reliability of automotive electrical and electromechanical
        systems. Our lab plays a critical role in ensuring that every component meets stringent
        quality standards before reaching real-world applications. We specialize in comprehensive
        testing of environmental, alternator, wiper, and starter systems, simulating extreme
        operating conditions such as temperature variation, humidity, vibration, dust, and repeated
        load cycles. These tests help identify potential failures early in the development process
        and ensure long-term product reliability. Equipped with advanced test rigs, calibrated
        instruments, and controlled test environments, our laboratory follows structured test
        procedures aligned with industry standards. Our experienced engineers analyze performance
        data to support design validation, continuous improvement, and compliance requirements. At
        the Proving & Reliability Laboratory, our commitment is to deliver dependable, high-quality
        solutions that enhance product safety, performance, and customer confidence.
      </p>

    </div>
  </div>

  <!-- CUSTOMER SECTION -->
  <div class="mt-5">
    <header class="text-center mb-3">
      <h2><b>CUSTOMERS</b></h2>
    </header>

    <img
      src="/images/customerbg.png"
      class="card-img-top"
      alt="Customer Background"
    />
  </div>
</template>

<style scoped>
/* Header Style */
.title-bar {
  background: linear-gradient(135deg, #0f172a, #2563eb);
  color: white;
  text-align: center;
  padding: 20px;
  border-bottom: 4px solid #facc15;
  border-radius: 8px;
}

/* Reduced font size */
.about-title {
  font-size: 22px;
  margin: 0;
  font-weight: 600;
}

/* Improve paragraph readability */
p {
  font-size: 15px;
  line-height: 1.7;
}
</style>