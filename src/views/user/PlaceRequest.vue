<template>
  <div class="container">
    <h4 class="mb-4">Place Request Form</h4>

    <form @submit.prevent="submitRequest">
      <!-- DATE -->
      <div class="mb-3">
        <label>Today Date</label>
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

      <!-- PRODUCT DESCRIPTION -->
      <div class="mb-3">
        <label>Product Description</label>
        <textarea class="form-control" v-model="form.description"></textarea>
      </div>

      <!-- PLATFORM CODE -->
      <div class="mb-3">
        <label>Platform Code</label>
        <input type="text" class="form-control" v-model="form.platformCode" />
      </div>

      <!-- PRODUCT CODE -->
      <div class="mb-3">
        <label>Product Code</label>
        <input type="text" class="form-control" v-model="form.productCode" />
      </div>

      <!-- CUSTOMER -->
      <div class="mb-3">
        <label>Customer / Application Name</label>
        <input type="text" class="form-control" v-model="form.customer" />
      </div>

      <!-- NO OF SAMPLES -->
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

      <!-- TEST CATEGORY -->
      <div class="mb-3">
        <label>Test Category</label>
        <select class="form-control" v-model="form.category">
          <option>Endurance</option>
          <option>Environment</option>
        </select>
      </div>

      <!-- TEST DETAILS -->
      <div class="mb-3">
        <label>Test Details</label>
        <textarea class="form-control" v-model="form.testDetails"></textarea>
      </div>

      <!-- SPECIAL FEATURES -->
      <div class="mb-3">
        <label>Special Features & Purpose of Test</label>
        <textarea class="form-control" v-model="form.special"></textarea>
      </div>

      <!-- ACCEPTANCE CRITERIA -->
      <div class="mb-3">
        <label>Acceptance Criteria</label>
        <textarea class="form-control" v-model="form.criteria"></textarea>
      </div>

      <!-- SPECIFICATION -->
      <div class="mb-3">
        <label>Specification No / Class</label>
        <input type="text" class="form-control" v-model="form.spec" />
      </div>

      <!-- TEST NAME -->
      <div class="mb-3">
        <label>Test Name</label>
        <input type="text" class="form-control" v-model="form.testName" />
      </div>

      <!-- FILE UPLOAD -->
      <div class="mb-3">
        <label>Pre Test Data Attachment</label>
        <input type="file" class="form-control" @change="handleFile" />
      </div>

      <!-- BUTTONS -->
      <div class="d-flex gap-2">
        <button type="submit" class="btn btn-success">Submit</button>
        <button type="button" class="btn btn-secondary" @click="resetForm">
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "PlaceRequest",

  data() {
    return {
      form: {
        date: new Date().toISOString().substr(0, 10),
        partNo: "",
        description: "",
        platformCode: "",
        productCode: "",
        customer: "",
        samples: "",
        testType: "",
        category: "",
        testDetails: "",
        special: "",
        criteria: "",
        spec: "",
        testName: "",
        file: null
      }
    };
  },

  methods: {
    handleFile(e) {
      this.form.file = e.target.files[0];
    },

    async submitRequest() {
      try {
        const formData = new FormData();

        formData.append("date", this.form.date);
        formData.append("partNo", this.form.partNo);
        formData.append("description", this.form.description);
        formData.append("platformCode", this.form.platformCode);
        formData.append("productCode", this.form.productCode);
        formData.append("customer", this.form.customer);
        formData.append("samples", this.form.samples);
        formData.append("testType", this.form.testType);
        formData.append("category", this.form.category);
        formData.append("testDetails", this.form.testDetails);
        formData.append("special", this.form.special);
        formData.append("criteria", this.form.criteria);
        formData.append("spec", this.form.spec);
        formData.append("testName", this.form.testName);

        if (this.form.file) {
          formData.append("file", this.form.file);
        }

        await axios.post("http://localhost:5000/api/requests", formData);

        alert("Request saved ✅");

        this.resetForm();
      } catch (error) {
        console.error(error);
        alert("Error saving request ❌");
      }
    },

    resetForm() {
      this.form = {
        date: new Date().toISOString().substr(0, 10),
        partNo: "",
        description: "",
        platformCode: "",
        productCode: "",
        customer: "",
        samples: "",
        testType: "",
        category: "",
        testDetails: "",
        special: "",
        criteria: "",
        spec: "",
        testName: "",
        file: null
      };
    }
  }
};
</script>