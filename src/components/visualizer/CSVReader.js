let lineIndex = 0;
let lines = [];
let fields = [];
const entry = {};
let nbFields = 0;
const numberFields = [];

function read(content) {
  lines = content.split("\n");
  fields = lines[0].split(",").map(s => s.trim());
  nbFields = fields.length;
  lineIndex++;
}

function next() {
  const line = lines[lineIndex];
  lineIndex++;
  if (line) {
    const tokens = line.split(",");
    for (let i = 0; i < nbFields; i++) {
      entry[fields[i]] = tokens[i];
    }

    // Convert to numbers
    let count = numberFields.length;
    while (count--) {
      const name = numberFields[count];
      entry[name] = Number(entry[name]);
    }

    return entry;
  }
  return null;
}

function get() {
  return entry;
}

function hasNext() {
  return !!lines[lineIndex];
}

function getFields() {
  return fields;
}

function setNumberFields(...nFields) {
  for (let i = 0; i < nFields.length; i++) {
    numberFields.push(nFields[i]);
  }
}

export default {
  read,
  next,
  get,
  hasNext,
  getFields,
  setNumberFields
};
