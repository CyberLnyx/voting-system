const proceedBtn = document.querySelector("button#proceed");
const infoModal = document.querySelector(".info-modal");
const homepage_container = document.querySelector(".homepage-container");
const email_validation_form = document.querySelector("#email-validation-form");
const email_input = document.querySelector("input[type='email']");
const loadingIndicator = document.querySelector(".request-loading");
const loadingDone = document.querySelector(".request-done");

// INFO MODAL CLOSES INFO MODAL AND OPENS FORMS;
function closeInfoModal(e) {
  e.preventDefault();
  infoModal.style.display = "none";
  homepage_container.style.display = "block";
}

// FORM VALIDATION
function handleSubmit(e) {
  e.preventDefault();
  const email = email_input.value.trim();
  if (!email) return;
  const isValidEmail = emailValidator(email);
  if (!isValidEmail) {
    // SHOW THAT THE EMAIL IS INVALID;
    return alert("Enter a valid email");
  }
  return verifyEmail(email);
}

// CHECKS IF THE EMAIL IS VALID
function emailValidator(email) {
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
}

// SENDS EMAIL TO SERVER FOR VERIFICATION
const verifyEmail = async (email) => {
  try {
    // const id = toast.loading("Verifying your email...");
    loadingDone.classList.remove("success");
    loadingDone.classList.remove("error");
    loadingDone.style.display = "none";
    loadingIndicator.style.display = "flex";
    const response = await fetch("/api/v1/auth/send-verification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    const jsonResponse = await response.json();
    if (jsonResponse?.success) {
      //do something else
      //   toast.update(id, {
      //     render: jsonResponse?.msg,
      //     type: "success",
      //     isLoading: false,
      //     autoClose: true,
      //   });
      loadingIndicator.style.display = "none";
      loadingDone.classList.add("success");
      loadingDone.querySelector("p").textContent = jsonResponse?.msg;
      loadingDone.style.display = "flex";
      let timeOut = setTimeout(() => {
        loadingDone.style.display = "none";
        clearTimeout(timeOut);
      }, 1500);
    } else {
      loadingIndicator.style.display = "none";
      loadingDone.classList.add("error");
      loadingDone.querySelector("p").textContent = jsonResponse?.msg;
      loadingDone.style.display = "flex";
      let timeOut = setTimeout(() => {
        loadingDone.style.display = "none";
        clearTimeout(timeOut);
      }, 1500);
    }
  } catch (error) {
    console.log("Error", error);
  }
};

// EVENT LISTENERS
email_validation_form.addEventListener("submit", handleSubmit);
proceedBtn.addEventListener("click", closeInfoModal);
