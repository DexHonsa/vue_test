<template>
  <div class="tab-stage-content animated-fast fadeIn"><div class="tab-stage-content-title">Projects
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
        <div class="project-view-title">Project List</div>
        </div>
        <div class="project-view-inner">
          <table  class="project-view-table">
            <tbody>
              <tr>
                <th>Project Code</th>
                <th>Project Name</th>
                <th>Project Created</th>

              </tr>
              <tr v-for="project in projects">
                <td> {{project.project_code}}</td>
                <td><i class="fa fa-folder-o"></i> {{project.project_name}}</td>
                <td>{{project.created_at}}</td>

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
  name: "projects",
  data: () => ({
    projects: []
  }),
  methods: {},
  mounted() {
    axios
      .get("http://40.65.104.52:8080/v1/projects", { headers: getHeaders() })
      .then(
        res => {
          this.projects = res.data.items;
          console.log(res.data.items);
        },
        err => {
          console.log(err);
        }
      );
  }
};
</script>
