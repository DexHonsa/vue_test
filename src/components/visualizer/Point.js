import vtkActor from "vtk.js/Sources/Rendering/Core/Actor";

import vtkColorMaps from "vtk.js/Sources/Rendering/Core/ColorTransferFunction/ColorMaps";
import vtkColorTransferFunction from "vtk.js/Sources/Rendering/Core/ColorTransferFunction";

import vtkInteractorStyleManipulator from "vtk.js/Sources/Interaction/Style/InteractorStyleManipulator";

import vtkOpenGLRenderWindow from "vtk.js/Sources/Rendering/OpenGL/RenderWindow";
import vtkRenderWindow from "vtk.js/Sources/Rendering/Core/RenderWindow";
import vtkRenderWindowInteractor from "vtk.js/Sources/Rendering/Core/RenderWindowInteractor";
import vtkRenderer from "vtk.js/Sources/Rendering/Core/Renderer";

import vtkMapper from "vtk.js/Sources/Rendering/Core/Mapper";

import vtkOutlineFilter from "vtk.js/Sources/Filters/General/OutlineFilter";

import vtkPointPicker from "vtk.js/Sources/Rendering/Core/PointPicker";

import vtkTrackballPan from "vtk.js/Sources/Interaction/Manipulators/TrackballPan";
import vtkTrackballRoll from "vtk.js/Sources/Interaction/Manipulators/TrackballRoll";
import vtkTrackballRotate from "vtk.js/Sources/Interaction/Manipulators/TrackballRotate";
import vtkTrackballZoom from "vtk.js/Sources/Interaction/Manipulators/TrackballZoom";

import vtkCubeSource from "vtk.js/Sources/Filters/Sources/CubeSource";

import vtkAnnotatedCubeActor from "vtk.js/Sources/Rendering/Core/AnnotatedCubeActor";
import vtkOrientationMarkerWidget from "vtk.js/Sources/Interaction/Widgets/OrientationMarkerWidget";

// import controlPanel from './controller.html';

import vtkDataCloudSource from "./DataCloudSource";
import vtkThresholdFilter from "./ThresholdFilter";
import vtkCSVReader from "./CSVReader";

// vtkCSVReader.read(data);
vtkCSVReader.setNumberFields(
  "Bench",
  "Pattern",
  "Northing (Actual)",
  "Easting (Actual)",
  "Collar Elevation",
  "air_pressure",
  "blastability",
  "computed_elevation",
  "end_depth",
  "rop",
  "rpm",
  "torque",
  "vibration",
  "weight_on_bit",
  "MSE"
);

// ----------------------------------------------------------------------------
// Standard rendering code setup
// ----------------------------------------------------------------------------

export function init_mwd(canvasContainer) {
  const renderWindow = vtkRenderWindow.newInstance();

  const renderer = vtkRenderer.newInstance({ background: [1, 1, 1] });
  renderWindow.addRenderer(renderer);

  const windowProps = {
    size: [canvasContainer.clientWidth, canvasContainer.clientHeight]
  };

  const openGLRenderWindow = vtkOpenGLRenderWindow.newInstance(windowProps);

  renderWindow.addView(openGLRenderWindow);
  openGLRenderWindow.setContainer(canvasContainer);

  const interactor = vtkRenderWindowInteractor.newInstance();
  interactor.setView(openGLRenderWindow);

  const camera = renderer.getActiveCamera();

  camera.set({
    viewUp: [0, 0, -1],
    focalPoint: [0, 0, 0],
    position: [1, 0, 0]
  });

  // Update interaction
  const interactorStyle = vtkInteractorStyleManipulator.newInstance();

  // Rotate
  interactorStyle.addManipulator(vtkTrackballRotate.newInstance());
  // Pan
  interactorStyle.addManipulator(vtkTrackballPan.newInstance({ shift: true }));
  // Zoom
  interactorStyle.addManipulator(
    vtkTrackballZoom.newInstance({ control: true, pinch: true })
  );
  interactorStyle.addManipulator(vtkTrackballZoom.newInstance({ alt: true }));
  // Roll
  interactorStyle.addManipulator(
    vtkTrackballRoll.newInstance({ shift: true, control: true })
  );
  interactorStyle.addManipulator(
    vtkTrackballRoll.newInstance({ shift: true, alt: true })
  );

  // Setup interaction
  interactor.setInteractorStyle(interactorStyle);

  interactor.initialize();
  interactor.bindEvents(canvasContainer);

  function resetCamera() {
    camera.set({
      viewUp: [0, 0, 1],
      focalPoint: [0, 0, 0],
      position: [1, 0, 0]
    });
    renderer.resetCamera();
    renderer.resetCameraClippingRange();
    interactorStyle.setCenterOfRotation(camera.getFocalPoint());
    renderWindow.render();
  }

  // ----------------------------------------------------------------------------
  // VTK Pipeline
  // ----------------------------------------------------------------------------

  const dataRange = [0, 100];
  const lutName = "erdc_rainbow_bright";
  const lookupTable = vtkColorTransferFunction.newInstance();

  const source = vtkDataCloudSource.newInstance({
    currentSize: 2000000,
    increaseSize: 2000000,
    generateCells: true
  });

  source.updateFields({
    "Collar Elevation": 1,
    air_pressure: 1,
    blastability: 1,
    rop: 1,
    rpm: 1,
    torque: 1,
    vibration: 1,
    weight_on_bit: 1,
    MSE: 1,
    Pattern: 1,
    Bench: 1
  });

  const filter = vtkThresholdFilter.newInstance();
  filter.setInputConnection(source.getOutputPort());

  const mapper = vtkMapper.newInstance({
    useLookupTableScalarRange: true,
    lookupTable
  });
  mapper.setInputConnection(filter.getOutputPort());

  const actor = vtkActor.newInstance();
  actor.setMapper(mapper);

  renderer.addActor(actor);
  actor.getProperty().setPointSize(5);

  // ----------------------------------------------------------------------------
  // Add bounding box
  // ----------------------------------------------------------------------------

  const outline = vtkOutlineFilter.newInstance();
  outline.setInputConnection(source.getOutputPort());

  const outlineMapper = vtkMapper.newInstance();
  outlineMapper.setInputConnection(outline.getOutputPort());

  const outlineActor = vtkActor.newInstance();
  outlineActor.setMapper(outlineMapper);

  // Black
  outlineActor.getProperty().setDiffuseColor(0, 0, 0);

  renderer.addActor(outlineActor);

  // ----------------------------------------------------------------------------
  // Add Orientation Marker
  // ----------------------------------------------------------------------------

  const axes = vtkAnnotatedCubeActor.newInstance();
  axes.setDefaultStyle({
    text: "+X",
    fontStyle: "bold",
    fontFamily: "Arial",
    fontColor: "black",
    fontSizeScale: res => res / 2,
    faceColor: "#0000ff",
    faceRotation: 0,
    edgeThickness: 0.1,
    edgeColor: "black",
    resolution: 400
  });
  // axes.setXPlusFaceProperty({ text: '+X' });
  axes.setXMinusFaceProperty({
    text: "-X",
    faceColor: "#ffff00",
    faceRotation: 90,
    fontStyle: "italic"
  });
  axes.setYPlusFaceProperty({
    text: "+Y",
    faceColor: "#00ff00",
    fontSizeScale: res => res / 4
  });
  axes.setYMinusFaceProperty({
    text: "-Y",
    faceColor: "#00ffff",
    fontColor: "white"
  });
  axes.setZPlusFaceProperty({
    text: "+Z",
    edgeColor: "yellow"
  });
  axes.setZMinusFaceProperty({
    text: "-Z",
    faceRotation: 45,
    edgeThickness: 0
  });

  // create orientation widget
  const orientationWidget = vtkOrientationMarkerWidget.newInstance({
    actor: axes,
    interactor: renderWindow.getInteractor()
  });
  orientationWidget.setEnabled(true);
  orientationWidget.setViewportCorner(
    vtkOrientationMarkerWidget.Corners.BOTTOM_RIGHT
  );
  orientationWidget.setViewportSize(0.15);
  orientationWidget.setMinPixelSize(100);
  orientationWidget.setMaxPixelSize(300);

  // ----------------------------------------------------------------------------
  // UI control handling
  // ----------------------------------------------------------------------------

  // fullScreenRenderer.addController(controlPanel);

  // DOM elements
  const sizeOutput = document.querySelector(".sizeOutput");
  const presetSelector = document.querySelector(".presets");
  const fieldSelector = document.querySelector(".fields");
  const refreshSelector = document.querySelector(".refresh");
  const resetCameraSelector = document.querySelector(".resetCamera");
  const boundsContainer = document.querySelector(".bounds");
  const scalarbar = document.querySelector(".scalarbar");
  const minDataRange = document.querySelector(".minDataRange");
  const maxDataRange = document.querySelector(".maxDataRange");
  const pickOutput = document.querySelector(".pickOutput");

  const fieldFilterSelector = document.querySelector(".filterFields");
  const thresholdMinSelector = document.querySelector(".minThreshold");
  const thresholdMaxSelector = document.querySelector(".maxThreshold");

  // Color map presets
  presetSelector.innerHTML = vtkColorMaps.rgbPresetNames
    .map(
      name =>
        `<option value="${name}" ${
          lutName === name ? 'selected="selected"' : ""
        }>${name}</option>`
    )
    .join("");

  // Field to color by
  fieldSelector.innerHTML = source
    .getFieldNames()
    .map(
      name =>
        `<option value="${name}" ${
          lutName === name ? 'selected="selected"' : ""
        }>${name}</option>`
    )
    .join("");

  fieldFilterSelector.innerHTML = source
    .getFieldNames()
    .map(
      name =>
        `<option value="${name}" ${
          lutName === name ? 'selected="selected"' : ""
        }>${name}</option>`
    )
    .join("");

  // ----------------------------------------------------------------------------
  // Filter handling
  // ----------------------------------------------------------------------------

  fieldFilterSelector.addEventListener("change", e => {
    filter.setFieldToFilter(e.target.value);
    renderWindow.render();
  });

  thresholdMinSelector.addEventListener("change", e => {
    const originalRange = filter.getFieldRange();
    originalRange[0] = Number(e.target.value);
    filter.setFieldRange(originalRange);
    renderWindow.render();
  });

  thresholdMaxSelector.addEventListener("change", e => {
    const originalRange = filter.getFieldRange();
    originalRange[1] = Number(e.target.value);
    filter.setFieldRange(originalRange);
    renderWindow.render();
  });

  // ----------------------------------------------------------------------------
  // Create arrow point picking highlight
  // ----------------------------------------------------------------------------

  const cubeSource = vtkCubeSource.newInstance({
    xLength: 2.5,
    yLength: 2.5,
    zLength: 2.5
  });

  const cubeMapper = vtkMapper.newInstance();
  cubeMapper.setInputConnection(cubeSource.getOutputPort());

  const cubeActor = vtkActor.newInstance({ pickable: false });
  cubeActor.setMapper(cubeMapper);
  cubeActor.getProperty().setDiffuseColor(0, 0, 0);

  renderer.addActor(cubeActor);

  // ----------------------------------------------------------------------------
  // Picking
  // ----------------------------------------------------------------------------

  function printPickedPointInfo(idx) {
    if (idx === -1) {
      pickOutput.innerHTML = "";
      return;
    }
    const polydata = source.getOutputData();
    const output = source.getFieldNames().map(
      name =>
        `${name}: ${
          polydata
            .getPointData()
            .getArrayByName(name)
            .getData()[idx]
        }`
    );

    pickOutput.innerHTML = output.join("<br>");

    cubeSource.setCenter(
      polydata.getPoints().getData()[idx * 3],
      polydata.getPoints().getData()[idx * 3 + 1],
      polydata.getPoints().getData()[idx * 3 + 2]
    );
    renderWindow.render();
  }

  const picker = vtkPointPicker.newInstance({ tolerance: 0.001 });
  interactor.setPicker(picker);
  picker.onPickChange(pos => {
    if (picker.getPointId() !== -1) {
      printPickedPointInfo(picker.getPointId());
    }
  });

  canvasContainer.addEventListener("mousemove", event => {
    const { pageX, pageY } = event;
    const height = openGLRenderWindow.getSize()[1];
    const { top, left } = openGLRenderWindow.getCanvas().getClientRects()[0];
    // console.log(picker.getTolerance());
    picker.pick([pageX - left, height - (pageY - top), 0], renderer);
  });

  // ----------------------------------------------------------------------------
  // Update scalar bar
  // ----------------------------------------------------------------------------

  function updateScalarBar() {
    minDataRange.innerHTML = dataRange[0];
    maxDataRange.innerHTML = dataRange[1];
    const ctx = scalarbar.getContext("2d");
    const nbSample = Number(scalarbar.width);
    const rawData = lookupTable.getUint8Table(
      dataRange[0],
      dataRange[1],
      nbSample,
      true
    );
    const pixelsArea = ctx.getImageData(0, 0, nbSample, 1);
    pixelsArea.data.set(rawData);
    ctx.putImageData(pixelsArea, 0, 0);
  }

  // ----------------------------------------------------------------------------
  // Color handling
  // ----------------------------------------------------------------------------

  function applyPreset() {
    const preset = vtkColorMaps.getPresetByName(presetSelector.value);
    lookupTable.applyColorMap(preset);
    lookupTable.setMappingRange(dataRange[0], dataRange[1]);
    lookupTable.updateRange();
    renderWindow.render();
    updateScalarBar();
  }
  applyPreset();
  presetSelector.addEventListener("change", applyPreset);

  function updateColorBy() {
    const colorByArrayName = fieldSelector.value;
    let colorMode = vtkMapper.ColorMode.DEFAULT;
    let scalarMode = vtkMapper.ScalarMode.DEFAULT;
    const activeArray = source
      .getOutputData()
      .getPointData()
      .getArrayByName(colorByArrayName);
    const newDataRange = activeArray.getRange();
    dataRange[0] = newDataRange[0];
    dataRange[1] = newDataRange[1];
    colorMode = vtkMapper.ColorMode.MAP_SCALARS;
    scalarMode = vtkMapper.ScalarMode.USE_POINT_FIELD_DATA;
    mapper.set({
      colorByArrayName,
      colorMode,
      scalarMode
    });
    applyPreset();
  }
  fieldSelector.addEventListener("change", updateColorBy);
  updateColorBy();

  // Click
  refreshSelector.addEventListener("click", updateColorBy);
  resetCameraSelector.addEventListener("click", resetCamera);

  // ----------------------------------------------------------------------------
  // Update bounds information
  // ----------------------------------------------------------------------------

  function updateDataBounds() {
    const bounds = source.getOutputData().getBounds();
    boundsContainer.innerHTML = `X[${bounds[0]},${bounds[1]}]<br>Y[${
      bounds[2]
    },${bounds[3]}]<br>Z[${bounds[4]},${bounds[5]}]`;
  }

  // ----------------------------------------------------------------------------
  // Data loading
  // ----------------------------------------------------------------------------

  function addData(entry, dataCloudSource) {
    dataCloudSource.addPoint(
      entry.computed_elevation,
      entry["Northing (Actual)"],
      entry["Easting (Actual)"],
      entry
    );
  }

  const chunkSize = 2000000;
  let firstTime = true;
  function processNextChunk() {
    for (let i = 0; i < chunkSize && vtkCSVReader.hasNext(); i++) {
      const entry = vtkCSVReader.next();
      if (entry) {
        addData(entry, source);
      }
    }
    source.pushData();
    source.update();
    updateDataBounds();
    sizeOutput.innerHTML = source.getNumberOfPoints();
    renderWindow.render();
    if (firstTime) {
      resetCamera();
      firstTime = false;
    }

    if (vtkCSVReader.hasNext()) {
      setTimeout(processNextChunk, 10);
    } else {
      sizeOutput.innerHTML += " - Done...";
    }
  }

  return {
    vtkCSVReader: vtkCSVReader,
    processNextChunk: processNextChunk,
    renderWindow: renderWindow,
    filter: filter
  };
}
