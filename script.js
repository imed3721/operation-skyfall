const versionDisplay = document.getElementById("deployment-version");
const refreshButton = document.getElementById("refresh-status");
const statusMessage = document.getElementById("status-message");

async function loadDeploymentVersion() {
  try {
    const response = await fetch("./version.json", { cache: "no-store" });

    if (!response.ok) {
      throw new Error("Version information is not available yet.");
    }

    const data = await response.json();

    if (typeof data.version !== "string" || !data.version.trim()) {
      throw new Error("Version information is invalid.");
    }

    versionDisplay.textContent = data.version;
    statusMessage.textContent = "Deployment version loaded successfully.";
  } catch {
    versionDisplay.textContent = "Not yet deployed";
    statusMessage.textContent =
      "Deployment version will appear after the first successful release.";
  }
}

refreshButton.addEventListener("click", loadDeploymentVersion);

loadDeploymentVersion();
