<template>

<!-- HEADER -->
<header class="title-bar">
<h2>ENVIRONMENT TESTING </h2>
<p>Reliability validation of automotive components under extreme environmental conditions</p>
</header>

<div class="container my-5">

<!-- ================= VIBRATION ================= -->

<h3 class="section-title">VIBRATION TESTING</h3>

<div class="row row-cols-1 row-cols-md-4 g-4">

<!-- 4T -->
<div class="col">
<div class="card test-card">
<img src="D:\full-stack-developer\proving-reliability-lab-project\images\4t.png" class="test-img">

<div class="card-body">
<h5>4T VIBRATION</h5>


<p class="why"><b>Why Test:</b> Simulates road vibration to ensure durability of motors and alternators.</p>

<p class="spec">
Sine Force : 4000kgf<br>
Random Force : 4000kgf<br>
Shock Force : 8000kgf<br>
Frequency : 2Hz – 3000Hz
</p>

</div>
</div>
</div>

<!-- 1D -->
<div class="col">
<div class="card test-card">

<img src="D:\full-stack-developer\proving-reliability-lab-project\images\1d.png" class="test-img">

<div class="card-body">

<h5>1D VIBRATION</h5>

<p class="why"><b>Why Test:</b> Evaluates reliability under vibration combined with temperature conditions.</p>

<p class="spec">
Max Force : 2000kgf<br>
Frequency : 10–2000Hz<br>
Temp : -40°C to 170°C
</p>

</div>
</div>
</div>

</div>

<!-- ================= THERMAL ================= -->

<h3 class="section-title">THERMAL TESTING</h3>

<div class="row row-cols-1 row-cols-md-4 g-4">

<!-- 3 Zone -->
<div class="col">
<div class="card test-card">

<img src="D:\full-stack-developer\proving-reliability-lab-project\images\3zone.png" class="test-img">

<div class="card-body">

<h5>3 ZONE THERMAL SHOCK</h5>

<p class="why"><b>Why Test:</b> Checks component durability during sudden temperature changes.</p>

<p class="spec">
Hot Chamber : +220°C<br>
Cold Chamber : -80°C<br>
Transfer Time : 10 sec
</p>

</div>
</div>
</div>

<!-- 2 Zone -->
<div class="col">
<div class="card test-card">

<img src="D:\full-stack-developer\proving-reliability-lab-project\images\2 zone.jpg" class="test-img">

<div class="card-body">

<h5>2 ZONE THERMAL SHOCK</h5>

<p class="why"><b>Why Test:</b> Evaluates component reliability under rapid temperature transition between hot and cold zones, identifying material cracks, seal failures, and thermal stress issues.</p>

<p class="spec">
Hot Chamber : +200°C to +220°C<br>
Cold Chamber : -70°C to -80°C<br>
Transfer Time : ≤ 10 sec<br>
Dwell Time : 10–30 min<br>
Cycles : 100–1000 cycles
</p>

</div>
</div>
</div>

<!-- ACS climate chamber -->
<div class="col">
<div class="card test-card">

<img src="D:\full-stack-developer\proving-reliability-lab-project\images\acs.jpg" class="test-img">

<div class="card-body">

<h5>ACS CLIMATE CHAMBER</h5>

<p class="why"><b>Why Test:</b> Simulates combined environmental conditions like temperature and humidity to validate long-term durability and performance of automotive components.</p>

<p class="spec">
Temp Range : -70°C to +180°C<br>
Humidity : 10% – 98% RH<br>
Rate of Change : 3–5°C/min<br>
Volume : 500L – 1500L
</p>

</div>
</div>
</div>

<!-- SOUTHERN CLIMATE CHAMBER -->
<div class="col">
<div class="card test-card">

<img src="D:\full-stack-developer\proving-reliability-lab-project\images\climate chamber.jpg" class="test-img">

<div class="card-body">

<h5>SOUTHERN CLIMATE CHAMBER</h5>

<p class="why"><b>Why Test:</b> Performs environmental simulation including cyclic temperature and humidity testing to ensure product reliability in tropical conditions.</p>

<p class="spec">
Temp Range : -40°C to +150°C<br>
Humidity : 20% – 95% RH<br>
Control Accuracy : ±1°C<br>
Applications : ECU, sensors, alternators
</p>

</div>
</div>
</div>

<!-- Climatic -->
<div class="col">
<div class="card test-card">

<img src="D:\full-stack-developer\proving-reliability-lab-project\images\climate chamber.png" class="test-img">

<div class="card-body">

<h5>CLIMATIC CHAMBER</h5>

<p class="why"><b>Why Test:</b> Simulates real environmental conditions including humidity.</p>

<p class="spec">
Temp Range : -70°C to 180°C<br>
Humidity : 10%–98% RH<br>
Capacity : 1000L
</p>

</div>
</div>
</div>

<!-- Climatic -->
<div class="col">
<div class="card test-card">

<img src="D:\full-stack-developer\proving-reliability-lab-project\images\ice water.jpg" class="test-img">

<div class="card-body">

<h5>ICE WATER SHOCK</h5>

<p class="why"><b>Why Test:</b> Simulates sudden exposure of hot components to ice-cold water, checking for thermal cracking, sealing failure, and material deformation.</p>

<p class="spec">
Hot Condition : 80°C – 120°C<br>
Water Temp : 0°C – 5°C<br>
Immersion Time : 5–10 min<br>
Cycles : 20–100 cycles
</p>

</div>
</div>
</div>

<!-- Oven -->
<div class="col">
<div class="card test-card">

<img src="D:\full-stack-developer\proving-reliability-lab-project\images\oven.jpg" class="test-img">

<div class="card-body">

<h5>OVEN</h5>
<p class="why"><b>Why Test:</b> Validates high-temperature endurance, aging, and continuous operation performance of components.</p>

<p class="spec">
Temp Range : Ambient to 250°C<br>
Uniformity : ±2°C<br>
Air Circulation : Forced convection<br>
Application : Motors, stators, insulation
</p>

</div>
</div>
</div>

<!-- Freezer -->
<div class="col">
<div class="card test-card">

<img src="D:\full-stack-developer\proving-reliability-lab-project\images\freezer.png" class="test-img">

<div class="card-body">

<h5>FREEZER</h5>

<p class="why"><b>Why Test:</b> Validates cold start and operation at sub-zero temperatures.</p>

<p class="spec">
Temp Range : 0 to -60°C<br>
Used For : Motors & Controllers
</p>

</div>
</div>
</div>

</div>

<!-- ================= WATER ================= -->

<h3 class="section-title">WATER INGRESS TESTING</h3>

<div class="row row-cols-1 row-cols-md-4 g-4">

<div class="col">
<div class="card test-card">
<img src="D:\full-stack-developer\proving-reliability-lab-project\images\is ws.png" class="test-img">
<div class="card-body">
<h5>IS/DIN WATERSPRAY</h5>
<p class="why"><b>Why Test:</b> Validates water protection under spray conditions.</p>
<p class="spec">Pressure : 0.5 – 4 Bar<br>Table Rotation : 1–3 RPM</p>
</div>
</div>
</div>

<div class="col">
<div class="card test-card">
<img src="D:\full-stack-developer\proving-reliability-lab-project\images\jis ws.png" class="test-img">
<div class="card-body">
<h5>JIS WATERSPRAY</h5>
<p class="why"><b>Why Test:</b> Japanese standard for water ingress testing.</p>
<p class="spec">Nozzle : 40<br>Table Rotation : 17 RPM</p>
</div>
</div>
</div>

<div class="col">
<div class="card test-card">
<img src="D:\full-stack-developer\proving-reliability-lab-project\images\ipx 9k .png" class="test-img">
<div class="card-body">
<h5>IPX9K WATERSPRAY</h5>
<p class="why"><b>Why Test:</b> High pressure hot water exposure.</p>
<p class="spec">Pressure : 80–100 Bar<br>Temp : 80°C</p>
</div>
</div>
</div>

<div class="col">
<div class="card test-card">
<img src="D:\full-stack-developer\proving-reliability-lab-project\images\adc es.jpg" class="test-img">
<div class="card-body">
<h5>ADC WATER SPRAY</h5>
<p class="why"><b>Why Test:</b> Simulates real vehicle washing and heavy rain conditions to verify sealing and water ingress protection.</p>
<p class="spec">
Pressure : 1 – 10 Bar<br>
Flow Rate : 10 – 25 L/min<br>
Nozzle Type : Multi-angle spray<br>
Test Duration : 5–30 min
</p>
</div>
</div>
</div>


<div class="col">
<div class="card test-card">
<img src="D:\full-stack-developer\proving-reliability-lab-project\images\immresion.jpg" class="test-img">
<div class="card-body">
<h5>WATER IMMERSION TEST RIG</h5>
<p class="why"><b>Why Test:</b> Checks sealing integrity by immersing components in water to detect leakage and failure under submerged conditions.</p>
<p class="spec">
Depth : 0.5 – 1 meter<br>
Duration : 30 min – 24 hrs<br>
Water Temp : Ambient / Heated<br>
Standard : IPX7 / IPX8
</p>
</div>
</div>
</div>

<div class="col">
<div class="card test-card">
<img src="D:\full-stack-developer\proving-reliability-lab-project\images\IPX TEST.png" class="test-img">
<div class="card-body">
<h5>IPX5 / IPX6 TEST</h5>
<p class="why"><b>Why Test:</b> Protection against powerful water jets.</p>
<p class="spec">Flow : 12.5 – 100 L/min</p>
</div>
</div>
</div>

<div class="col">
<div class="card test-card">
<img src="D:\full-stack-developer\proving-reliability-lab-project\images\HIGH PRESSURE WATER JET TEST.png" class="test-img">
<div class="card-body">
<h5>HIGH PRESSURE WATER JET</h5>
<p class="why"><b>Why Test:</b> Simulates heavy rain and vehicle washing.</p>
<p class="spec">Max Pressure : 350 Bar</p>
</div>
</div>
</div>

</div>

<!-- ================= DUST ================= -->

<h3 class="section-title">DUST TESTING</h3>

<div class="row row-cols-1 row-cols-md-4 g-4">

<div class="col">
<div class="card test-card">
<img src="D:\full-stack-developer\proving-reliability-lab-project\images\is dust.png" class="test-img">
<div class="card-body">
<h5>IS DUST CHAMBER</h5>
<p class="why"><b>Why Test:</b> Simulates dusty road environments.</p>
<p class="spec">Temp : 40°C<br>Dust : Arizona / Cement</p>
</div>
</div>
</div>

<div class="col">
<div class="card test-card">
<img src="D:\full-stack-developer\proving-reliability-lab-project\images\jis dust.png" class="test-img">
<div class="card-body">
<h5>JIS DUST CHAMBER</h5>
<p class="why"><b>Why Test:</b> Japanese standard dust reliability test.</p>
<p class="spec">Dust : 100–600 mg/m³</p>
</div>
</div>
</div>

</div>

<!-- ================= CORROSION ================= -->

<h3 class="section-title">CORROSION TESTING</h3>

<div class="row row-cols-1 row-cols-md-4 g-4">

<div class="col">
<div class="card test-card">

<img src="D:\full-stack-developer\proving-reliability-lab-project\images\salt spray.png" class="test-img">

<div class="card-body">

<h5>SALT SPRAY CHAMBER</h5>

<p class="why"><b>Why Test:</b> Evaluates corrosion resistance.</p>

<p class="spec">
Temp : up to 55°C<br>
Pressure : 1–25 PSI
</p>

</div>
</div>
</div>
</div>


<div class="col cols-row--1 row-cols-md-4 g-4">

<div class="col">
<div class="card test-card">

<img src="D:\full-stack-developer\proving-reliability-lab-project\images\adc salt spray.jpg" class="test-img">

<div class="card-body">

<h5>ADC SLAT SPRAY</h5>

<p class="why"><b>Why Test:</b> Evaluates corrosion resistance.</p>

<p class="spec">
Temp : up to 55°C<br>
Pressure : 1–25 PSI
</p>

</div>
</div>
</div>

</div>
<!-- ================= MUD ================= -->

<h3 class="section-title">MUD SPLASH TESTING</h3>

<div class="row row-cols-1 row-cols-md-4 g-4">

<div class="col">
<div class="card test-card">

<img src="D:\full-stack-developer\proving-reliability-lab-project\images\mud test.png" class="test-img">

<div class="card-body">

<h5>MUD SPLASH</h5>

<p class="why"><b>Why Test:</b> Simulates muddy road splash conditions.</p>

<p class="spec">
Mud Concentration : 5–20%<br>
Drive Speed : 10000 RPM
</p>

</div>
</div>
</div>

</div>

</div>

</template>


<style>

.title-bar{
background:#0f172a;
color:white;
text-align:center;
padding:25px;
}

.section-title{
margin-top:50px;
margin-bottom:20px;
color:#1e3a8a;
font-weight:bold;
border-left:5px solid #2563eb;
padding-left:12px;
}

.test-card{
border:none;
border-radius:10px;
transition:0.3s;
box-shadow:0 5px 15px rgba(0,0,0,0.15);
}

.test-card:hover{
transform:translateY(-8px);
box-shadow:0 12px 25px rgba(0,0,0,0.25);
}

.test-img{
width:100%;
height:220px;
object-fit:cover;
border-top-left-radius:10px;
border-top-right-radius:10px;
}

.why{
font-size:14px;
color:#374151;
}

.spec{
font-size:13px;
color:#555;
}

</style>