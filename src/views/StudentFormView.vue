<template>

<!-- HEADER -->
<header class="title-bar">
  <h2>ALTERNATOR TESTING</h2>
  <p>
    Comprehensive validation of automotive alternators to ensure reliable electrical performance,
    durability, and efficiency under thermal, speed, and load conditions.
  </p>
</header>

<div class="container my-5">

<h3 class="section-title">THERMAL & PERFORMANCE TESTING</h3>

<div class="row row-cols-1 row-cols-md-3 g-4">

<!-- 1 -->
<div class="col">
<div class="card test-card">
<img src="D:\full-stack-developer\proving-reliability-lab-project\images\ana.jpg" class="test-img">
<div class="card-body">
<h5>NORMAL SPEED - NORMAL AMBIENT</h5>

<p class="why">
<b>Why Test:</b> Verifies alternator performance under standard operating conditions ensuring stable output and thermal balance.
</p>

<p class="spec">
<b>Machine Specifications:</b><br>
Speed : 1500 – 3000 RPM<br>
Temp : 25°C ±5°C<br>
Voltage : 12V / 24V<br>
Load : No / Partial<br>
Duration : 2–8 hrs
</p>

</div>
</div>
</div>

<!-- 2 -->
<div class="col">
<div class="card test-card">
<img src="D:\full-stack-developer\proving-reliability-lab-project\images\anh.jpg" class="test-img">
<div class="card-body">
<h5>HIGH SPEED - HIGH AMBIENT</h5>

<p class="why">
<b>Why Test:</b> Evaluates durability under high temperature and speed, identifying overheating and insulation failure.
</p>

<p class="spec">
<b>Machine Specifications:</b><br>
Speed : Up to 6000 RPM<br>
Temp : 120°C – 180°C<br>
Load : Full Load<br>
Monitoring : Voltage / Current<br>
Duration : 1–4 hrs
</p>

</div>
</div>
</div>

<!-- 3 -->
<div class="col">
<div class="card test-card">
<img src="D:\full-stack-developer\proving-reliability-lab-project\images\anvs.jpg" class="test-img">
<div class="card-body">
<h5>VARIABLE SPEED - HIGH AMBIENT</h5>

<p class="why">
<b>Why Test:</b> Simulates real driving conditions with varying speeds and high temperature.
</p>

<p class="spec">
<b>Machine Specifications:</b><br>
Speed : 1000 – 6000 RPM<br>
Temp : Up to 180°C<br>
Control : Programmable<br>
Load : Dynamic<br>
Cycle : Continuous
</p>

</div>
</div>
</div>

<!-- 4 -->
<div class="col">
<div class="card test-card">
<img src="D:\full-stack-developer\proving-reliability-lab-project\images\anhvs.jpg" class="test-img">
<div class="card-body">
<h5>VARIABLE SPEED - CYCLIC AMBIENT</h5>

<p class="why">
<b>Why Test:</b> Tests alternator reliability under cyclic temperature and humidity conditions.
</p>

<p class="spec">
<b>Machine Specifications:</b><br>
Temp : -40°C to +150°C<br>
Humidity : 20% – 95% RH<br>
Speed : Variable<br>
Accuracy : ±1°C<br>
Application : Automotive
</p>

</div>
</div>
</div>

<!-- 5 -->
<div class="col">
<div class="card test-card">
<img src="D:\full-stack-developer\proving-reliability-lab-project\images\ashsl.jpg" class="test-img">
<div class="card-body">
<h5>ACCELERATION & DECELERATION</h5>

<p class="why">
<b>Why Test:</b> Evaluates response to rapid speed changes during real driving conditions.
</p>

<p class="spec">
<b>Machine Specifications:</b><br>
Speed : 0 – 6000 RPM<br>
Ramp : High rate<br>
Temp : -70°C to 180°C<br>
Cycles : 100–1000<br>
Control : Programmable
</p>

</div>
</div>
</div>

<!-- 6 -->
<div class="col">
<div class="card test-card">
<img src="D:\full-stack-developer\proving-reliability-lab-project\images\anhshl.jpg" class="test-img">
<div class="card-body">
<h5>HIGH SPEED - HIGH LOAD</h5>

<p class="why">
<b>Why Test:</b> Ensures alternator withstands maximum electrical load without failure.
</p>

<p class="spec">
<b>Machine Specifications:</b><br>
Speed : Up to 6000 RPM<br>
Load : 100% Load<br>
Temp : 80°C – 150°C<br>
Monitoring : Voltage / Efficiency<br>
Duration : Endurance
</p>

</div>
</div>
</div>

</div>
</div>

</template>


<style>

/* HEADER */
.title-bar{
background: linear-gradient(135deg, #0f172a, #2563eb);
color:white;
text-align:center;
padding:30px;
border-bottom:4px solid #facc15;
}

.title-bar h2{
margin:0;
font-size:28px;
letter-spacing:1px;
}

.title-bar p{
margin-top:10px;
font-size:15px;
opacity:0.9;
}

/* SECTION */
.section-title{
margin-top:50px;
margin-bottom:20px;
color:#1e3a8a;
font-weight:bold;
border-left:5px solid #f59e0b;
padding-left:12px;
}

/* CARD */
.test-card{
border:none;
border-radius:12px;
transition:0.3s;
box-shadow:0 6px 18px rgba(0,0,0,0.15);
}

.test-card:hover{
transform:translateY(-10px);
box-shadow:0 14px 30px rgba(0,0,0,0.25);
}

.test-img{
width:100%;
height:220px;
object-fit:cover;
border-top-left-radius:12px;
border-top-right-radius:12px;
}

.card-body{
padding:15px;
}

.card-body h5{
font-size:16px;
font-weight:600;
margin-bottom:10px;
}

.why{
font-size:14px;
color:#374151;
margin-bottom:10px;
}

.spec{
font-size:13px;
color:#4b5563;
line-height:1.6;
}

</style>