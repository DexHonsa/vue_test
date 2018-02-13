<template>
  <div class="tab-stage-content animated-fast fadeIn"><div class="tab-stage-content-title">Companies
    <div class="gear-btn dropdown-btn">
      <i class="fa fa-gear" />
    </div>
  </div>
  <div class="tab-stage-content-title-date">January 10, 2018</div>
  <div class="project-tab-container">
    <!-- <ul>
      <li>Project</li>
      <li>Mine</li>
      <li>Supplier</li>

    </ul> -->
  </div>
  <div class="project-tab-inner">
    <div class="project-view-left">
      <div class="project-view-item">
        <div class="project-view-top">
        <div class="project-view-title">Company List</div>
        </div>
        <div class="project-view-inner">
          <table  class="project-view-table">
            <tbody>
              <tr>
                <th>Name</th>
                <th>Company Address</th>
                <th>Geo Code</th>
                <th>Domain</th>
              </tr>
              <tr v-for="company in companies" :key="company.id">
                <td><i class="fa fa-building-o"></i> {{company.company_name}}</td>
                <td>{{company.address1}}, {{company.city}} {{company.state}} {{company.zip}} </td>
                <td>{{company.geo_code}}</td>
                <td>{{company.domain}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import axios from "axios";
import getHeaders from "../../config.js";
export default {
  name: "companies",
  data: () => ({
    companies: []
  }),
  methods: {},
  mounted() {
    axios
      .get("http://40.65.104.52:8080/v1/companys", { headers: getHeaders() })
      .then(
        res => {
          this.companies = res.data.items;
        },
        err => {
          console.log(err);
        }
      );
  }
};
</script>
