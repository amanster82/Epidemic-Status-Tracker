
export const getBackendURL = function() {

  let base = process.env.REACT_APP_API_URL || "";

  if (base === "") {
    const splits = window.location.href.split(":");
    base = splits[0] + ":" + splits[1] + ":9000";
  }

  return base;
}
