import macro from "vtk.js/Sources/macro";
import vtkPolyData from "vtk.js/Sources/Common/DataModel/PolyData";
import vtkDataArray from "vtk.js/Sources/Common/Core/DataArray";

// ----------------------------------------------------------------------------
// vtkDataCloudSource methods
// ----------------------------------------------------------------------------

function vtkDataCloudSource(publicAPI, model) {
  // Set our className
  model.classHierarchy.push("vtkDataCloudSource");

  if (!model.fieldsComponents) {
    model.fieldsComponents = {};
  }

  if (!model.dataset) {
    model.dataset = vtkPolyData.newInstance();
  }

  if (!model.dataArrays) {
    model.dataArrays = {};
    model.dataArrays.points = new Float64Array(model.currentSize * 3);
    if (model.generateCells) {
      model.dataArrays.verts = new Uint32Array(model.currentSize + 1);
      let count = model.dataArrays.verts.length;
      while (count--) {
        model.dataArrays.verts[count] = count - 1;
      }
      model.dataArrays.verts[0] = 0;
    }
  }

  function increaseBufferSize() {
    const newDataArrays = {};

    // Points
    newDataArrays.points = new Float64Array(
      model.dataArrays.points.length + model.increaseSize * 3
    );
    newDataArrays.points.set(model.dataArrays.points);

    // Cells
    if (model.dataArrays.verts) {
      newDataArrays.verts = new Uint32Array(
        model.dataArrays.verts.length + model.increaseSize
      );
      let count = newDataArrays.verts.length;
      while (count--) {
        newDataArrays.verts[count] = count - 1;
      }
      newDataArrays.verts[0] = 0;
    }

    // Fields
    const expectedFieldNames = Object.keys(model.fieldsComponents);
    for (let i = 0; i < expectedFieldNames.length; i++) {
      const name = expectedFieldNames[i];
      newDataArrays[name] = new Float32Array(
        model.dataArrays[name].length +
          model.increaseSize * model.fieldsComponents[name]
      );
      newDataArrays[name].set(model.dataArrays[name]);
    }
    model.dataArrays = newDataArrays;
    model.currentSize += model.increaseSize;
  }

  publicAPI.updateFields = fieldsComponents => {
    model.fieldsComponents = fieldsComponents;
    const expectedFieldNames = Object.keys(model.fieldsComponents);
    for (let i = 0; i < expectedFieldNames.length; i++) {
      const name = expectedFieldNames[i];
      if (!model.dataArrays[name]) {
        model.dataArrays[name] = new Float32Array(
          model.currentSize * model.fieldsComponents[name]
        );
        model.dataset.getPointData().addArray(
          vtkDataArray.newInstance({
            name,
            empty: true,
            dataType: "Float32Array",
            numberOfComponents: model.fieldsComponents[name]
          })
        );
      }
    }
  };

  publicAPI.addPoint = (x, y, z, fields) => {
    if (Number.isNaN(x) || Number.isNaN(y) || Number.isNaN(z)) {
      // console.log('skip invalide xyz', x, y, z);
      return; //
    }

    if (model.pointCount === model.currentSize) {
      increaseBufferSize();
    }

    if (!model.center) {
      model.center = [x, y, z];
    }

    const pOffset = model.pointCount * 3;
    model.dataArrays.points[pOffset] = x - model.center[0];
    model.dataArrays.points[pOffset + 1] = y - model.center[1];
    model.dataArrays.points[pOffset + 2] = z - model.center[2];

    const expectedFieldNames = Object.keys(model.fieldsComponents);
    for (let i = 0; i < expectedFieldNames.length; i++) {
      const name = expectedFieldNames[i];
      const nbComp = model.fieldsComponents[name];
      const offset = model.pointCount * nbComp;
      if (nbComp > 1) {
        for (let j = 0; j < nbComp; j++) {
          model.dataArrays[name][offset + j] = fields[name][j] || 0;
        }
      } else {
        model.dataArrays[name][offset] = fields[name];
      }
    }

    // Move to next spot
    model.pointCount++;
  };

  publicAPI.pushData = () => {
    if (model.pointCount !== model.outputPointCount) {
      publicAPI.modified();
    }
  };

  publicAPI.requestData = (inData, outData) => {
    if (model.deleted) {
      return;
    }

    model.outputPointCount = model.pointCount;
    model.dataset
      .getPoints()
      .setData(
        new Float64Array(
          model.dataArrays.points.buffer,
          0,
          model.outputPointCount * 3
        ),
        3
      );

    if (model.dataArrays.verts) {
      model.dataArrays.verts[0] = model.outputPointCount;
      model.dataset
        .getVerts()
        .setData(
          new Uint32Array(
            model.dataArrays.verts.buffer,
            0,
            model.outputPointCount + 1
          )
        );
    }

    const expectedFieldNames = Object.keys(model.fieldsComponents);
    for (let i = 0; i < expectedFieldNames.length; i++) {
      const name = expectedFieldNames[i];
      model.dataset
        .getPointData()
        .getArrayByName(name)
        .setData(
          new Float32Array(
            model.dataArrays[name].buffer,
            0,
            model.outputPointCount
          )
        );
    }
    model.dataset.modified();

    // Update output
    outData[0] = model.dataset;
  };

  publicAPI.getFieldNames = () => Object.keys(model.fieldsComponents);

  publicAPI.getNumberOfPoints = () => model.outputPointCount;
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  outputPointCount: 0,
  pointCount: 0,
  currentSize: 200000,
  increaseSize: 100000,
  generateCells: false
};

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // vtkObject
  macro.obj(publicAPI, model);
  macro.algo(publicAPI, model, 0, 1);

  // Object specific methods
  vtkDataCloudSource(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, "vtkDataCloudSource");

// ----------------------------------------------------------------------------

export default { newInstance, extend };
