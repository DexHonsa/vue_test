import _ from "lodash";

import macro from "vtk.js/Sources/macro";
import vtkPolyData from "vtk.js/Sources/Common/DataModel/PolyData";

// ----------------------------------------------------------------------------
// vtkDataCloudSource methods
// ----------------------------------------------------------------------------

function vtkThresholdFilter(publicAPI, model) {
  // Set our className
  model.classHierarchy.push("vtkThresholdFilter");

  publicAPI.requestData = (inData, outData) => {
    outData[0] = inData[0];
    // if (!model.fieldToFilter) {
    //   return 0;
    // }

    const newDataSet = vtkPolyData.newInstance();
    newDataSet.shallowCopy(inData[0]);
    outData[0] = newDataSet;

    const arrayToFilterBy = inData[0]
      .getPointData()
      .getArrayByName(model.fieldToFilter);

    const benchArray = inData[0].getPointData().getArrayByName("Bench");

    const patternArray = inData[0].getPointData().getArrayByName("Pattern");

    let offset = 1;
    const [min, max] = model.fieldRange;
    const benchIds = model.selectedBlocks;
    const patternIds = model.selectedPatterns;

    const skipBench = _.isEmpty(benchIds);
    const skipPattern = _.isEmpty(patternIds);

    const benchIdArray = (benchIds || "").split(",").map(val => Number(val));
    const patternIdArray = (patternIds || "")
      .split(",")
      .map(val => Number(val));
    var skipValuesToFilter = false;
    var valuesToFilter;

    if (arrayToFilterBy) {
      valuesToFilter = arrayToFilterBy.getData();
    } else {
      skipValuesToFilter = true;
    }
    const benchValues = benchArray.getData();
    const patternValues = patternArray.getData();

    const nbPoints = newDataSet.getPoints().getNumberOfPoints();

    const newVerts = new Uint32Array(nbPoints + 1);

    for (let pIdx = 0; pIdx < nbPoints; pIdx++) {
      var isInFieldRange =
        skipValuesToFilter || _.inRange(valuesToFilter[pIdx], min, max);
      // var isInFieldRange = _.inRange(valuesToFilter[pIdx], min, max);
      var isBenchIncluded =
        skipBench || _.includes(benchIds, benchValues[pIdx]);
      var isPatternIncluded =
        skipPattern || _.includes(patternIds, patternValues[pIdx]);

      if (isInFieldRange && isBenchIncluded && isPatternIncluded) {
        newVerts[offset++] = pIdx;
      }
    }
    newVerts[0] = offset - 1;
    newDataSet.getVerts().setData(new Uint32Array(newVerts.buffer, 0, offset));

    // return 1;
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  fieldToFilter: "",
  fieldRange: [0, 1]
};

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // vtkObject
  macro.obj(publicAPI, model);
  macro.algo(publicAPI, model, 1, 1);
  macro.setGet(publicAPI, model, ["fieldToFilter"]);
  macro.setGetArray(publicAPI, model, ["fieldRange"], 2, [0, 1]);

  macro.setGet(publicAPI, model, ["selectedBlocks"]);
  macro.setGet(publicAPI, model, ["selectedPatterns"]);

  // Object specific methods
  vtkThresholdFilter(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, "vtkThresholdFilter");

// ----------------------------------------------------------------------------

export default { newInstance, extend };
