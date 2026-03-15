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