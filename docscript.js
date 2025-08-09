document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("specialistForm");
  const previewCard = document.getElementById("previewCard");
  const successModal = document.getElementById("successModal");
  const closeModalBtn = document.getElementById("closeModalBtn");

  // Notification Bell
  const notificationToggle = document.getElementById("notificationToggle");
  const notificationPanel = document.getElementById("notificationPanel");
  const notificationText = document.getElementById("notificationText");
  const notificationBadge = document.getElementById("notificationBadge");

  notificationToggle.addEventListener("click", () => {
    notificationPanel.classList.toggle("hidden");
  });

  function updateNotificationCount(count) {
    notificationBadge.innerText = count;
  }

  // Simulate appointments
  setTimeout(() => {
    const appointments = [
      "Dr. Smith - 9:00 AM",
      "Dr. Raj - 10:30 AM",
      "Dr. Liu - 2:00 PM"
    ];
    notificationText.innerHTML = appointments.map(app => `<div>📅 ${app}</div>`).join("");
    updateNotificationCount(appointments.length);
  }, 1000);

  // Specialty Logic
  const specialty = document.getElementById("specialty");
  const customSpecialtyContainer = document.getElementById("customSpecialtyContainer");

  specialty.addEventListener("change", () => {
    customSpecialtyContainer.classList.toggle("hidden", specialty.value !== "Other");
  });

  // Add Hospital
  const addHospitalBtn = document.getElementById("addHospitalBtn");
  const hospitalAffiliationsContainer = document.getElementById("hospitalAffiliationsContainer");

  addHospitalBtn.addEventListener("click", () => {
    const entry = document.createElement("div");
    entry.classList.add("hospital-entry");
    entry.innerHTML = `
      <input name="hospitalName[]" placeholder="Hospital Name" class="form-input" />
      <input name="hospitalYears[]" type="number" placeholder="Years" min="0" class="form-input years"/>
    `;
    hospitalAffiliationsContainer.insertBefore(entry, addHospitalBtn);
  });

  // Email Hint
  const emailInput = document.getElementById("email");
  const hintMessage = document.getElementById("hintMessage");
  const correctedEmail = document.getElementById("correctedEmail");
  const errorMessage = document.getElementById("errorMessage");

  emailInput.addEventListener("blur", () => {
    const email = emailInput.value.trim();
    const commonDomains = ["gmail.com", "yahoo.com", "outlook.com"];
    const [user, domain] = email.split("@");
    if (domain && !commonDomains.includes(domain)) {
      const suggestion = commonDomains.find(d => d.startsWith(domain[0]));
      if (suggestion) {
        correctedEmail.innerText = `${user}@${suggestion}`;
        hintMessage.style.display = "block";
      }
    } else {
      hintMessage.style.display = "none";
    }
  });

  // Preview Generator
  function generatePreview(data) {
    previewCard.innerHTML = `
      <h3>${data.firstName} ${data.lastName}</h3>
      <p><strong>Specialty:</strong> ${data.specialty}</p>
      <p><strong>Experience:</strong> ${data.yearsOfExperience} years</p>
      <p><strong>Hospitals:</strong><br>${data.hospitals.join("<br>")}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.countryCode} ${data.phone}</p>
    `;
  }

  // Validation Helpers
  function validateName(name, min = 1) {
    return /^[A-Za-z]{1,}$/.test(name.trim());
  }

  function validateExperience(value) {
    return value >= 0 && value <= 30;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Input values
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const specialtyVal = specialty.value === "Other" ? document.getElementById("customSpecialty").value.trim() : specialty.value;
    const licenseNumber = document.getElementById("licenseNumber").value.trim();
    const yearsOfExperience = parseInt(document.getElementById("yearsOfExperience").value);
    const email = emailInput.value.trim();
    const countryCode = document.getElementById("countryCode").value;
    const phone = document.getElementById("phone").value.trim();
    const consent = document.getElementById("consent").checked;

    // Hospitals
    const hospitalInputs = hospitalAffiliationsContainer.querySelectorAll(".hospital-entry");
    const hospitals = [];
    hospitalInputs.forEach(entry => {
      const name = entry.querySelector("input[name='hospitalName[]']").value;
      const years = entry.querySelector("input[name='hospitalYears[]']").value;
      if (name) hospitals.push(`${name} (${years} years)`);
    });

    // Error messages
    const fnError = document.getElementById("firstNameError");
    const lnError = document.getElementById("lastNameError");
    const expError = document.getElementById("experienceError");

    let isValid = true;

    if (!validateName(firstName)) {
      fnError.style.display = "block";
      isValid = false;
    } else {
      fnError.style.display = "none";
    }

    if (!validateName(lastName, 1)) {
      lnError.style.display = "block";
      isValid = false;
    } else {
      lnError.style.display = "none";
    }

    if (!validateExperience(yearsOfExperience)) {
      expError.style.display = "block";
      isValid = false;
    } else {
      expError.style.display = "none";
    }

    if (!email.includes("@")) {
      errorMessage.style.display = "block";
      isValid = false;
    } else {
      errorMessage.style.display = "none";
    }

    if (!isValid) return;

    // Show preview
    generatePreview({
      firstName,
      lastName,
      specialty: specialtyVal,
      yearsOfExperience,
      email,
      phone,
      countryCode,
      hospitals
    });

    // Show modal
    successModal.style.display = "flex";
  });

  closeModalBtn.addEventListener("click", () => {
    successModal.style.display = "none";
    form.reset();
    hintMessage.style.display = "none";
    previewCard.innerHTML = "";
    customSpecialtyContainer.classList.add("hidden");
  });
});
