<template>
  <div class="visualizer-container">
    <div ref="canvasContainer" class="canvas-container">
    </div>
    <div class="control-panel-container">
      <div  class="minimize-icon">
        Controls

      </div>
      <table class="control-panel">
      <tbody>
        <tr>
          <td colSpan="2">
            <select class="presets" style="width: 100%">
            </select>
          </td>
        </tr>

        <tr>
          <td colSpan="2">
            <select class="fields" style="width: 100%">
            </select>
          </td>
        </tr>

        <tr>
          <td>
            Filter by Field
          </td>
          <td>
            <select class="filterFields" style="width: 100%">
            </select>
          </td>
        </tr>

        <tr>
          <td>
            <input type="number" class="minThreshold standard-input" defaultValue="0" style="width: 100%" />
          </td>
          <td>
            <input type="number" class="maxThreshold standard-input" defaultValue="1" style="width: 100%" />
          </td>
        </tr>

        <tr>
          <td>
            <button class="refresh" style="width: 100%">Update color range</button>
          </td>
          <td>
            <button class="resetCamera" style="width: 100%">Reset Camera</button>
          </td>
        </tr>

        <tr>
          <td colSpan="2" class="header-td">
            Number of data points
          </td>
        </tr>

        <tr>
        <td class="sizeOutput header-td">
        </td>
        </tr>

        <tr>
          <td class="bounds" colSpan="2">
          </td>
        </tr>

        <tr>
          <td colSpan="2">
            <canvas class="scalarbar" width="255" height="1" style="width: 100%, height: 20">
            </canvas></td>
        </tr>

        <tr style="display:none">
          <td class="minDataRange" style="text-align: left"></td>
          <td class="maxDataRange" style="text-align: right"></td>
        </tr>
      </tbody>
      </table>
    </div>
    <div class="pickOutput"></div>
  </div>
</template>
<script>
import { init_mwd } from "./Point.js";
import $ from "jquery";
//var csv = require("./mwd_data.csv");
export default {
  name: "visualizer",
  data: () => ({}),
  methods: {
    onCSVFileUpload: function() {
      const file = require("./mwd_data.csv");
      $.get(file, data => {
        //console.log("data: " + data);
        if (data) {
          this.vtkCSVReader.read(data); // response.data
          this.processNextChunk();
        }
      });
    }
  },
  mounted: function() {
    //console.log(this.$refs["canvasContainer"]);

    var vtkCSVReader, processNextChunk, renderWindow, filter;
    ({ vtkCSVReader, processNextChunk, renderWindow, filter } = init_mwd(
      this.$refs["canvasContainer"]
    ));

    this.vtkCSVReader = vtkCSVReader;
    this.processNextChunk = processNextChunk;
    this.renderWindow = renderWindow;
    this.filter = filter;
    this.onCSVFileUpload();
  }
};
</script>
