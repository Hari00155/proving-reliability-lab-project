<template>
  <div class="container mt-4">
    <h2 class="title">📝 Place Request</h2>

    <!-- ✅ SUCCESS MESSAGE -->
    <div v-if="requestNo" class="alert alert-success">
      ✅ Request Submitted Successfully <br>
      Request No: <b>{{ requestNo }}</b>
    </div>

    <form @submit.prevent="submitRequest" class="card p-4 shadow">
      
      <!-- USER & DEPT -->
      <div class="row mb-3">
        <div class="col">
          <label>User Name</label>
          <input class="form-control" v-model="form.userName" readonly />
        </div>

        <div class="col">
          <label>Department</label>
          <input class="form-control" v-model="form.deptId" readonly />
        </div>
      </div>

      <!-- DATE -->
      <div class="mb-3">
        <label>Date</label>
        <input type="date" class="form-control" v-model="form.date" required />
      </div>

      <!-- PART NO -->
      <div class="mb-3">
        <label>Part No</label>
        <select class="form-control" v-model="form.partNo" required>
          <option disabled value="">Select Part</option>
          <option>PN001</option>
          <option>PN002</option>
          <option>PN003</option>
        </select>
      </div>

      <!-- DESCRIPTION -->
      <div class="mb-3">
        <label>Description</label>
        <textarea class="form-control" v-model="form.description"></textarea>
      </div>

      <!-- PLATFORM -->
      <div class="mb-3">
        <label>Platform Code</label>
        <input class="form-control" v-model="form.platformCode" />
      </div>

      <!-- PRODUCT -->
      <div class="mb-3">
        <label>Product Code</label>
        <input class="form-control" v-model="form.productCode" />
      </div>

      <!-- CUSTOMER -->
      <div class="mb-3">
        <label>Customer</label>
        <input class="form-control" v-model="form.customer" />
      </div>

      <!-- SAMPLES -->
      <div class="mb-3">
        <label>No of Samples</label>
        <input type="number" class="form-control" v-model="form.samples" />
      </div>

      <!-- TEST TYPE -->
      <div class="mb-3">
        <label>Test Type</label>
        <select class="form-control" v-model="form.testType">
          <option>Design Verification/Validation</option>
          <option>Production Validation</option>
          <option>Special FE</option>
          <option>Development Related To Customer</option>
          <option>Warranty Analysis</option>
          <option>Field Failure Simulation</option>
          <option>Aspire</option>
          <option>Specification</option>
          <option>Development Related To Internal</option>
          <option>New Source</option>
          <option>CLR Analysis</option>
          <option>Enhanced Product Audit Test</option>
          <option>Road Proving</option>
          <option>MTR</option>
          <option>Fitment Sample</option>
          <option>Field Proving</option>
          <option>Field Proving (Proto Sample)</option>
          <option>Cost Reduction</option>
          <option>After Market Sample</option>
        </select>
      </div>

      <!-- CATEGORY -->
      <div class="mb-3">
        <label>Test Category</label>
        <select class="form-control" v-model="form.category">
          <option>Endurance</option>
          <option>Environment</option>
        </select>
      </div>

      <!-- DETAILS -->
      <div class="mb-3">
        <label>Test Details</label>
        <textarea class="form-control" v-model="form.testDetails"></textarea>
      </div>

      <!-- SPECIAL -->
      <div class="mb-3">
        <label>Special Features</label>
        <textarea class="form-control" v-model="form.special"></textarea>
      </div>

      <!-- CRITERIA -->
      <div class="mb-3">
        <label>Acceptance Criteria</label>
        <textarea class="form-control" v-model="form.criteria"></textarea>
      </div>

      <!-- SPEC -->
      <div class="mb-3">
        <label>Specification</label>
        <input class="form-control" v-model="form.spec" />
      </div>

      <!-- TEST NAME -->
      <div class="mb-3">
        <label>Test Name</label>
        <input class="form-control" v-model="form.testName" />
      </div>

      <!-- FILE -->
      <div class="mb-3">
        <label>Attachment</label>
        <input type="file" class="form-control" @change="handleFile" />
      </div>

      <!-- BUTTON -->
      <div class="text-end">
        <button class="btn btn-success me-2">Submit</button>
        <button type="button" class="btn btn-secondary" @click="resetForm">Reset</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'PlaceRequest',

  data() {
    return {
      requestNo: '',

      form: {
        date: new Date().toISOString().substr(0, 10),
        partNo: '',
        description: '',
        platformCode: '',
        productCode: '',
        customer: '',
        samples: '',
        testType: '',
        category: '',
        testDetails: '',
        special: '',
        criteria: '',
        spec: '',
        testName: '',
        file: null,
        userName: 'User',
        deptId: 'D001',
      },
    }
  },

  methods: {
    handleFile(e) {
      this.form.file = e.target.files[0]
    },

    async submitRequest() {
      try {
        const formData = new FormData()

        Object.keys(this.form).forEach((key) => {
          if (key !== 'file' && this.form[key]) {
            formData.append(key, this.form[key])
          }
        })

        if (this.form.file) {
          formData.append('attachment', this.form.file)
        }

        const res = await axios.post(
          'http://localhost:5000/api/requests',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        )

        // ✅ Backend returns { success: true, data: row }
        // so requestNo is inside res.data.data.requestNo
        this.requestNo = res.data.data.requestNo

        this.resetForm()

      } catch (err) {
        console.error('ERROR:', err.response?.data || err)
        alert('❌ Error submitting request')
      }
    },

    resetForm() {
      this.form = {
        date: new Date().toISOString().substr(0, 10),
        partNo: '',
        description: '',
        platformCode: '',
        productCode: '',
        customer: '',
        samples: '',
        testType: '',
        category: '',
        testDetails: '',
        special: '',
        criteria: '',
        spec: '',
        testName: '',
        file: null,
        userName: 'User',
        deptId: 'D001',
      }
    },
  },
}
</script>

<style>
.title {
  font-weight: bold;
  color: #2c3e50;
}

.card {
  border-radius: 12px;
}
</style>