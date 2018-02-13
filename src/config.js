export default function getHeaders() {
  var token = window.localStorage.getItem("auth");
  var headers = {
    Accept: "application/json",
    Authorization: "Bearer " + token
  };
  return headers;
}
